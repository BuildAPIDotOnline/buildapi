'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CreditCard,
  Layers,
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  apiCallLimit: number;
  status: string;
  popular: boolean;
}

interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  order: number;
}

export default function AdminPlansIndustriesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [industryDialogOpen, setIndustryDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price: 0,
    featuresStr: '',
    apiCallLimit: 10000,
    status: 'active' as 'active' | 'inactive',
    popular: false,
  });
  const [industryForm, setIndustryForm] = useState({
    name: '',
    slug: '',
    description: '',
    active: true,
    order: 0,
  });

  const { toast } = useToast();

  const fetchPlans = async () => {
    try {
      const res = await api.get<{ plans: Plan[] }>('/api/admin/plans');
      setPlans(res.plans);
    } catch {
      toast({ title: 'Error', description: 'Failed to load plans', variant: 'destructive' });
    }
  };

  const fetchIndustries = async () => {
    try {
      const res = await api.get<{ industries: Industry[] }>('/api/admin/industries');
      setIndustries(res.industries);
    } catch {
      toast({ title: 'Error', description: 'Failed to load industries', variant: 'destructive' });
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchPlans(), fetchIndustries()]);
      setLoading(false);
    })();
  }, []);

  const openPlanCreate = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      description: '',
      price: 0,
      featuresStr: '',
      apiCallLimit: 10000,
      status: 'active',
      popular: false,
    });
    setPlanDialogOpen(true);
  };

  const openPlanEdit = (p: Plan) => {
    setEditingPlan(p);
    setPlanForm({
      name: p.name,
      description: p.description,
      price: p.price,
      featuresStr: p.features.join('\n'),
      apiCallLimit: p.apiCallLimit,
      status: p.status as 'active' | 'inactive',
      popular: p.popular,
    });
    setPlanDialogOpen(true);
  };

  const savePlan = async () => {
    const features = planForm.featuresStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!planForm.name.trim() || !planForm.description.trim()) {
      toast({ title: 'Error', description: 'Name and description required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      if (editingPlan) {
        await api.put(`/api/admin/plans/${editingPlan.id}`, {
          name: planForm.name.trim(),
          description: planForm.description.trim(),
          price: Number(planForm.price),
          features,
          apiCallLimit: planForm.apiCallLimit,
          status: planForm.status,
          popular: planForm.popular,
        });
        toast({ title: 'Plan updated' });
      } else {
        await api.post('/api/admin/plans', {
          name: planForm.name.trim(),
          description: planForm.description.trim(),
          price: Number(planForm.price),
          features,
          apiCallLimit: planForm.apiCallLimit,
          status: planForm.status,
          popular: planForm.popular,
        });
        toast({ title: 'Plan created' });
      }
      setPlanDialogOpen(false);
      await fetchPlans();
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof ApiClientError ? e.message : 'Failed to save plan',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm('Delete this plan?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/plans/${id}`);
      toast({ title: 'Plan deleted' });
      await fetchPlans();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete plan', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const openIndustryCreate = () => {
    setEditingIndustry(null);
    setIndustryForm({
      name: '',
      slug: '',
      description: '',
      active: true,
      order: industries.length,
    });
    setIndustryDialogOpen(true);
  };

  const openIndustryEdit = (i: Industry) => {
    setEditingIndustry(i);
    setIndustryForm({
      name: i.name,
      slug: i.slug,
      description: i.description,
      active: i.active,
      order: i.order,
    });
    setIndustryDialogOpen(true);
  };

  const saveIndustry = async () => {
    if (!industryForm.name.trim()) {
      toast({ title: 'Error', description: 'Name required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: industryForm.name.trim(),
        slug: industryForm.slug.trim() || undefined,
        description: industryForm.description.trim(),
        active: industryForm.active,
        order: industryForm.order,
      };
      if (editingIndustry) {
        await api.put(`/api/admin/industries/${editingIndustry.id}`, payload);
        toast({ title: 'Industry updated' });
      } else {
        await api.post('/api/admin/industries', payload);
        toast({ title: 'Industry created' });
      }
      setIndustryDialogOpen(false);
      await fetchIndustries();
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof ApiClientError ? e.message : 'Failed to save industry',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteIndustry = async (id: string) => {
    if (!confirm('Delete this industry?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/industries/${id}`);
      toast({ title: 'Industry deleted' });
      await fetchIndustries();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete industry', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex justify-center p-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* API Plans */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <CreditCard size={22} className="text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">API Plans</h2>
          </div>
          <Button
            onClick={openPlanCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold gap-2"
          >
            <Plus size={18} /> Create Plan
          </Button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Limit</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {plans.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{p.name}</span>
                      {p.popular && (
                        <span className="ml-2 text-[10px] font-bold text-amber-600 uppercase">Popular</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">₦{p.price}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {p.apiCallLimit === -1 ? '∞' : p.apiCallLimit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          p.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openPlanEdit(p)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deletePlan(p.id)}
                          disabled={deletingId === p.id}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
                        >
                          {deletingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plans.length === 0 && (
            <div className="p-8 text-center text-slate-500">No plans yet. Create one to get started.</div>
          )}
        </div>
      </section>

      {/* Industries */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Layers size={22} className="text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Industries</h2>
          </div>
          <Button
            onClick={openIndustryCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold gap-2"
          >
            <Plus size={18} /> Create Industry
          </Button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slug</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {industries.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50/30">
                    <td className="px-6 py-4 font-medium text-slate-900">{i.name}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{i.slug}</td>
                    <td className="px-6 py-4 text-slate-600">{i.order}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          i.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {i.active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openIndustryEdit(i)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteIndustry(i.id)}
                          disabled={deletingId === i.id}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
                        >
                          {deletingId === i.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {industries.length === 0 && (
            <div className="p-8 text-center text-slate-500">No industries yet. Create one to get started.</div>
          )}
        </div>
      </section>

      {/* Plan Dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
            <DialogDescription>Fill in the plan details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={planForm.name}
                onChange={(e) => setPlanForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Professional"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input
                value={planForm.description}
                onChange={(e) => setPlanForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Price (₦)</label>
                <Input
                  type="number"
                  min={0}
                  value={planForm.price || ''}
                  onChange={(e) => setPlanForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">API call limit (-1 = unlimited)</label>
                <Input
                  type="number"
                  value={planForm.apiCallLimit}
                  onChange={(e) => setPlanForm((f) => ({ ...f, apiCallLimit: Number(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Features (one per line)</label>
              <textarea
                className="w-full min-h-[80px] p-3 rounded-lg border border-slate-200 text-sm"
                value={planForm.featuresStr}
                onChange={(e) => setPlanForm((f) => ({ ...f, featuresStr: e.target.value }))}
                placeholder="Feature 1&#10;Feature 2"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={planForm.status === 'active'}
                  onChange={(e) =>
                    setPlanForm((f) => ({ ...f, status: e.target.checked ? 'active' : 'inactive' }))
                  }
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={planForm.popular}
                  onChange={(e) => setPlanForm((f) => ({ ...f, popular: e.target.checked }))}
                />
                <span className="text-sm">Popular</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={savePlan} disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {editingPlan ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Industry Dialog */}
      <Dialog open={industryDialogOpen} onOpenChange={setIndustryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingIndustry ? 'Edit Industry' : 'Create Industry'}</DialogTitle>
            <DialogDescription>Fill in the industry details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={industryForm.name}
                onChange={(e) => setIndustryForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Banking"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug (optional, auto from name)</label>
              <Input
                value={industryForm.slug}
                onChange={(e) => setIndustryForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="banking"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input
                value={industryForm.description}
                onChange={(e) => setIndustryForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Order</label>
              <Input
                type="number"
                min={0}
                value={industryForm.order}
                onChange={(e) => setIndustryForm((f) => ({ ...f, order: Number(e.target.value) || 0 }))}
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={industryForm.active}
                onChange={(e) => setIndustryForm((f) => ({ ...f, active: e.target.checked }))}
              />
              <span className="text-sm">Active</span>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIndustryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveIndustry} disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {editingIndustry ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

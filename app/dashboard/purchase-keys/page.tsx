"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Download, CreditCard, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import  AnalyticsSection  from '@/components/dashboard/AnalyticsSection';
import  PurchaseHistory, { PurchaseHistoryItem } from '@/components/PurchaseHistory';
import  PurchaseWizard  from '@/components/PurchaseWizard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { api, ApiClientError } from '@/lib/api-client';

export default function PurchasePage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [selectedPurchase, setSelectedPurchase] = React.useState<PurchaseHistoryItem | null>(null);
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedInvoice) {
      // Reset state when new invoice is selected
      setSelectedPurchase(null);
      setPurchaseError(null);
      setLoadingPurchase(true);

      // Validate ID format before making request
      if (!selectedInvoice || selectedInvoice.trim() === '') {
        setPurchaseError('Invalid payment ID');
        setLoadingPurchase(false);
        return;
      }

      // Fetch purchase details when an invoice is selected
      console.log('Fetching payment details for ID:', selectedInvoice);
      api.get<{ payment: PurchaseHistoryItem }>(`/api/payments/${selectedInvoice}`)
        .then(data => {
          console.log('Payment data received:', data);
          if (data && data.payment) {
            setSelectedPurchase(data.payment);
            setPurchaseError(null);
          } else {
            console.error('No payment data in response:', data);
            setPurchaseError('Payment details not found');
            setSelectedPurchase(null);
          }
        })
        .catch((err: ApiClientError | Error) => {
          console.error('Error fetching purchase details:', err);
          const errorMessage = err instanceof ApiClientError 
            ? (err.details || err.message)
            : err instanceof Error
            ? err.message
            : 'Failed to load purchase details';
          setPurchaseError(errorMessage);
          setSelectedPurchase(null);
        })
        .finally(() => {
          setLoadingPurchase(false);
        });
    } else {
      // Reset when modal closes
      setSelectedPurchase(null);
      setPurchaseError(null);
      setLoadingPurchase(false);
    }
  }, [selectedInvoice]);

  return (
    <div className="space-y-10 relative pb-20">
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 ">API Marketplace</h1>
          <p className="text-slate-500 mt-2 font-medium">Provision new keys for Banking, CRM, E-commerce, or CMS.</p>
        </div>
        <Button 
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white h-12 rounded-lg font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200"
        >
          <Plus size={20} /> Purchase New Key
        </Button>
      </div>

      {/* Analytics Overview */}
      <AnalyticsSection />
      <PurchaseHistory onViewDetails={(id) => setSelectedInvoice(id)} />

    

      {/* Modals */}
      <PurchaseWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />

      {/* Purchase Details Modal */}
      <Dialog open={selectedInvoice !== null} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-xl h-auto max-h-[500px] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {loadingPurchase ? 'Loading Purchase Details' : 
               purchaseError ? 'Error Loading Purchase' : 
               'Purchase Details'}
            </DialogTitle>
          </DialogHeader>
          
          {loadingPurchase ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : purchaseError ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <AlertCircle className="text-red-500" size={32} />
              <p className="text-red-600 font-medium">{purchaseError}</p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </Button>
            </div>
          ) : selectedPurchase ? (
                      <>
                          <div className="flex justify-between items-center gap-2 pr-8 -mt-4">
                    <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        {selectedPurchase.status}
                      </span>
                    </div>
                  </div>
             
              
              <Tabs defaultValue="invoice" className="flex-1 flex flex-col overflow-hidden mt-2">
                <TabsList className="flex w-full grid-cols-3">
                  <TabsTrigger value="invoice">Invoice</TabsTrigger>
                  <TabsTrigger value="application">Application</TabsTrigger>
                  <TabsTrigger value="receipt">Receipt</TabsTrigger>
                </TabsList>

                <TabsContent value="invoice" className="flex-1 overflow-y-auto mt-4 space-y-4">
                  {/* Status Badge */}
                 

                  {/* Invoice Information */}
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Invoice Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Invoice ID</p>
                        <p className="text-sm font-bold text-slate-900">{selectedPurchase.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                        <p className="text-sm font-medium text-slate-900">{selectedPurchase.date}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Amount</p>
                        <p className="text-lg font-bold text-blue-600">{selectedPurchase.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction Reference</p>
                        <p className="text-sm font-medium text-slate-600 font-mono">{selectedPurchase.transactionReference}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="application" className="flex-1 overflow-y-auto mt-4 space-y-4">
                  {/* Application Details */}
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Application Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Application Name</p>
                        <p className="text-sm font-medium text-slate-900">{selectedPurchase.appName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Website URL</p>
                        <a 
                          href={selectedPurchase.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
                        >
                          {selectedPurchase.url}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Industry</p>
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                          {selectedPurchase.industry}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pricing Plan</p>
                        <p className="text-sm font-bold text-slate-900">{selectedPurchase.plan}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="receipt" className="flex-1 overflow-y-auto mt-4 space-y-4">
                  {/* Receipt Details */}
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Receipt Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
                        <div className="flex items-center gap-2">
                          <CreditCard className="text-slate-400" size={16} />
                          <p className="text-sm font-medium text-slate-900">{selectedPurchase.paymentMethod}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                        <p className="text-sm font-medium text-slate-900">{selectedPurchase.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Status</p>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="text-emerald-600" size={16} />
                          <p className="text-sm font-medium text-emerald-600">Payment Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Receipt Button */}
                  <div className="pt-4 border-t border-slate-200">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download Receipt (PDF)
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No purchase details found.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
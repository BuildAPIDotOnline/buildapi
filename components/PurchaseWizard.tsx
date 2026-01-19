"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Landmark, Users, ShoppingBag, Layout, X, ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertCircle, Zap, Rocket, Building2 } from 'lucide-react';
import { api, ApiClientError } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

// Will be loaded dynamically on client side
let usePaystackPayment: any = null;

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number; // in NGN
  features: string[];
  popular?: boolean;
}

interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const iconMap: Record<string, any> = {
  'Starter': Zap,
  'Professional': Rocket,
  'Enterprise': Building2,
};

const colorMap: Record<string, string> = {
  'Starter': 'text-blue-600 bg-blue-50 border-blue-100',
  'Professional': 'text-purple-600 bg-purple-50 border-purple-100',
  'Enterprise': 'text-emerald-600 bg-emerald-50 border-emerald-100',
};

const industryIconMap: Record<string, any> = {
  'Banking': Landmark,
  'CRM': Users,
  'E-commerce': ShoppingBag,
  'CMS': Layout,
};

const industryColorMap: Record<string, string> = {
  'Banking': 'text-blue-600 bg-blue-50 border-blue-100',
  'CRM': 'text-purple-600 bg-purple-50 border-purple-100',
  'E-commerce': 'text-emerald-600 bg-emerald-50 border-emerald-100',
  'CMS': 'text-amber-600 bg-amber-50 border-amber-100',
};

export default function PurchaseWizard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ industry: '', plan: '', name: '', url: '', email: '', env: 'Production' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const { toast } = useToast();

  // Fetch pricing plans and industries on mount
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plansResponse, industriesResponse] = await Promise.all([
        api.get<{ plans: PricingPlan[] }>('/api/pricing/plans'),
        api.get<{ industries: Industry[] }>('/api/industries'),
      ]);

      setPricingPlans(plansResponse.plans);
      setIndustries(industriesResponse.industries);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pricing plans and industries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({ industry: '', plan: '', name: '', url: '', email: '', env: 'Production' });
      setPaymentStatus('idle');
      setPaymentMessage('');
      setIsProcessingPayment(false);
      setTransactionRef(null);
      setGeneratedApiKey(null);
      setPaymentDetails(null);
    }
  }, [isOpen]);

  // Get selected plan details
  const selectedPlan = pricingPlans.find(p => p.id === formData.plan);
  
  // Payment configuration
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
  const amount = selectedPlan ? selectedPlan.price * 100 : 0; // Convert to kobo

  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !paystackLoaded) {
      import('react-paystack').then((module) => {
        usePaystackPayment = module.usePaystackPayment;
        setPaystackLoaded(true);
      });
    }
  }, [paystackLoaded]);

  // Store payment ID from create response for verification
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  // Create a stable config for Paystack hook (with placeholder initially)
  const defaultConfig = {
    reference: `temp_${Date.now()}`,
    email: formData.email || 'customer@example.com',
    amount: 0,
    publicKey,
    currency: 'NGN' as const,
    metadata: { payment_id: '', custom_fields: [] },
  };

  // Create config with paymentId when available - this will be set after payment creation
  const paystackConfig = useMemo(() => {
    if (!paymentId || !transactionRef) {
      return defaultConfig; // Use placeholder until we have paymentId
    }
    
    return {
      reference: transactionRef,
      email: formData.email || 'customer@example.com',
      amount: amount || 0,
      publicKey,
      currency: 'NGN' as const,
      metadata: {
        payment_id: paymentId, // Store payment ID for verification lookup
        custom_fields: [
          {
            display_name: 'Industry',
            variable_name: 'industry',
            value: formData.industry || '',
          },
          {
            display_name: 'Application Name',
            variable_name: 'app_name',
            value: formData.name || '',
          },
          {
            display_name: 'Origin URL',
            variable_name: 'origin_url',
            value: formData.url || '',
          },
          {
            display_name: 'Pricing Plan',
            variable_name: 'pricing_plan',
            value: selectedPlan?.name || '',
          },
        ],
      },
    };
  }, [transactionRef, formData.email, amount, publicKey, paymentId, formData.industry, formData.name, formData.url, selectedPlan?.name, defaultConfig]);

  // Initialize Paystack hook with current config (will update when config changes)
  const initializePayment = typeof window !== 'undefined' && paystackLoaded && usePaystackPayment
    ? usePaystackPayment(paystackConfig)
    : (() => {
        if (typeof window !== 'undefined') {
          console.warn('Paystack not loaded yet');
        }
      }) as any;

  // Track if we should auto-initialize payment after payment creation
  const [shouldInitializePayment, setShouldInitializePayment] = useState(false);

  // Auto-initialize payment when paymentId and transactionRef are set
  useEffect(() => {
    if (!shouldInitializePayment || !paymentId || !transactionRef || !paystackLoaded || !usePaystackPayment) {
      return;
    }

    // Verify the config has the payment_id before initializing
    if (paystackConfig.metadata.payment_id !== paymentId || paystackConfig.reference !== transactionRef) {
      // Config not ready yet, wait a bit and check again (via re-trigger)
      const timeoutId = setTimeout(() => {
        // Re-check - if still not ready, will timeout
        if (shouldInitializePayment) {
          setShouldInitializePayment(false);
          setShouldInitializePayment(true);
        }
      }, 150);
      
      return () => clearTimeout(timeoutId);
    }

    // Config is ready, initialize payment
    console.log('Auto-initializing Paystack payment:', { 
      payment_id: paymentId,
      reference: transactionRef
    });
    
    try {
      if (initializePayment && typeof initializePayment === 'function') {
        initializePayment({
          onSuccess: handlePaymentSuccess,
          onClose: handlePaymentClose,
        });
        setShouldInitializePayment(false); // Reset flag
      } else {
        console.warn('initializePayment is not available');
        setShouldInitializePayment(false);
        setPaymentStatus('error');
        setPaymentMessage('Payment service not ready. Please try again.');
      }
    } catch (error) {
      console.error('Error auto-initializing Paystack:', error);
      setPaymentStatus('error');
      setPaymentMessage('Failed to initialize payment. Please try again.');
      setShouldInitializePayment(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldInitializePayment, paymentId, transactionRef, paystackLoaded, paystackConfig.metadata.payment_id, paystackConfig.reference]);

  const handlePaymentSuccess = async (reference: any) => {
    setIsProcessingPayment(true);
    setPaymentStatus('idle');
    setPaymentMessage('');

    try {
      const response = await api.post<{ status: string; message: string; data?: any }>(
        '/api/payments/verify',
        { reference: reference.reference }
      );

      if (response.status === 'success') {
        setPaymentStatus('success');
        setPaymentMessage('Payment verified successfully! Your API key has been created.');
        // Store API key if returned
        if (response.data?.apiKey?.key) {
          setGeneratedApiKey(response.data.apiKey.key);
        }
        if (response.data) {
          setPaymentDetails(response.data);
        }
        toast({
          title: 'Payment successful',
          description: 'Your API key is now active!',
        });
        // Move to success step (step 5)
        setStep(5);
      } else {
        setPaymentStatus('error');
        setPaymentMessage(response.message || 'Payment verification failed. Please contact support.');
        toast({
          title: 'Verification failed',
          description: response.message || 'Please contact support.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('error');
      const errorMessage = error instanceof ApiClientError
        ? error.message
        : 'An error occurred while verifying payment. Please contact support with your transaction reference.';
      setPaymentMessage(errorMessage);
      toast({
        title: 'Verification error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentClose = () => {
    setPaymentStatus('idle');
    setPaymentMessage('');
    setIsProcessingPayment(false);
  };

  const normalizeUrl = (url: string): string => {
    if (!url) return url;
    url = url.trim();
    // If URL doesn't start with http:// or https://, add https://
    if (!url.match(/^https?:\/\//i)) {
      return `https://${url}`;
    }
    return url;
  };

  const handleProceedToPayment = async () => {
    // Validate required fields before proceeding
    if (!formData.industry) {
      setPaymentStatus('error');
      setPaymentMessage('Please select an industry.');
      toast({
        title: 'Validation Error',
        description: 'Please select an industry',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedPlan) {
      setPaymentStatus('error');
      setPaymentMessage('Please select a pricing plan.');
      toast({
        title: 'Validation Error',
        description: 'Please select a pricing plan',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name || formData.name.trim() === '') {
      setPaymentStatus('error');
      setPaymentMessage('Please enter an app name.');
      toast({
        title: 'Validation Error',
        description: 'Please enter an app name',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.url || formData.url.trim() === '') {
      setPaymentStatus('error');
      setPaymentMessage('Please enter a website URL.');
      toast({
        title: 'Validation Error',
        description: 'Please enter a website URL',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email || formData.email.trim() === '') {
      setPaymentStatus('error');
      setPaymentMessage('Please provide your email address to proceed with payment.');
      toast({
        title: 'Validation Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }
    
    if (!publicKey) {
      setPaymentStatus('error');
      setPaymentMessage('Payment service is not configured. Please contact support.');
      return;
    }

    // Normalize URL (add https:// if missing)
    const normalizedUrl = normalizeUrl(formData.url);

    try {
      // Create payment order first
      const paymentResponse = await api.post<{ success: boolean; payment: { transactionReference: string } }>(
        '/api/payments/create',
        {
          planId: formData.plan,
          industry: formData.industry,
          appName: formData.name.trim(),
          url: normalizedUrl,
          email: formData.email.trim(),
        }
      );

      if (paymentResponse.success && paymentResponse.payment) {
        // Extract payment ID and transaction reference
        const paymentIdValue = (paymentResponse.payment as any).paymentId || (paymentResponse.payment as any).id;
        const transactionRefValue = paymentResponse.payment.transactionReference;
        
        if (!paymentIdValue) {
          throw new Error('Payment ID not returned from server');
        }
        
        // Set both state values - this will trigger config recreation via useMemo
        // The useEffect will then auto-initialize payment when ready
        setTransactionRef(transactionRefValue);
        setPaymentId(paymentIdValue);
        
        // Set flag to trigger auto-initialization via useEffect
        // This ensures we wait for state updates and config to be ready
        setShouldInitializePayment(true);
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      setPaymentStatus('error');
      
      let errorMessage = 'Failed to create payment. Please try again.';
      
      if (error instanceof ApiClientError) {
        // If there are validation details, format them nicely
        if (error.details && Array.isArray(error.details)) {
          const validationErrors = error.details
            .map((err: any) => {
              const field = err.path?.join('.') || err.path?.[0] || 'Field';
              const message = err.message || err.error || 'Invalid value';
              // Make field names more user-friendly
              const friendlyField = field === 'url' ? 'Website URL' : 
                                   field === 'appName' ? 'App Name' :
                                   field === 'planId' ? 'Pricing Plan' :
                                   field === 'industry' ? 'Industry' :
                                   field === 'email' ? 'Email' : field;
              return `${friendlyField}: ${message}`;
            })
            .join(', ');
          errorMessage = `Validation error: ${validationErrors}`;
        } else {
          errorMessage = error.message;
        }
      }
      
      setPaymentMessage(errorMessage);
      toast({
        title: 'Payment creation failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl p-12 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition">
          <X size={24} />
        </button>

        <div className="p-12">
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? "bg-blue-600" : "bg-slate-100"}`} />
            ))}
          </div>

          {/* STEP 1: Industry Selection */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Select Industry</h2>
              <p className="text-slate-500 mb-8">Choose the vertical this API key will serve.</p>
              <div className="grid grid-cols-2 gap-4">
                {industries.map((ind) => {
                  const Icon = industryIconMap[ind.name] || Layout;
                  const colorClass = industryColorMap[ind.name] || 'text-slate-600 bg-slate-50 border-slate-100';
                  return (
                    <button 
                      key={ind.id} 
                      onClick={() => { setFormData({...formData, industry: ind.name}); setStep(2); }}
                      className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${formData.industry === ind.name ? `${colorClass} border-current ring-4 ring-slate-50` : "bg-white border-slate-100 hover:border-slate-200"}`}
                    >
                      <Icon size={28} />
                      <span className="font-bold text-sm">{ind.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Pricing Plan Selection */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Select Pricing Plan</h2>
              <p className="text-slate-500 mb-8">Choose the plan that best fits your needs.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {pricingPlans.map((plan) => {
                  const Icon = iconMap[plan.name] || Zap;
                  const isSelected = formData.plan === plan.id;
                  const colorClass = colorMap[plan.name] || 'text-blue-600 bg-blue-50 border-blue-100';
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setFormData({...formData, plan: plan.id})}
                      className={`p-6 rounded-xl border-2 transition-all text-left relative ${isSelected ? `${colorClass} border-current ring-4 ring-slate-50` : "bg-white border-slate-100 hover:border-slate-200"}`}
                    >
                      {plan.popular && (
                        <span className="absolute top-3 right-3 text-xs font-bold bg-purple-600 text-white px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                      <div className="flex flex-col items-start gap-3 mb-4">
                        <Icon size={24} />
                        <div>
                          <h3 className="font-bold text-lg">{plan.name}</h3>
                          <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="text-2xl font-bold">₦{plan.price.toLocaleString()}</span>
                        <span className="text-slate-500 text-sm">/month</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                            <span className="text-slate-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 text-slate-600 p-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={!formData.plan}
                  className="flex-1 bg-slate-900 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Technical Details */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Technical Details</h2>
              <p className="text-slate-500 mb-8">Provide the destination details for this key.</p>
              <div className="space-y-4 mb-8">
                <input 
                  placeholder="App Name (e.g. My FinTech App)" 
                  className="w-full p-5 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="url"
                  placeholder="Website URL (e.g. myapp.com or https://myapp.com)" 
                  className="w-full p-5 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  required
                />
                <input 
                  type="email"
                  placeholder="Email Address (for payment receipt)" 
                  className="w-full p-5 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 transition"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 bg-slate-100 text-slate-600 p-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={() => setStep(4)}
                  disabled={!formData.name || !formData.url || !formData.email}
                  className="flex-1 bg-slate-900 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Order <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Overview */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Review Order</h2>
              <p className="text-slate-500 mb-8">Confirm your configuration before payment.</p>
              
              {/* Payment Status Messages */}
              {paymentStatus === 'success' && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-emerald-900 font-medium">{paymentMessage}</p>
                  </div>
                </div>
              )}

              {paymentStatus === 'error' && paymentMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-red-900 font-medium">{paymentMessage}</p>
                  </div>
                </div>
              )}

              {selectedPlan && (
                <div className="bg-slate-50 rounded-3xl p-8 space-y-4 border border-slate-100 mb-8">
                  <div className="flex justify-between"><span>Industry:</span><span className="font-bold">{formData.industry}</span></div>
                  <div className="flex justify-between"><span>Pricing Plan:</span><span className="font-bold">{selectedPlan.name}</span></div>
                  <div className="flex justify-between"><span>Application:</span><span className="font-bold">{formData.name}</span></div>
                  <div className="flex justify-between"><span>Origin URL:</span><span className="font-bold">{formData.url}</span></div>
                  <div className="flex justify-between"><span>Email:</span><span className="font-bold">{formData.email}</span></div>
                  <div className="border-t border-slate-200 pt-4 flex justify-between text-lg">
                    <span>Total Amount:</span><span className="font-bold text-blue-600">₦{selectedPlan.price.toLocaleString()}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setStep(3);
                    setPaymentStatus('idle');
                    setPaymentMessage('');
                  }}
                  disabled={isProcessingPayment}
                  className="flex-1 bg-slate-100 text-slate-600 p-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={handleProceedToPayment}
                  disabled={isProcessingPayment || paymentStatus === 'success' || !selectedPlan}
                  className="flex-1 bg-blue-600 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success Screen */}
          {step === 5 && paymentStatus === 'success' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 text-center py-12">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-emerald-600" size={48} />
              </div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight text-slate-900">Payment Successful!</h2>
              <p className="text-slate-500 mb-8 text-lg">Your API key has been created and activated.</p>
              
              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

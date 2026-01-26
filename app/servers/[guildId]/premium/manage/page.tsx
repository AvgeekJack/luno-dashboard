'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface SubscriptionData {
  id: string;
  status: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  canceledAt: number | null;
  amount: number;
  currency: string;
  interval: string;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  invoicePdf: string | null;
  hostedInvoiceUrl: string | null;
  periodStart: number;
  periodEnd: number;
}

export default function ManageSubscriptionPage() {
  const { data: session, status } = useSession();
  const { guildId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [billingHistory, setBillingHistory] = useState<Invoice[]>([]);
  const [canceling, setCanceling] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch(`/api/servers/${guildId}/subscription`);
        if (!res.ok) {
          throw new Error('Failed to fetch subscription');
        }
        const data = await res.json();
        console.log('[Frontend] Subscription data received:', data);
        setSubscription(data);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
        setError('Failed to load subscription details');
      } finally {
        setLoading(false);
      }
    };

    const fetchBillingHistory = async () => {
      try {
        const res = await fetch(`/api/servers/${guildId}/billing`);
        if (res.ok) {
          const data = await res.json();
          console.log('[Frontend] Billing data received:', data);
          setBillingHistory(data.invoices || []);
        }
      } catch (error) {
        console.error('Failed to fetch billing history:', error);
      }
    };

    if (guildId) {
      fetchSubscription();
      fetchBillingHistory();
    }
  }, [guildId]);

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to turn off auto-renewal? You will retain access until the end of your billing period.')) {
      return;
    }

    setCanceling(true);
    try {
      const res = await fetch(`/api/servers/${guildId}/subscription/cancel`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const data = await res.json();
      setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
      alert('Auto-renewal disabled. You will retain access until ' + new Date(data.currentPeriodEnd * 1000).toLocaleDateString());
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to disable auto-renewal. Please try again.');
    } finally {
      setCanceling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setReactivating(true);
    try {
      const res = await fetch(`/api/servers/${guildId}/subscription/reactivate`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to reactivate subscription');
      }

      const data = await res.json();
      setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: false } : null);
      alert('Auto-renewal enabled. Your subscription will continue after ' + new Date(data.currentPeriodEnd * 1000).toLocaleDateString());
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      alert('Failed to enable auto-renewal. Please try again.');
    } finally {
      setReactivating(false);
    }
  };

  const formatDate = (timestamp: number | string) => {
    // Convert to number if it's a string
    let numTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    
    // Check if valid number
    if (isNaN(numTimestamp) || numTimestamp === 0) {
      console.error('Invalid timestamp:', timestamp);
      return 'Invalid Date';
    }
    
    // Stripe always returns Unix timestamps in SECONDS
    // Multiply by 1000 to convert to milliseconds for JavaScript Date
    const milliseconds = numTimestamp * 1000;
    const date = new Date(milliseconds);
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date created from timestamp:', numTimestamp);
      return 'Invalid Date';
    }
    
    const formatted = date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    return formatted;
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (error || !subscription) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] text-[#0f172a] py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href={`/servers/${guildId}`}
              className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Manage Subscription</h1>
              <p className="text-slate-600 mt-2">View your subscription details and billing history</p>
            </div>

            {/* No Active Subscription Notice */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="text-center py-6">
                <h2 className="text-2xl font-bold mb-2">No Active Subscription</h2>
                <p className="text-slate-600 mb-6">You don't currently have an active premium subscription.</p>
                <Link
                  href={`/servers/${guildId}/premium`}
                  className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                >
                  Subscribe to Premium
                </Link>
              </div>
            </div>

            {/* Billing History */}
            {billingHistory.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Billing History</h3>
                <div className="space-y-3">
                  {billingHistory.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">
                          {formatAmount(invoice.amount, invoice.currency)}
                        </p>
                        <p className="text-sm text-slate-600">
                          {formatDate(invoice.created)} • {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Period: {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                        </p>
                      </div>
                      {invoice.hostedInvoiceUrl && (
                        <a
                          href={invoice.hostedInvoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition text-sm"
                        >
                          View Invoice
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#0f172a] py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href={`/servers/${guildId}/premium`}
            className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
          >
            ← Back to Premium
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Manage Subscription</h1>
            <p className="text-slate-600 mt-2">View and manage your Luno Premium subscription</p>
          </div>

          {/* Subscription Status */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Subscription Details</h2>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : subscription.status === 'canceled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Plan</p>
                <p className="text-lg font-semibold">
                  {formatAmount(subscription.amount, subscription.currency)} / {subscription.interval === 'month' ? 'Monthly' : subscription.interval === 'year' ? 'Yearly' : subscription.interval}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Subscription ID</p>
                <p className="text-sm font-mono text-slate-700">{subscription.id}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Current Period Start</p>
                <p className="text-lg font-semibold">{formatDate(subscription.currentPeriodStart)}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Current Period End</p>
                <p className="text-lg font-semibold">{formatDate(subscription.currentPeriodEnd)}</p>
              </div>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-800">Auto-Renewal Disabled</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. You will retain access until then.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auto-Renewal Control */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Auto-Renewal</h3>
            <p className="text-slate-600 mb-6">
              Control whether your subscription automatically renews at the end of each billing period.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-semibold text-slate-900">Automatic Renewal</p>
                <p className="text-sm text-slate-600 mt-1">
                  {subscription.cancelAtPeriodEnd 
                    ? 'Your subscription will not renew automatically' 
                    : 'Your subscription will renew automatically'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${subscription.cancelAtPeriodEnd ? 'text-red-600' : 'text-green-600'}`}>
                  {subscription.cancelAtPeriodEnd ? 'OFF' : 'ON'}
                </span>
                {subscription.cancelAtPeriodEnd ? (
                  <button
                    onClick={handleReactivateSubscription}
                    disabled={reactivating}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                  >
                    {reactivating ? 'Enabling...' : 'Enable Auto-Renewal'}
                  </button>
                ) : (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={canceling}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                  >
                    {canceling ? 'Disabling...' : 'Disable Auto-Renewal'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Need Help?</h3>
            <p className="text-slate-600 mb-4">
              If you have any questions about your subscription or need assistance, feel free to contact our support team.
            </p>
          </div>

          {/* Billing History */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Billing History</h3>
            {billingHistory.length === 0 ? (
              <p className="text-slate-600">No billing history available yet.</p>
            ) : (
              <div className="space-y-3">
                {billingHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {formatAmount(invoice.amount, invoice.currency)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatDate(invoice.created)} • {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </p>
                    </div>
                    {invoice.hostedInvoiceUrl && (
                      <a
                        href={invoice.hostedInvoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition text-sm"
                      >
                        View Invoice
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cancel Subscription Section */}
          {!subscription.cancelAtPeriodEnd && (
            <div className="bg-white border border-red-200 rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-red-900 mb-4">Cancel Subscription</h3>
              <p className="text-slate-600 mb-6">
                If you cancel your subscription, auto-renewal will be disabled and you will retain access to premium features until {formatDate(subscription.currentPeriodEnd)}. You can re-enable auto-renewal at any time before then.
              </p>
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
              >
                {canceling ? 'Processing...' : 'Turn Off Auto-Renewal'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

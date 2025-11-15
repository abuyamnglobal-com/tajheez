'use client';

import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import TajheezHeader from '@/components/TajheezHeader';
import { BRAND_COLORS } from '@/lib/theme/brand';
import {
  getPendingApprovals,
  approveTransaction as approvePendingTransaction,
  rejectTransaction as rejectPendingTransaction,
} from '@/lib/api/approvals';
import type { TransactionRecord } from '@/lib/api/transactions';
import { CheckIcon, XMarkIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { CheckCircle, Clock, ShieldAlert } from 'lucide-react';

const USER_ID = 1;

export default function ApprovalsPage() {
  const [pendingTransactions, setPendingTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getPendingApprovals()
      .then((data) => {
        if (isMounted) {
          setPendingTransactions(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load approvals');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const summaryCards = useMemo(
    () => [
      { label: 'Pending Actions', value: pendingTransactions.length, icon: Clock, color: BRAND_COLORS.STATUS.SUBMITTED },
      {
        label: 'High Priority',
        value: pendingTransactions.filter((tx) => tx.amount >= 10000).length,
        icon: ShieldAlert,
        color: BRAND_COLORS.STATUS.REJECTED,
      },
      { label: 'Ready to Approve', value: pendingTransactions.length, icon: CheckCircle, color: BRAND_COLORS.STATUS.APPROVED },
    ],
    [pendingTransactions]
  );

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedTransactionId(null);
    setRejectionComment('');
  };

  const handleApprove = async (id: number) => {
    setActionError(null);
    setActionId(id);
    try {
      await approvePendingTransaction(id, USER_ID);
      setPendingTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve transaction';
      setActionError(message);
    } finally {
      setActionId(null);
    }
  };

  const handleRejectClick = (id: number) => {
    setSelectedTransactionId(id);
    setShowRejectModal(true);
    setActionError(null);
    setRejectionComment('');
  };

  const handleRejectSubmit = async () => {
    if (!selectedTransactionId) return;
    if (!rejectionComment.trim()) {
      setActionError('Rejection comment is required.');
      return;
    }
    setActionError(null);
    setActionId(selectedTransactionId);
    try {
      await rejectPendingTransaction(selectedTransactionId, USER_ID, rejectionComment.trim());
      setPendingTransactions((prev) => prev.filter((tx) => tx.id !== selectedTransactionId));
      closeRejectModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reject transaction';
      setActionError(message);
    } finally {
      setActionId(null);
    }
  };

  const renderTransactionCard = (transaction: TransactionRecord) => {
    const statusColor =
      transaction.statusVariant === 'success'
        ? BRAND_COLORS.STATUS.APPROVED
        : transaction.statusVariant === 'danger'
        ? BRAND_COLORS.STATUS.REJECTED
        : BRAND_COLORS.STATUS.SUBMITTED;
    const isProcessing = actionId === transaction.id;

    return (
      <div key={transaction.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">{transaction.date}</p>
            <h3 className="text-lg font-semibold mt-1" style={{ color: BRAND_COLORS.NAVY }}>
              {transaction.company}
            </h3>
            <p className="text-sm text-gray-500">{transaction.category}</p>
          </div>
          <div className="text-right">
            <p
              className="text-xl font-bold"
              style={{ color: transaction.type === 'In' ? BRAND_COLORS.STATUS.APPROVED : BRAND_COLORS.STATUS.REJECTED }}
            >
              {transaction.type === 'In' ? '+' : '-'} {transaction.amount.toLocaleString()} OMR
            </p>
            <p className="text-xs text-gray-500">Workflow Status</p>
          </div>
        </div>
        {transaction.description && <p className="text-sm text-gray-600">{transaction.description}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: statusColor }}
          >
            {transaction.status}
          </span>
          <div className="flex gap-2">
            <Button
              onClick={() => handleApprove(transaction.id)}
              variant="primary"
              Icon={CheckIcon}
              disabled={isProcessing}
              className="text-sm"
            >
              {isProcessing ? 'Processing...' : 'Approve'}
            </Button>
            <Button
              onClick={() => handleRejectClick(transaction.id)}
              variant="danger"
              Icon={XMarkIcon}
              disabled={isProcessing}
              className="text-sm"
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout mainClassName="p-0">
      <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.BG_LIGHT }}>
        <TajheezHeader title="Approvals" subtitle="Workflow" />
        <div className="p-4 pt-6 pb-24 md:px-8 space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            {summaryCards.map((card) => (
              <div key={card.label} className="rounded-2xl p-4 shadow-md text-white" style={{ backgroundColor: card.color }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">{card.label}</p>
                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                  </div>
                  <card.icon size={32} className="opacity-80" />
                </div>
              </div>
            ))}
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {actionError && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              {actionError}
            </div>
          )}

          <section className="space-y-4" data-testid="approvals-list">
            <h2 className="text-xl font-semibold" style={{ color: BRAND_COLORS.NAVY }}>
              Pending Transactions
            </h2>
            {loading ? (
              <p className="text-gray-600">Loading approvals...</p>
            ) : pendingTransactions.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center shadow">
                <p className="text-gray-600">No transactions are awaiting your approval.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTransactions.map((transaction) => renderTransactionCard(transaction))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Modal
        isOpen={showRejectModal}
        onClose={closeRejectModal}
        title={`Reject Transaction #${selectedTransactionId ?? ''}`}
        footer={
          <>
            <Button variant="secondary" onClick={closeRejectModal} Icon={ArrowUturnLeftIcon}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRejectSubmit} Icon={XMarkIcon} disabled={actionId === selectedTransactionId}>
              {actionId === selectedTransactionId ? 'Submitting...' : 'Confirm Reject'}
            </Button>
          </>
        }
      >
        <p className="mb-4">Please provide a reason for rejecting this transaction:</p>
        <textarea
          className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-tajheez-red"
          rows={4}
          value={rejectionComment}
          onChange={(e) => setRejectionComment(e.target.value)}
          placeholder="Enter rejection reason..."
        />
      </Modal>
    </Layout>
  );
}

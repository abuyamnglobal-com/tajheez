'use client';

import Link from 'next/link';
import { useState } from 'react';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import Modal from '@/components/Modal';


export default function ApprovalsPage() {
  const [pendingTransactions, setPendingTransactions] = useState([
    { id: 1, company: 'ABC Corp', amount: 1200, date: '2023-10-26', category: 'Software', description: 'Software license renewal' },
    { id: 2, company: 'XYZ Ltd', amount: 500, date: '2023-10-25', category: 'Hardware', description: 'New keyboard and mouse' },
    { id: 3, company: 'Global Solutions', amount: 3000, date: '2023-10-24', category: 'Services', description: 'Consulting services for Q4' },
  ]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');

  const handleApprove = (id: number) => {
    console.log(`Transaction ${id} approved.`);
    setPendingTransactions(pendingTransactions.filter(tx => tx.id !== id));
    // In a real app, this would involve an API call
  };

  const handleRejectClick = (id: number) => {
    setSelectedTransactionId(id);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (selectedTransactionId !== null && rejectionComment.trim() !== '') {
      console.log(`Transaction ${selectedTransactionId} rejected with comment: "${rejectionComment}"`);
      setPendingTransactions(pendingTransactions.filter(tx => tx.id !== selectedTransactionId));
      // In a real app, this would involve an API call
      setShowRejectModal(false);
      setRejectionComment('');
      setSelectedTransactionId(null);
    } else {
      alert('Rejection comment is required.');
    }
  };

  return (
    <Layout>
        <h1 className="text-3xl font-bold text-tajheez-dark-navy mb-8">Pending Approvals</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {pendingTransactions.length === 0 ? (
            <p className="text-gray-600">No pending transactions for approval.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingTransactions.map((transaction) => (
                <div key={transaction.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg shadow-sm hover:bg-gray-50 transition duration-200">
                  <div className="mb-2 md:mb-0">
                    <p className="text-lg font-semibold text-gray-800">{transaction.company} - ${transaction.amount}</p>
                    <p className="text-sm text-gray-600">{transaction.category} | {transaction.date}</p>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(transaction.id)}
                      variant="primary" // Assuming green is primary for approve
                      Icon={CheckIcon}
                      className="text-sm"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectClick(transaction.id)}
                      variant="danger"
                      Icon={XMarkIcon}
                      className="text-sm"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reject Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Transaction"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowRejectModal(false)} Icon={ArrowUturnLeftIcon}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleRejectSubmit} Icon={XMarkIcon}>
                Confirm Reject
              </Button>
            </>
          }
        >
          <p className="mb-4">Please provide a reason for rejecting transaction #{selectedTransactionId}:</p>
          <textarea
            className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-tajheez-red"
            rows={4}
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
            placeholder="Enter rejection reason..."
          ></textarea>
        </Modal>
    </Layout>
  );
}

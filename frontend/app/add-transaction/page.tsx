'use client';

import Link from 'next/link';
import { useState } from 'react';
import Layout from '@/components/Layout';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import Button from '@/components/Button';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  TagIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  CalendarIcon,
  PaperClipIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';


export default function AddTransactionPage() {
  const [formData, setFormData] = useState({
    company: '',
    fromParty: '',
    toParty: '',
    category: '',
    amount: '',
    paymentMethod: '',
    date: '',
    description: '',
    attachment: null as File | null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field when it changes
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.company) newErrors.company = 'Company is required';
    if (!formData.fromParty) newErrors.fromParty = 'From Party is required';
    if (!formData.toParty) newErrors.toParty = 'To Party is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment Method is required';
    if (!formData.date) newErrors.date = 'Date is required';

    if (formData.fromParty && formData.toParty && formData.fromParty === formData.toParty) {
      newErrors.fromParty = 'From Party cannot be the same as To Party';
      newErrors.toParty = 'To Party cannot be the same as From Party';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      console.log('Submitting transaction:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      setSuccessMessage('Transaction added successfully!');
      setFormData({ // Clear form
        company: '', fromParty: '', toParty: '', category: '', amount: '',
        paymentMethod: '', date: '', description: '', attachment: null,
      });
      // Clear file input manually if needed, or reset form via ref
      const fileInput = document.getElementById('attachment') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setErrors({ submit: 'Failed to add transaction. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Software', 'Hardware', 'Services', 'Marketing', 'Travel', 'Other'];
  const paymentMethods = ['Bank Transfer', 'Credit Card', 'Cash', 'Cheque'];
  const parties = ['Supplier A', 'Client B', 'Internal Dept C', 'Partner D']; // Dummy parties

  return (
    <Layout>
        <h1 className="text-3xl font-bold text-tajheez-dark-navy mb-8">Add New Transaction</h1>

        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          {successMessage && (
            <div className="bg-tajheez-green-light border border-tajheez-green text-tajheez-green px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          {errors.submit && (
            <div className="bg-tajheez-red-light border border-tajheez-red text-tajheez-red px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{errors.submit}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Company"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
              Icon={BuildingOfficeIcon}
              required
            />

            <SelectField
              label="From Party"
              id="fromParty"
              name="fromParty"
              value={formData.fromParty}
              onChange={handleChange}
              options={parties.map(party => ({ value: party, label: party }))}
              error={errors.fromParty}
              Icon={UserGroupIcon}
              required
            />

            <SelectField
              label="To Party"
              id="toParty"
              name="toParty"
              value={formData.toParty}
              onChange={handleChange}
              options={parties.map(party => ({ value: party, label: party }))}
              error={errors.toParty}
              Icon={UserGroupIcon}
              required
            />

            <SelectField
              label="Category"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories.map(cat => ({ value: cat, label: cat }))}
              error={errors.category}
              Icon={TagIcon}
              required
            />

            <InputField
              label="Amount"
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              error={errors.amount}
              Icon={CurrencyDollarIcon}
              required
              min="0.01"
              step="0.01"
            />

            <SelectField
              label="Payment Method"
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              options={paymentMethods.map(method => ({ value: method, label: method }))}
              error={errors.paymentMethod}
              Icon={CreditCardIcon}
              required
            />

            <InputField
              label="Date"
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              Icon={CalendarIcon}
              required
            />

            <InputField
              label="Attachment"
              id="attachment"
              name="attachment"
              type="file"
              onChange={handleFileChange}
              Icon={PaperClipIcon}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-tajheez-orange-light file:text-tajheez-orange hover:file:bg-tajheez-orange-light"
            />

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>

            <div className="md:col-span-2 flex items-center justify-between mt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                Icon={PlusCircleIcon}
              >
                {loading ? 'Adding Transaction...' : 'Add Transaction'}
              </Button>
            </div>
          </form>
        </div>
    </Layout>
  );
}

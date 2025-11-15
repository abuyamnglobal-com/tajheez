'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import Button from '@/components/Button';
import {
  UserGroupIcon,
  TagIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  CalendarIcon,
  PaperClipIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { createTransaction, CreateTransactionPayload } from '@/lib/api/transactions';
import { getParties, Party } from '@/lib/api/parties';
import { getCategories, Category } from '@/lib/api/categories';
import { getPaymentMethods, PaymentMethod } from '@/lib/api/payment-methods';


const BRAND_COLORS = {
  NAVY: '#101F3B',
  ORANGE: '#FF8C00',
  BG_LIGHT: '#F7F8F9',
};

export default function AddTransactionPage() {
  const [formData, setFormData] = useState<Omit<CreateTransactionPayload, 'created_by'>>({
    trx_date: '',
    from_party_id: 0,
    to_party_id: 0,
    category_code: '',
    amount: 0,
    payment_method_code: '',
    description: '',
    from_account_id: null,
    to_account_id: null,
    related_tx_id: null,
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [parties, setParties] = useState<Party[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [partiesData, categoriesData, paymentMethodsData] = await Promise.all([
          getParties(),
          getCategories(),
          getPaymentMethods(),
        ]);
        setParties(partiesData);
        setCategories(categoriesData);
        setPaymentMethods(paymentMethodsData);
      } catch (error) {
        console.error('Failed to fetch form data', error);
        setErrors({ submit: 'Failed to load form data. Please refresh the page.' });
      }
    }
    fetchData();
  }, []);


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
      setAttachment(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.from_party_id) newErrors.from_party_id = 'From Party is required';
    if (!formData.to_party_id) newErrors.to_party_id = 'To Party is required';
    if (!formData.category_code) newErrors.category_code = 'Category is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.payment_method_code) newErrors.payment_method_code = 'Payment Method is required';
    if (!formData.trx_date) newErrors.trx_date = 'Date is required';

    if (formData.from_party_id && formData.to_party_id && formData.from_party_id === formData.to_party_id) {
      newErrors.from_party_id = 'From Party cannot be the same as To Party';
      newErrors.to_party_id = 'To Party cannot be the same as From Party';
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
      // TODO: Get the real user ID
      const userId = 1;
      await createTransaction({ ...formData, created_by: userId });
      setSuccessMessage('Transaction added successfully!');
      setFormData({ // Clear form
        trx_date: '', from_party_id: 0, to_party_id: 0, category_code: '', amount: 0,
        payment_method_code: '', description: '', from_account_id: null, to_account_id: null, related_tx_id: null,
      });
      setAttachment(null);
      // Clear file input manually if needed, or reset form via ref
      const fileInput = document.getElementById('attachment') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Failed to add transaction', error);
      setErrors({ submit: 'Failed to add transaction. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout mainClassName="bg-[#F7F8F9] p-0">
      <div className="max-w-4xl mx-auto p-6 pb-16 space-y-6">
        <header className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 rounded-full bg-white shadow text-gray-500 hover:text-gray-900"
            onClick={() => history.back()}
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <p className="text-sm text-gray-500">Transactions</p>
            <h1 className="text-2xl font-bold" style={{ color: BRAND_COLORS.NAVY }}>
              Add New Transaction
            </h1>
          </div>
        </header>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{errors.submit}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="From Party"
              id="from_party_id"
              name="from_party_id"
              value={formData.from_party_id}
              onChange={handleChange}
              options={parties.map(party => ({ value: party.id.toString(), label: party.name }))}
              error={errors.from_party_id}
              Icon={UserGroupIcon}
              required
            />

            <SelectField
              label="To Party"
              id="to_party_id"
              name="to_party_id"
              value={formData.to_party_id}
              onChange={handleChange}
              options={parties.map(party => ({ value: party.id.toString(), label: party.name }))}
              error={errors.to_party_id}
              Icon={UserGroupIcon}
              required
            />

            <SelectField
              label="Category"
              id="category_code"
              name="category_code"
              value={formData.category_code}
              onChange={handleChange}
              options={categories.map(cat => ({ value: cat.code, label: cat.label }))}
              error={errors.category_code}
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
              id="payment_method_code"
              name="payment_method_code"
              value={formData.payment_method_code}
              onChange={handleChange}
              options={paymentMethods.map(method => ({ value: method.code, label: method.label }))}
              error={errors.payment_method_code}
              Icon={CreditCardIcon}
              required
            />

            <InputField
              label="Date"
              id="trx_date"
              name="trx_date"
              type="date"
              value={formData.trx_date}
              onChange={handleChange}
              error={errors.trx_date}
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
            {attachment && (
              <p className="text-xs text-gray-500">
                Selected file: <span className="font-semibold">{attachment.name}</span>
              </p>
            )}

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
      </div>
    </Layout>
  );
}

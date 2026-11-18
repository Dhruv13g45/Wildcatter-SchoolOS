import React, { useState, useEffect } from 'react';
import api from '../api/client.js';
import {
  CreditCard,
  Split,
  CheckCircle2,
  Building,
  Truck,
  Shirt,
  Sparkles,
  Zap,
  PlusCircle,
} from 'lucide-react';

export const FinancialBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [tuitionSplit, setTuitionSplit] = useState(30000);
  const [transportSplit, setTransportSplit] = useState(9000);
  const [uniformSplit, setUniformSplit] = useState(6000);
  const [loading, setLoading] = useState(false);
  const [settlementResult, setSettlementResult] = useState(null);

  // New Invoice form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newGrossAmount, setNewGrossAmount] = useState('45000');
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  // Scholarship test state
  const [aidIncome, setAidIncome] = useState(480000);
  const [aidTax, setAidTax] = useState(12500);
  const [aidResult, setAidResult] = useState(null);
  const [aidLoading, setAidLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/finance/invoices');
      const list = res.data.invoices || [];
      setInvoices(list);
      if (list.length > 0 && !selectedInvoice) {
        setSelectedInvoice(list[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateRealInvoice = async (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    setCreatingInvoice(true);
    try {
      const gross = Number(newGrossAmount) || 45000;
      const res = await api.post('/finance/invoices', {
        student_id: `PER-${Math.floor(1000 + Math.random() * 9000)}`,
        student_name: newStudentName.trim(),
        gross_due_inr: gross,
      });

      setNewStudentName('');
      setShowCreateForm(false);
      fetchInvoices();
      setSelectedInvoice(res.data.invoice);

      // Proportionally update sliders
      setTuitionSplit(Math.round(gross * 0.65));
      setTransportSplit(Math.round(gross * 0.20));
      setUniformSplit(gross - Math.round(gross * 0.65) - Math.round(gross * 0.20));
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingInvoice(false);
    }
  };

  const totalAmount = tuitionSplit + transportSplit + uniformSplit;

  const handleProcessSplit = async () => {
    setLoading(true);
    setSettlementResult(null);

    const payload = {
      student_id: selectedInvoice?.student_id || 'PER-1001',
      invoice_id: selectedInvoice?.invoice_id || 'INV-2026-REAL',
      total_amount_inr: totalAmount,
      splits: [
        {
          merchant_account_id: 'acc_campus_main_01',
          amount_inr: tuitionSplit,
        },
        {
          merchant_account_id: 'acc_transit_logistics_02',
          amount_inr: transportSplit,
        },
        {
          merchant_account_id: 'acc_uniform_outfitter_03',
          amount_inr: uniformSplit,
        },
      ],
    };

    try {
      const res = await api.post('/finance/process-fee-split', payload);
      setSettlementResult(res.data);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAidAudit = async () => {
    setAidLoading(true);
    try {
      const res = await api.post('/agents/financial-aid-auditor', {
        targetPersonId: selectedInvoice?.student_id || 'PER-STUDENT',
        declaredGrossIncomeInr: Number(aidIncome),
        taxPaidInr: Number(aidTax),
        householdSize: 4,
        regionalTier: 'NCR_TIER_2',
      });
      setAidResult(res.data.assessment);
    } catch (err) {
      console.error(err);
    } finally {
      setAidLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              School Fees & Automatic Payments
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Collect fees easily. When parents pay, funds automatically distribute to tuition, bus operators, and uniform vendors.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showCreateForm ? 'Close Form' : 'Create Student Fee Bill'}</span>
        </button>
      </div>

      {/* Real Invoice Creator Form */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateRealInvoice}
          className="p-6 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 backdrop-blur-md space-y-5"
        >
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
            Create a New Student Fee Bill:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">
                Student Full Name:
              </label>
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">
                Total Fee Amount (₹):
              </label>
              <input
                type="number"
                value={newGrossAmount}
                onChange={(e) => setNewGrossAmount(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={creatingInvoice}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition"
            >
              {creatingInvoice ? 'Creating...' : 'Save & Add to Fee List'}
            </button>
          </div>
        </form>
      )}

      {/* Invoices List Selector */}
      {invoices.length > 0 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 flex-shrink-0">
            Select Student:
          </span>
          {invoices.map((inv) => (
            <button
              key={inv.invoice_id}
              onClick={() => {
                setSelectedInvoice(inv);
                const gross = inv.gross_due_inr;
                setTuitionSplit(Math.round(gross * 0.65));
                setTransportSplit(Math.round(gross * 0.20));
                setUniformSplit(gross - Math.round(gross * 0.65) - Math.round(gross * 0.20));
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition flex-shrink-0 border ${
                selectedInvoice?.invoice_id === inv.invoice_id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                  : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300'
              }`}
            >
              {inv.student_name} • ₹{inv.gross_due_inr.toLocaleString()}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Fee Split Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Split className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Automatic Fee Split</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Bill for: <strong>{selectedInvoice?.student_name || 'Select a student'}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Fee</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Split Sliders with Breathing Space */}
            <div className="space-y-5 bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
              {/* Core Tuition */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>School Campus Tuition (65%)</span>
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white">₹{tuitionSplit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={tuitionSplit}
                  onChange={(e) => setTuitionSplit(Number(e.target.value))}
                  className="w-full accent-indigo-600 bg-slate-200 dark:bg-zinc-800 h-2 rounded cursor-pointer"
                />
              </div>

              {/* Transit */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-blue-600 dark:text-blue-400 flex items-center space-x-2">
                    <Truck className="w-4 h-4" />
                    <span>School Bus & Transport Service (20%)</span>
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white">₹{transportSplit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="30000"
                  step="500"
                  value={transportSplit}
                  onChange={(e) => setTransportSplit(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-slate-200 dark:bg-zinc-800 h-2 rounded cursor-pointer"
                />
              </div>

              {/* Uniform */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-amber-600 dark:text-amber-400 flex items-center space-x-2">
                    <Shirt className="w-4 h-4" />
                    <span>Uniform & Books Vendor (15%)</span>
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white">₹{uniformSplit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={uniformSplit}
                  onChange={(e) => setUniformSplit(Number(e.target.value))}
                  className="w-full accent-amber-600 bg-slate-200 dark:bg-zinc-800 h-2 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <span className="text-xs text-slate-500">
                Payment Method: <strong className="text-slate-800 dark:text-white">Razorpay Route Multi-Transfer</strong>
              </span>

              <button
                onClick={handleProcessSplit}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{loading ? 'Processing Payment...' : 'Distribute Fee Splits Automatically'}</span>
              </button>
            </div>

            {/* Split Order Response in Green */}
            {settlementResult && (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payment Settled Successfully: {settlementResult.razorpay_order_id}</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Transfers were dispatched instantly to the school account, bus fleet, and uniform vendor.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Scholarship Calculator */}
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold">
                Scholarship & Aid Calculator
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Calculates automatic tuition discounts based on annual family income.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">
                  Family Annual Income (₹/year):
                </label>
                <input
                  type="number"
                  value={aidIncome}
                  onChange={(e) => setAidIncome(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400 block mb-1.5">
                  Income Tax Paid (₹):
                </label>
                <input
                  type="number"
                  value={aidTax}
                  onChange={(e) => setAidTax(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleRunAidAudit}
                disabled={aidLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl shadow transition"
              >
                {aidLoading ? 'Checking...' : 'Check Eligible Scholarship'}
              </button>
            </div>

            {aidResult && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-emerald-800 dark:text-emerald-300">Scholarship Discount:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {aidResult.suggested_waiver_percentage}% Tuition Waiver
                  </span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 italic pt-1">{aidResult.rationale}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

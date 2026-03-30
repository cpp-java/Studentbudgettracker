import { useState } from "react";
import { Plus, TrendingUp, Trash2, Pencil } from "lucide-react";
import { useExpense } from "../context/ExpenseContext";
import { Income as IncomeType } from "../data/expenseTypes";
import { format } from "date-fns";

export function Income() {
  const { income, addIncome, deleteIncome, getTotalIncome } = useExpense();
  const [showAddModal, setShowAddModal] = useState(false);

  const totalIncome = getTotalIncome();

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-1">Income</h2>
          <p className="text-sm text-slate-600">Track your earnings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-400 to-green-500 text-white p-3 rounded-full hover:shadow-lg transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Total Income Card */}
      <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-3xl p-6 shadow-lg text-white">
        <p className="text-sm opacity-90 mb-2">Total Income</p>
        <div className="text-5xl mb-2">£{totalIncome.toFixed(2)}</div>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <TrendingUp className="w-4 h-4" />
          <span>{income.length} transaction{income.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Income List */}
      <div>
        <h3 className="text-lg mb-4 text-slate-700">All Income</h3>
        
        {income.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No income recorded yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-green-500 hover:text-green-600 font-medium"
            >
              Add your first income
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {income.map((inc) => (
              <div
                key={inc.id}
                className="bg-white rounded-2xl p-4 hover:shadow-md transition-shadow shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 truncate">{inc.source}</h4>
                      <p className="text-xs text-slate-500">
                        {format(new Date(inc.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-lg font-semibold text-green-500">
                      +£{inc.amount.toFixed(2)}
                    </div>
                    <button
                      onClick={() => deleteIncome(inc.id)}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <IncomeModal
          onClose={() => setShowAddModal(false)}
          onSave={(inc) => {
            addIncome(inc);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

interface IncomeModalProps {
  onClose: () => void;
  onSave: (income: { amount: number; source: string; date: string }) => void;
}

function IncomeModal({ onClose, onSave }: IncomeModalProps) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      amount: parseFloat(amount),
      source: source.trim(),
      date,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl mb-6 font-semibold">Add Income</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block mb-2 text-slate-700">
              Amount (£)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label htmlFor="source" className="block mb-2 text-slate-700">
              Source
            </label>
            <input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., Salary, Allowance, Part-time job"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block mb-2 text-slate-700">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl hover:shadow-lg transition-all"
            >
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import { CATEGORY_COLORS } from "../data/expenseTypes";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { useState } from "react";

export function Dashboard() {
  const { expenses, budgets, income, getTotalSpending, getTotalIncome, getRemainingBudget, getBudgetStatus, addIncome } =
    useExpense();
  const { userEmail } = useAuth();
  const navigate = useNavigate();
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  const totalSpent = getTotalSpending();
  const totalIncome = getTotalIncome();
  const overallBudget = budgets.find((b) => b.category === "overall");
  const overallRemaining = getRemainingBudget("overall");
  const overallStatus = getBudgetStatus("overall");

  // Calculate actual balance: Income - Expenses
  const actualBalance = totalIncome - totalSpent;

  // Recent expenses - top 5
  const recentExpenses = expenses.slice(0, 5);
  
  // Recent income - top 3
  const recentIncome = income.slice(0, 3);

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6 pb-24 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-1">Home</h2>
        <p className="text-sm text-slate-600">Welcome back, {userEmail}</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-3xl p-6 shadow-lg text-white">
        <p className="text-sm opacity-90 mb-2">Current Balance</p>
        <div className="text-5xl mb-6">£{actualBalance.toFixed(2)}</div>
        
        {/* Status Indicators */}
        <div className="flex gap-3">
          {/* Income */}
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-xs opacity-90">
              +£{totalIncome.toFixed(0)} Income
            </span>
          </div>

          {/* Spent Amount */}
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-xs opacity-90">
              -£{totalSpent.toFixed(0)} Spent
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/expenses")}
          className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-red-500"
        >
          <TrendingDown className="w-5 h-5" />
          <span className="font-medium">Add Expense</span>
        </button>
        <button
          onClick={() => setShowIncomeModal(true)}
          className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-green-500"
        >
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Add Income</span>
        </button>
      </div>

      {/* Recent Income */}
      {recentIncome.length > 0 && (
        <div>
          <h3 className="text-lg mb-4 text-slate-700">Recent Income</h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            {recentIncome.map((inc) => (
              <div
                key={inc.id}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{inc.source}</div>
                    <div className="text-xs text-slate-500">
                      {format(new Date(inc.date), "MMM dd")}
                    </div>
                  </div>
                </div>
                <div className="text-green-500 font-semibold">
                  +£{inc.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg mb-4 text-slate-700">Recent Expenses</h3>
        
        {recentExpenses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-500 mb-4">No transactions yet</p>
            <button
              onClick={() => navigate("/expenses")}
              className="text-blue-500 hover:text-blue-600"
            >
              Add your first expense
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                  />
                  <div>
                    <div className="font-medium text-slate-800">
                      {expense.notes || expense.category}
                    </div>
                    <div className="text-xs text-slate-500">
                      {format(new Date(expense.date), "MMM dd")}
                    </div>
                  </div>
                </div>
                <div className="text-red-500 font-semibold">
                  -£{expense.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Income Modal */}
      {showIncomeModal && (
        <IncomeModal
          onClose={() => setShowIncomeModal(false)}
          onSave={(inc) => {
            addIncome(inc);
            setShowIncomeModal(false);
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
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
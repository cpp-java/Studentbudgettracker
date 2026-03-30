import { useState } from "react";
import { TrendingUp, TrendingDown, AlertCircle, Pencil } from "lucide-react";
import { useExpense } from "../context/ExpenseContext";
import { ExpenseCategory, EXPENSE_CATEGORIES, CATEGORY_COLORS } from "../data/expenseTypes";

export function Budgets() {
  const { budgets, setBudget, getTotalSpending, getRemainingBudget, getBudgetStatus } =
    useExpense();
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | "overall" | null>(null);
  const [editAmount, setEditAmount] = useState("");

  const handleEditBudget = (category: ExpenseCategory | "overall") => {
    const budget = budgets.find((b) => b.category === category);
    setEditingCategory(category);
    setEditAmount(budget?.limit.toString() || "");
  };

  const handleSaveBudget = () => {
    if (editingCategory && editAmount) {
      setBudget(editingCategory, parseFloat(editAmount));
      setEditingCategory(null);
      setEditAmount("");
    }
  };

  const getStatusColor = (status: "safe" | "warning" | "exceeded") => {
    switch (status) {
      case "safe":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "exceeded":
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  const getProgressColor = (status: "safe" | "warning" | "exceeded") => {
    switch (status) {
      case "safe":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "exceeded":
        return "bg-red-500";
    }
  };

  const overallBudget = budgets.find((b) => b.category === "overall");
  const overallSpent = getTotalSpending();
  const overallRemaining = getRemainingBudget("overall");
  const overallStatus = getBudgetStatus("overall");
  const overallPercentage = overallBudget
    ? Math.min((overallSpent / overallBudget.limit) * 100, 100)
    : 0;

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6 pb-24 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-1">Budgets</h2>
        <p className="text-sm text-slate-600">Manage your spending limits</p>
      </div>

      {/* Overall Budget */}
      <div className={`rounded-2xl p-6 shadow-sm ${getStatusColor(overallStatus)}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="mb-1 font-semibold text-lg">Overall Budget</h3>
            <p className="text-sm opacity-80">Monthly total limit</p>
          </div>
          <button
            onClick={() => handleEditBudget("overall")}
            className="p-2 hover:bg-black/5 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl mb-1">£{overallBudget?.limit.toFixed(2)}</div>
              <div className="text-sm opacity-80">Budget limit</div>
            </div>
            <div className="text-right">
              <div className="text-lg">£{overallRemaining.toFixed(2)}</div>
              <div className="text-sm opacity-80">Remaining</div>
            </div>
          </div>

          <div className="w-full bg-black/10 rounded-full h-3">
            <div
              className={`${getProgressColor(overallStatus)} rounded-full h-3 transition-all`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>

          <div className="text-sm">
            Spent: £{overallSpent.toFixed(2)} ({overallPercentage.toFixed(0)}%)
          </div>

          {overallStatus === "exceeded" && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <AlertCircle className="w-4 h-4" />
              <span>You've exceeded your budget!</span>
            </div>
          )}
          {overallStatus === "warning" && (
            <div className="flex items-center gap-2 text-sm mt-2">
              <AlertCircle className="w-4 h-4" />
              <span>Warning: Approaching budget limit</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Budgets */}
      <div>
        <h3 className="mb-4">Category Budgets</h3>
        <div className="space-y-3">
          {EXPENSE_CATEGORIES.map((category) => {
            const budget = budgets.find((b) => b.category === category);
            const spent = getTotalSpending(category);
            const remaining = getRemainingBudget(category);
            const status = getBudgetStatus(category);
            const percentage = budget ? Math.min((spent / budget.limit) * 100, 100) : 0;

            return (
              <div key={category} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[category] }}
                    />
                    <h4>{category}</h4>
                  </div>
                  <button
                    onClick={() => handleEditBudget(category)}
                    className="p-1.5 hover:bg-accent rounded transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      £{spent.toFixed(2)} / £{budget?.limit.toFixed(2)}
                    </span>
                    <span
                      className={`${
                        status === "exceeded"
                          ? "text-red-600"
                          : status === "warning"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      £{remaining.toFixed(2)} left
                    </span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`${getProgressColor(status)} rounded-full h-2 transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl p-6">
            <h3 className="text-xl mb-4">
              Edit {editingCategory === "overall" ? "Overall" : editingCategory} Budget
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="budgetAmount" className="block mb-2">
                  Monthly Limit (£)
                </label>
                <input
                  id="budgetAmount"
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setEditAmount("");
                  }}
                  className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBudget}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
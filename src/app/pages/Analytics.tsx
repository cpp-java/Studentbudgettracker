import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { Calendar, TrendingUp, PieChartIcon } from "lucide-react";
import { useExpense } from "../context/ExpenseContext";
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, ExpenseCategory } from "../data/expenseTypes";
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";

export function Analytics() {
  const { expenses, budgets, income, getTotalSpending, getTotalIncome } = useExpense();
  const [dateRange, setDateRange] = useState<"week" | "month" | "3months">("month");

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "week":
        return {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
          end: now,
        };
      case "month":
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
        };
      case "3months":
        return {
          start: startOfMonth(subMonths(now, 2)),
          end: endOfMonth(now),
        };
    }
  };

  const range = getDateRange();
  const filteredExpenses = expenses.filter((expense) =>
    isWithinInterval(new Date(expense.date), range)
  );

  // Pie chart data - spending by category
  const categoryData = EXPENSE_CATEGORIES.map((category) => {
    const total = filteredExpenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      name: category,
      value: total,
      color: CATEGORY_COLORS[category],
    };
  }).filter((item) => item.value > 0);

  // Bar chart data - budget vs actual
  const budgetComparisonData = EXPENSE_CATEGORIES.map((category) => {
    const budget = budgets.find((b) => b.category === category);
    const actual = getTotalSpending(category);
    return {
      category,
      budget: budget?.limit || 0,
      actual,
    };
  }).filter((item) => item.budget > 0 || item.actual > 0);

  // Line chart data - spending over time (last 7 days or months)
  const getSpendingTrend = () => {
    if (dateRange === "week") {
      // Last 7 days
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayExpenses = expenses.filter(
          (e) => new Date(e.date).toDateString() === date.toDateString()
        );
        const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
        days.push({
          date: format(date, "EEE"),
          amount: total,
        });
      }
      return days;
    } else if (dateRange === "month") {
      // Current month by weeks
      const weeks = [];
      const now = new Date();
      const monthStart = startOfMonth(now);
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date(monthStart);
        weekStart.setDate(monthStart.getDate() + i * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekExpenses = expenses.filter((e) => {
          const expenseDate = new Date(e.date);
          return expenseDate >= weekStart && expenseDate <= weekEnd;
        });
        const total = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
        weeks.push({
          date: `Week ${i + 1}`,
          amount: total,
        });
      }
      return weeks;
    } else {
      // Last 3 months
      const months = [];
      for (let i = 2; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthExpenses = expenses.filter((e) => {
          const expenseDate = new Date(e.date);
          return (
            expenseDate.getMonth() === date.getMonth() &&
            expenseDate.getFullYear() === date.getFullYear()
          );
        });
        const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
        months.push({
          date: format(date, "MMM"),
          amount: total,
        });
      }
      return months;
    }
  };

  const trendData = getSpendingTrend();

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgPerDay = totalSpent / Math.max(1, filteredExpenses.length || 1);

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6 pb-24 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-1">Analytics</h2>
        <p className="text-sm text-slate-600">Visualize your spending patterns</p>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <button
          onClick={() => setDateRange("week")}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
            dateRange === "week"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Last Week
        </button>
        <button
          onClick={() => setDateRange("month")}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
            dateRange === "month"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setDateRange("3months")}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
            dateRange === "3months"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Last 3 Months
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-3xl mb-1 text-blue-500">£{totalSpent.toFixed(2)}</div>
          <div className="text-sm text-slate-600">Total Spent</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-3xl mb-1 text-blue-500">{filteredExpenses.length}</div>
          <div className="text-sm text-slate-600">Transactions</div>
        </div>
      </div>

      {/* Spending by Category - Pie Chart */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-lg">Spending by Category</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `£${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-600 truncate">
                  {item.name}: £{item.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget vs Actual - Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-lg">Budget vs Actual</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={budgetComparisonData}>
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => `£${value.toFixed(2)}`} />
            <Bar dataKey="budget" fill="#cbd5e1" name="Budget" />
            <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Spending Trend - Line Chart */}
      {trendData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-lg">Spending Trend</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `£${value.toFixed(2)}`} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-2xl p-6 shadow-lg">
        <h3 className="mb-3 font-semibold text-lg">Spending Insights</h3>
        <ul className="space-y-2 text-sm opacity-90">
          {categoryData.length > 0 && (
            <li>
              • Your highest spending category is{" "}
              <strong>{categoryData[0].name}</strong> at £
              {categoryData[0].value.toFixed(2)}
            </li>
          )}
          <li>
            • You've made {filteredExpenses.length} transaction
            {filteredExpenses.length !== 1 ? "s" : ""} in this period
          </li>
          {totalSpent > 0 && (
            <li>• Total spending: £{totalSpent.toFixed(2)}</li>
          )}
        </ul>
      </div>
    </div>
  );
}
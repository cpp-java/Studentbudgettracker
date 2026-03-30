import { useState } from "react";
import { Plus, Search, Filter, Pencil, Trash2, Camera } from "lucide-react";
import { useExpense } from "../context/ExpenseContext";
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES, CATEGORY_COLORS } from "../data/expenseTypes";
import { format } from "date-fns";

export function Expenses() {
  const { expenses, addExpense, editExpense, deleteExpense } = useExpense();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | "all">("all");

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-1">Expenses</h2>
          <p className="text-sm text-slate-600">Track your spending</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-3 rounded-full hover:shadow-lg transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expenses..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              filterCategory === "all"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            All
          </button>
          {EXPENSE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                filterCategory === category
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-slate-500 mb-4">No expenses yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-blue-500 hover:text-blue-600"
            >
              Add your first expense
            </button>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white rounded-2xl p-4 hover:shadow-md transition-shadow shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                    />
                    <div>
                      <h4 className="font-medium text-slate-800">{expense.category}</h4>
                      {expense.notes && (
                        <p className="text-sm text-slate-500">{expense.notes}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 ml-12">
                    {format(new Date(expense.date), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-lg font-semibold text-red-500">-£{expense.amount.toFixed(2)}</div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingExpense(expense);
                        setShowAddModal(true);
                      }}
                      className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
              {expense.receiptPhoto && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <img
                    src={expense.receiptPhoto}
                    alt="Receipt"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ExpenseModal
          expense={editingExpense}
          onClose={() => {
            setShowAddModal(false);
            setEditingExpense(null);
          }}
          onSave={(expense) => {
            if (editingExpense) {
              editExpense(editingExpense.id, expense);
            } else {
              addExpense(expense);
            }
            setShowAddModal(false);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
}

interface ExpenseModalProps {
  expense: Expense | null;
  onClose: () => void;
  onSave: (expense: Omit<Expense, "id">) => void;
}

function ExpenseModal({ expense, onClose, onSave }: ExpenseModalProps) {
  const [amount, setAmount] = useState(expense?.amount.toString() || "");
  const [category, setCategory] = useState<ExpenseCategory>(expense?.category || "Food");
  const [date, setDate] = useState(expense?.date || new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState(expense?.notes || "");
  const [receiptPhoto, setReceiptPhoto] = useState(expense?.receiptPhoto || "");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim() || undefined,
      receiptPhoto: receiptPhoto || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl mb-6">{expense ? "Edit Expense" : "Add Expense"}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block mb-2">
              Amount (£)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block mb-2">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="block mb-2">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
              rows={3}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label htmlFor="receipt" className="block mb-2">
              Receipt Photo (optional)
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="receipt"
                className="flex items-center gap-2 px-4 py-3 bg-input-background border border-border rounded-lg cursor-pointer hover:bg-muted transition-colors"
              >
                <Camera className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">
                  {receiptPhoto ? "Change Photo" : "Add Photo"}
                </span>
              </label>
              <input
                id="receipt"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              {receiptPhoto && (
                <button
                  type="button"
                  onClick={() => setReceiptPhoto("")}
                  className="text-sm text-destructive hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            {receiptPhoto && (
              <img
                src={receiptPhoto}
                alt="Receipt preview"
                className="mt-3 w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {expense ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
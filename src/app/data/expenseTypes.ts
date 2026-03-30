export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
  receiptPhoto?: string;
}

export type ExpenseCategory = "Food" | "Books" | "Transport" | "Entertainment" | "Housing" | "Other";

export interface Budget {
  category: ExpenseCategory | "overall";
  limit: number;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Books",
  "Transport",
  "Entertainment",
  "Housing",
  "Other",
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: "#ef4444",
  Books: "#3b82f6",
  Transport: "#8b5cf6",
  Entertainment: "#ec4899",
  Housing: "#f97316",
  Other: "#6b7280",
};

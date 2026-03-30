import { createContext, useContext, useState, ReactNode } from "react";
import { Expense, Budget, Income, ExpenseCategory } from "../data/expenseTypes";

interface ExpenseContextType {
  expenses: Expense[];
  budgets: Budget[];
  income: Income[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  editExpense: (id: string, expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  setBudget: (category: ExpenseCategory | "overall", limit: number) => void;
  addIncome: (income: Omit<Income, "id">) => void;
  deleteIncome: (id: string) => void;
  getTotalSpending: (category?: ExpenseCategory) => number;
  getTotalIncome: () => number;
  getRemainingBudget: (category: ExpenseCategory | "overall") => number;
  getBudgetStatus: (category: ExpenseCategory | "overall") => "safe" | "warning" | "exceeded";
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: "overall", limit: 1000 },
    { category: "Food", limit: 300 },
    { category: "Books", limit: 150 },
    { category: "Transport", limit: 100 },
    { category: "Entertainment", limit: 150 },
    { category: "Housing", limit: 500 },
    { category: "Other", limit: 100 },
  ]);
  const [income, setIncome] = useState<Income[]>([]);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([newExpense, ...expenses]);
  };

  const editExpense = (id: string, expense: Omit<Expense, "id">) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...expense, id } : e)));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const setBudget = (category: ExpenseCategory | "overall", limit: number) => {
    setBudgets((prev) => {
      const existing = prev.find((b) => b.category === category);
      if (existing) {
        return prev.map((b) => (b.category === category ? { ...b, limit } : b));
      }
      return [...prev, { category, limit }];
    });
  };

  const addIncome = (newIncome: Omit<Income, "id">) => {
    const incomeEntry: Income = {
      ...newIncome,
      id: Date.now().toString(),
    };
    setIncome([incomeEntry, ...income]);
  };

  const deleteIncome = (id: string) => {
    setIncome(income.filter((i) => i.id !== id));
  };

  const getTotalSpending = (category?: ExpenseCategory) => {
    return expenses
      .filter((e) => !category || e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalIncome = () => {
    return income.reduce((sum, i) => sum + i.amount, 0);
  };

  const getRemainingBudget = (category: ExpenseCategory | "overall") => {
    const budget = budgets.find((b) => b.category === category);
    if (!budget) return 0;

    const spent =
      category === "overall"
        ? getTotalSpending()
        : getTotalSpending(category as ExpenseCategory);

    return budget.limit - spent;
  };

  const getBudgetStatus = (category: ExpenseCategory | "overall") => {
    const budget = budgets.find((b) => b.category === category);
    if (!budget) return "safe";

    const spent =
      category === "overall"
        ? getTotalSpending()
        : getTotalSpending(category as ExpenseCategory);

    const percentage = (spent / budget.limit) * 100;

    if (percentage >= 100) return "exceeded";
    if (percentage >= 80) return "warning";
    return "safe";
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budgets,
        income,
        addExpense,
        editExpense,
        deleteExpense,
        setBudget,
        addIncome,
        deleteIncome,
        getTotalSpending,
        getTotalIncome,
        getRemainingBudget,
        getBudgetStatus,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
}
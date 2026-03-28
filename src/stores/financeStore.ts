import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'fixed_income' | 'extra_income';
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface PiggyBank {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  yield_rate: number;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Mercado', icon: '🛒', color: '#16a34a' },
  { id: '2', name: 'Alimentação', icon: '🍔', color: '#ea580c' },
  { id: '3', name: 'Lazer', icon: '🎡', color: '#9333ea' },
  { id: '4', name: 'Saúde', icon: '💊', color: '#e11d48' },
  { id: '5', name: 'Transporte', icon: '🚗', color: '#2563eb' },
  { id: '6', name: 'Salário', icon: '💰', color: '#16a34a' },
];

interface FinanceStore {
  user: { id: string; email: string } | null;
  transactions: Transaction[];
  categories: Category[];
  monthlyLimit: number;
  piggyBank: PiggyBank | null;
  chartType: 'bar' | 'area';
  setUser: (user: { id: string; email: string } | null) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
  setMonthlyLimit: (limit: number) => void;
  setPiggyBank: (piggyBank: PiggyBank | null) => void;
  updatePiggyBank: (amount: number) => void;
  setChartType: (type: 'bar' | 'area') => void;
  clearAll: () => void;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      user: null,
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      monthlyLimit: 0,
      piggyBank: null,
      chartType: 'bar',
      setUser: (user) => set({ user }),
      addTransaction: (transaction) =>
        set((state) => ({ transactions: [transaction, ...state.transactions] })),
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      setMonthlyLimit: (monthlyLimit) => set({ monthlyLimit }),
      setPiggyBank: (piggyBank) => set({ piggyBank }),
      updatePiggyBank: (amount) =>
        set((state) => ({
          piggyBank: state.piggyBank ? { ...state.piggyBank, current_amount: amount } : null,
        })),
      setChartType: (chartType) => set({ chartType }),
      clearAll: () => set({ transactions: [], piggyBank: null, user: null, categories: DEFAULT_CATEGORIES, monthlyLimit: 0, chartType: 'bar' }),
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

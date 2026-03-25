import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

interface FinanceStore {
  user: { id: string; email: string } | null;
  transactions: Transaction[];
  piggyBank: PiggyBank | null;
  setUser: (user: { id: string; email: string } | null) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  setPiggyBank: (piggyBank: PiggyBank | null) => void;
  updatePiggyBank: (amount: number) => void;
  clearAll: () => void;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      user: null,
      transactions: [],
      piggyBank: null,
      setUser: (user) => set({ user }),
      addTransaction: (transaction) =>
        set((state) => ({ transactions: [transaction, ...state.transactions] })),
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      setPiggyBank: (piggyBank) => set({ piggyBank }),
      updatePiggyBank: (amount) =>
        set((state) => ({
          piggyBank: state.piggyBank ? { ...state.piggyBank, current_amount: amount } : null,
        })),
      clearAll: () => set({ transactions: [], piggyBank: null, user: null }),
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

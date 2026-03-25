import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'income' | 'expense' | 'fixed_income' | 'extra_income' | 'savings_deposit';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
}

export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

export interface PiggyBank {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  yield_rate: number;
}

export interface User {
  id: string;
  email: string;
}

interface FinanceStore {
  user: User | null;
  transactions: Transaction[];
  goals: Goal[];
  piggyBank: PiggyBank | null;
  setUser: (user: User | null) => void;
  setTransactions: (t: Transaction[]) => void;
  addTransaction: (t: Transaction) => void;
  setGoals: (g: Goal[]) => void;
  addGoal: (g: Goal) => void;
  updateGoal: (id: string, current: number) => void;
  setPiggyBank: (pb: PiggyBank | null) => void;
  updatePiggyBank: (current: number) => void;
  clearAll: () => void;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      user: null,
      transactions: [],
      goals: [],
      piggyBank: null,
      setUser: (user) => set({ user }),
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (t) => set((state) => ({ transactions: [t, ...state.transactions] })),
      setGoals: (goals) => set({ goals }),
      addGoal: (g) => set((state) => ({ goals: [...state.goals, g] })),
      updateGoal: (id, current) => set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? { ...g, current_amount: current } : g))
      })),
      setPiggyBank: (piggyBank) => set({ piggyBank }),
      updatePiggyBank: (current) => set((state) => ({
        piggyBank: state.piggyBank ? { ...state.piggyBank, current_amount: current } : null
      })),
      clearAll: () => set({ user: null, transactions: [], goals: [], piggyBank: null }),
    }),
    {
      name: 'finance-data',
    }
  )
);

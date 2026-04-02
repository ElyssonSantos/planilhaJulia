import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

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

export interface CreditCard {
  id: string;
  name: string;
  type: 'personal' | 'business';
  closingDay: number;
  dueDay: number;
  limit: number;
}

export interface FixedExpense {
  id: string;
  type: 'personal' | 'business';
  category: string;
  description: string;
  amount: number;
  day: number;
  cardId?: string;
}

interface FinanceStore {
  user: { id: string; email: string; username?: string } | null;
  transactions: Transaction[];
  categories: Category[];
  monthlyLimit: number;
  piggyBank: PiggyBank | null;
  chartType: 'bar' | 'area';
  cards: CreditCard[];
  fixedExpenses: FixedExpense[];
  isInitialized: boolean;
  
  setUser: (user: { id: string; email: string; username?: string } | null) => void;
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
  setMonthlyLimit: (limit: number) => void;
  setPiggyBank: (piggyBank: PiggyBank | null) => void;
  updatePiggyBank: (amount: number) => void;
  setChartType: (type: 'bar' | 'area') => void;
  addCard: (card: CreditCard) => void;
  removeCard: (id: string) => void;
  updateCard: (card: CreditCard) => void;
  addFixedExpense: (expense: FixedExpense) => void;
  removeFixedExpense: (id: string) => void;
  updateFixedExpense: (expense: FixedExpense) => void;
  clearAll: () => void;
  pullFromCloud: () => Promise<void>;
}

let syncTimeout: any = null;

const syncStorage: StateStorage = {
  getItem: (name) => {
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
    
    if (syncTimeout) clearTimeout(syncTimeout);
    
    syncTimeout = setTimeout(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const stateData = JSON.parse(value);
          // Só sincroniza se os dados já foram inicializados/baixados da nuvem
          // Isso evita sobrescrever dados da nuvem com o estado inicial vazio
          if (stateData.state?.isInitialized) {
            await supabase.from('profiles').update({ app_state: stateData }).eq('id', session.user.id);
          }
        }
      } catch (err) {
        console.error('Falha ao sincronizar estado com Supabase', err);
      }
    }, 1000);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      user: null,
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      monthlyLimit: 0,
      piggyBank: null,
      chartType: 'bar',
      cards: [],
      fixedExpenses: [],
      isInitialized: false,
      
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
      
      addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
      removeCard: (id) => set((state) => ({ cards: state.cards.filter((c) => c.id !== id) })),
      updateCard: (card) => set((state) => ({ cards: state.cards.map((c) => c.id === card.id ? card : c) })),
      
      addFixedExpense: (expense) => set((state) => ({ fixedExpenses: [...state.fixedExpenses, expense] })),
      removeFixedExpense: (id) => set((state) => ({ fixedExpenses: state.fixedExpenses.filter((e) => e.id !== id) })),
      updateFixedExpense: (expense) => set((state) => ({ fixedExpenses: state.fixedExpenses.map((e) => e.id === expense.id ? expense : e) })),
      
      clearAll: () => set({ 
        transactions: [], 
        piggyBank: null, 
        user: null, 
        categories: DEFAULT_CATEGORIES, 
        monthlyLimit: 0, 
        chartType: 'bar',
        cards: [],
        fixedExpenses: [],
        isInitialized: false
      }),

      pullFromCloud: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) return;

          const { data: profile, error } = await supabase
            .from('profiles')
            .select('app_state, username')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error || !profile) {
            set({ isInitialized: true });
            return;
          }

          let cloudState = profile.app_state;
          if (typeof cloudState === 'string') {
            try { cloudState = JSON.parse(cloudState); } catch { cloudState = null; }
          }

          const cloudData = cloudState?.state || null;
          if (cloudData) {
            const currentState = get();
            
            // Mesclar transações (Cloud tem prioridade)
            const transMap = new Map();
            (currentState.transactions || []).forEach(t => transMap.set(t.id, t));
            (cloudData.transactions || []).forEach((ct: any) => transMap.set(ct.id, ct));

            const mergedTransactions = Array.from(transMap.values()).sort(
              (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            set({
              ...cloudData,
              transactions: mergedTransactions,
              user: {
                id: session.user.id,
                email: session.user.email || '',
                username: profile.username || session.user.user_metadata?.display_name || ''
              },
              isInitialized: true
            });
          } else {
            set({ isInitialized: true });
          }
        } catch (err) {
          console.error('Erro ao buscar dados na nuvem:', err);
          set({ isInitialized: true });
        }
      }
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => syncStorage),
    }
  )
);

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';
import type { Category } from '../types/Category';

interface CategoriesContextType {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await api.getCategories();
        setCategories(response.categories || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        isLoading,
        error,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "../lib/auth-context"
import { CategoriesProvider } from "../lib/categories-context"
import { CartProvider } from "../lib/cart-context"
import { NotificationProvider } from "../lib/notification-context"

const queryClient = new QueryClient();

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <CartProvider>
          <AuthProvider>
            <CategoriesProvider>
              {children}
            </CategoriesProvider>
          </AuthProvider>
        </CartProvider>
      </NotificationProvider>
    </QueryClientProvider>
  )
}
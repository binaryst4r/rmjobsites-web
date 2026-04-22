import type { ServiceRequestFormData, ServiceRequestResponse } from '../types/ServiceRequest';
import type { EquipmentRentalRequestFormData, EquipmentRentalRequestResponse } from '../types/EquipmentRentalRequest';
import type { Customer, UpdateCustomerData, Order, Card } from '../types/customer';
import type { User } from '../types/auth';
import { getUser } from './cookies';

export interface ShippingRateError extends Error {
  code?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('API_URL is not set');
}

// Helper function to create headers with optional authorization
function getAuthHeaders(includeContentType: boolean = true): HeadersInit {
  const headers: HeadersInit = {};

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  // Add Authorization header if user is logged in
  const userCookie = getUser();
  if (userCookie?.jwt) {
    headers['Authorization'] = `Bearer ${userCookie.jwt}`;
  }

  return headers;
}

export const adminApi = {
  async getServiceRequests() {
    const response = await fetch(`${API_URL}/service_requests`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async getRentalRequests() {
    const response = await fetch(`${API_URL}/equipment_rental_requests`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  async getAdminUsers() {
    const response = await fetch(`${API_URL}/users/admins`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch admin users');
    }

    return response.json();
  },

  async assignServiceRequest(serviceRequestId: number, assignedToUserId: number) {
    const response = await fetch(`${API_URL}/service_requests/${serviceRequestId}/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ assigned_to_user_id: assignedToUserId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to assign service request');
    }

    return response.json();
  },
}

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  async getProfile(): Promise<{ user: User }> {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile');
    }

    return response.json();
  },

  async getCategories() {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'GET',
    });
    return response.json();
  },

  async getCategoryById(categoryId: string) {
    const response = await fetch(`${API_URL}/categories/${categoryId}`, {
      method: 'GET',
    });
    return response.json();
  },

  async getProductsByCategoryId(categoryId: string) {
    const response = await fetch(`${API_URL}/categories/${categoryId}/products`, {
      method: 'GET',
    });
    return response.json();
  },

  async register(email: string, password: string, password_confirmation: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, password_confirmation }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || 'Registration failed');
    }

    return response.json();
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/forgot_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || error.error || 'Failed to request password reset');
    }

    return response.json();
  },

  async resetPassword(token: string, password: string, password_confirmation: string) {
    const response = await fetch(`${API_URL}/auth/reset_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password, password_confirmation }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || error.error || 'Failed to reset password');
    }

    return response.json();
  },

  async searchProducts(query: string, limit: number = 5) {
    const response = await fetch(`${API_URL}/products?query=${encodeURIComponent(query)}&limit=${limit}`, {
      method: 'GET',
    });
    return response.json();
  },

  async getProductById(productId: string) {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'GET',
    });
    return response.json();
  },

  async createServiceRequest(data: ServiceRequestFormData): Promise<ServiceRequestResponse> {
    const response = await fetch(`${API_URL}/service_requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ service_request: data }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || error.error || 'Failed to submit service request');
    }

    return response.json();
  },

  async createEquipmentRentalRequest(data: EquipmentRentalRequestFormData): Promise<EquipmentRentalRequestResponse> {
    const response = await fetch(`${API_URL}/equipment_rental_requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ equipment_rental_request: data }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.join(', ') || error.error || 'Failed to submit equipment rental request');
    }

    return response.json();
  },

  async getShippingRates(
    destination: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    },
    lineItems: Array<{ square_catalog_object_id: string; quantity: string }>
  ): Promise<{
    rates: Array<{
      provider: string;
      servicelevel: { name: string };
      amount: string;
    }>;
  }> {
    const response = await fetch(`${API_URL}/shipping/rates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        shipping: {
          destination,
          line_items: lineItems,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      const err = new Error(error.error || 'Failed to fetch shipping rates');
      (err as ShippingRateError).code = error.code;
      throw err;
    }

    return response.json();
  },

  async calculateOrder(
    lineItems: Array<{ catalog_object_id: string; quantity: string }>,
    fulfillmentType: 'PICKUP' | 'SHIPMENT' = 'PICKUP'
  ) {
    const response = await fetch(`${API_URL}/orders/calculate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        line_items: lineItems,
        fulfillment_type: fulfillmentType,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to calculate order');
    }

    return response.json();
  },

  async getSquareConfig() {
    const response = await fetch(`${API_URL}/config/square`);

    if (!response.ok) {
      throw new Error('Failed to get Square configuration');
    }

    return response.json();
  },

  async createOrder(data: {
    line_items: Array<{ catalog_object_id: string; quantity: string }>;
    payment_token: string;
    customer_info: {
      email: string;
      given_name?: string;
      family_name?: string;
    };
    fulfillment_type?: 'PICKUP' | 'SHIPMENT';
    shipping_address?: {
      address_line_1?: string;
      address_line_2?: string;
      locality?: string;
      administrative_district_level_1?: string;
      postal_code?: string;
      country?: string;
    };
    pickup_details?: {
      date: string;
      time: string;
    };
    shipping_cost?: string;
  }) {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    return response.json();
  },

  // Customer API methods
  async getCustomer(customerId: string): Promise<Customer> {
    const response = await fetch(`${API_URL}/customers/${customerId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch customer');
    }

    return response.json();
  },

  async updateCustomer(customerId: string, data: UpdateCustomerData): Promise<Customer> {
    const response = await fetch(`${API_URL}/customers/${customerId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update customer');
    }

    return response.json();
  },

  async getCustomerOrders(customerId: string): Promise<{ orders: Order[] }> {
    const response = await fetch(`${API_URL}/customers/${customerId}/orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch orders');
    }

    return response.json();
  },

  async getCustomerCards(customerId: string): Promise<{ cards: Card[] }> {
    const response = await fetch(`${API_URL}/customers/${customerId}/cards`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch cards');
    }

    return response.json();
  },

  async deleteCustomerCard(customerId: string, cardId: string): Promise<void> {
    const response = await fetch(`${API_URL}/customers/${customerId}/cards/${cardId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete card');
    }
  },

  async submitContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contact: data }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit contact form');
    }

    return response.json();
  },
};

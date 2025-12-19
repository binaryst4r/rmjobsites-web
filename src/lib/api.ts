import type { ServiceRequestFormData, ServiceRequestResponse } from '../types/ServiceRequest';
import type { EquipmentRentalRequestFormData, EquipmentRentalRequestResponse } from '../types/EquipmentRentalRequest';
import type { Customer, UpdateCustomerData, Order, Card } from '../types/customer';
import { getUser } from './cookies';

const API_URL = 'http://localhost:3000/api';

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

  async calculateOrder(lineItems: Array<{ catalog_object_id: string; quantity: string }>) {
    const response = await fetch(`${API_URL}/orders/calculate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ line_items: lineItems }),
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
    shipping_address?: {
      address_line_1?: string;
      locality?: string;
      administrative_district_level_1?: string;
      postal_code?: string;
    };
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
  async getCustomer(customerId: string = 'me'): Promise<Customer> {
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

  async updateCustomer(customerId: string = 'me', data: UpdateCustomerData): Promise<Customer> {
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

  async getCustomerOrders(customerId: string = 'me'): Promise<{ orders: Order[] }> {
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

  async getCustomerCards(customerId: string = 'me'): Promise<{ cards: Card[] }> {
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

  async deleteCustomerCard(customerId: string = 'me', cardId: string): Promise<void> {
    const response = await fetch(`${API_URL}/customers/${customerId}/cards/${cardId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete card');
    }
  },
};

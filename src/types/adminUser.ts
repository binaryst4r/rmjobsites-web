export interface AdminUserListItem {
  id: number;
  email: string;
  given_name: string | null;
  family_name: string | null;
  phone_number: string | null;
  admin: boolean;
  square_customer_id: string | null;
  created_at: string;
}

export interface AdminUserListMeta {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}

export interface AdminUserListResponse {
  users: AdminUserListItem[];
  meta: AdminUserListMeta;
}

export interface AdminUserListParams {
  q?: string;
  page?: number;
  per_page?: number;
}

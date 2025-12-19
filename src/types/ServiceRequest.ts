export interface ServiceRequest {
  id: number;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  company: string;
  service_requested: string;
  pickup_date: string;
  return_date: string;
  dropped_or_impacted: boolean;
  needs_replacement_accessories: boolean;
  needs_rush: boolean;
  needs_rental: boolean;
  manufacturer: string;
  model: string;
  serial_number: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequestFormData {
  customer_name: string;
  company: string;
  service_requested: string;
  pickup_date: string;
  return_date: string;
  dropped_or_impacted: boolean;
  needs_replacement_accessories: boolean;
  needs_rush: boolean;
  needs_rental: boolean;
  manufacturer: string;
  model: string;
  serial_number: string;
}

export interface ServiceRequestResponse {
  service_request: ServiceRequest;
  message: string;
}

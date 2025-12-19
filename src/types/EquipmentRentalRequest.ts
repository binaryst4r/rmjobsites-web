export interface EquipmentRentalRequest {
  id: number;
  user_id: number | null;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  equipment_type: string;
  pickup_date: string;
  return_date: string;
  rental_agreement_accepted: boolean;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentRentalRequestFormData {
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  equipment_type: string;
  pickup_date: string;
  return_date: string;
  rental_agreement_accepted: boolean;
  payment_method: string;
}

export interface EquipmentRentalRequestResponse {
  equipment_rental_request: EquipmentRentalRequest;
  message: string;
}

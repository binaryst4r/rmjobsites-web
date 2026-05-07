export type RentalDurationUnit = 'day' | 'week' | 'month';

export interface EquipmentRentalRequest {
  id: number;
  user_id: number | null;
  company_name: string | null;
  contact_name: string | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string;
  customer_phone: string;
  equipment_type: string;
  rental_duration_unit: RentalDurationUnit | null;
  rental_duration_amount: number | null;
  rental_agreement_accepted: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EquipmentRentalRequestFormData {
  company_name: string;
  contact_name: string;
  customer_email: string;
  customer_phone: string;
  equipment_type: string;
  rental_duration_unit: RentalDurationUnit | '';
  rental_duration_amount: string;
  rental_agreement_accepted: boolean;
  notes: string;
}

export interface EquipmentRentalRequestResponse {
  equipment_rental_request: EquipmentRentalRequest;
  message: string;
}

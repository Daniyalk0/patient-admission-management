export type Gender = "Male" | "Female" | "Other";

export type Ward = "General" | "ICU" | "Private" | "Emergency";

export type Department =
  | "Cardiology"
  | "Neurology"
  | "Orthopedics"
  | "Pediatrics"
  | "General Medicine";

export type Doctor = "Dr. Sharma" | "Dr. Verma" | "Dr. Khan" | "Dr. Gupta";

export type PatientStatus = "Admitted" | "Discharged";

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: Gender;
  ward: Ward;
  department: Department;
  doctor: Doctor;
  admission_date: string;
  status: PatientStatus;
  created_at: string;
  updated_at: string;
}

export type PatientFormData = Omit<
  Patient,
  "id" | "status" | "created_at" | "updated_at"
>;

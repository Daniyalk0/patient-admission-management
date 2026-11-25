import type {
  Department,
  Doctor,
  Gender,
  Ward,
} from "../../types/patient";

export const genders = ["Male", "Female", "Other"] satisfies readonly Gender[];
export const wards = [
  "General",
  "ICU",
  "Private",
  "Emergency",
] satisfies readonly Ward[];
export const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "General Medicine",
] satisfies readonly Department[];
export const doctors = [
  "Dr. Sharma",
  "Dr. Verma",
  "Dr. Khan",
  "Dr. Gupta",
] satisfies readonly Doctor[];

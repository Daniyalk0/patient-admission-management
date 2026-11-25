import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { LoaderCircle, X } from "lucide-react";
import { apiRequest } from "../../lib/api";
import type { Patient, PatientFormData } from "../../types/patient";
import {
  departments,
  doctors,
  genders,
  wards,
} from "./patientOptions";

interface AddPatientFormProps {
  onClose: () => void;
  onSaved: (formData: PatientFormData) => void;
  patient?: Patient;
}

interface PatientFormValues {
  name: string;
  age: string;
  gender: string;
  ward: string;
  department: string;
  doctor: string;
  admission_date: string;
}

type PatientFormErrors = Partial<Record<keyof PatientFormValues, string>>;

const initialValues: PatientFormValues = {
  name: "",
  age: "",
  gender: "",
  ward: "",
  department: "",
  doctor: "",
  admission_date: "",
};

const inputClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export function AddPatientForm({
  onClose,
  onSaved,
  patient,
}: AddPatientFormProps) {
  const [values, setValues] = useState(() =>
    patient ? getPatientFormValues(patient) : initialValues,
  );
  const [fieldErrors, setFieldErrors] = useState<PatientFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = getLocalDateInputValue();

  useEffect(() => {
    if (isSubmitting) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  function updateField<Field extends keyof PatientFormValues>(
    field: Field,
    value: string,
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setApiError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validatePatientForm(values, today);
    setFieldErrors(validation.errors);
    setApiError(null);

    if (!validation.payload) {
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest<Patient>(
        patient ? `/patients/${patient.id}` : "/patients/",
        {
          method: patient ? "PUT" : "POST",
          body: JSON.stringify(validation.payload),
        },
      );
    } catch (requestError) {
      setApiError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save the patient.",
      );
      setIsSubmitting(false);
      return;
    }

    onSaved(validation.payload);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-3 sm:p-6">
      <section
        aria-labelledby="add-patient-title"
        aria-modal="true"
        className="max-h-full w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl"
        role="dialog"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2
              className="text-lg font-semibold text-slate-900"
              id="add-patient-title"
            >
              {patient ? "Edit Patient" : "Add Patient"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {patient
                ? "Update the patient admission details."
                : "Enter the patient admission details."}
            </p>
          </div>
          <button
            aria-label="Close form"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-50"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </div>

        <form className="p-5 sm:p-6" noValidate onSubmit={handleSubmit}>
          {apiError && (
            <div
              className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {apiError}
            </div>
          )}

          <fieldset
            className="grid min-w-0 gap-4 border-0 p-0 sm:grid-cols-2"
            disabled={isSubmitting}
          >
            <legend className="sr-only">Patient details</legend>
            <FormField error={fieldErrors.name} id="patient-name" label="Name">
              <input
                autoComplete="name"
                autoFocus
                className={inputClassName}
                id="patient-name"
                onChange={(event) => updateField("name", event.target.value)}
                required
                type="text"
                value={values.name}
                {...fieldErrorProps("patient-name", fieldErrors.name)}
              />
            </FormField>

            <FormField error={fieldErrors.age} id="patient-age" label="Age">
              <input
                className={inputClassName}
                id="patient-age"
                max="120"
                min="0"
                onChange={(event) => updateField("age", event.target.value)}
                required
                step="1"
                type="number"
                value={values.age}
                {...fieldErrorProps("patient-age", fieldErrors.age)}
              />
            </FormField>

            <FormField
              error={fieldErrors.gender}
              id="patient-gender"
              label="Gender"
            >
              <SelectField
                error={fieldErrors.gender}
                id="patient-gender"
                onChange={(value) => updateField("gender", value)}
                options={genders}
                placeholder="Select gender"
                value={values.gender}
              />
            </FormField>

            <FormField error={fieldErrors.ward} id="patient-ward" label="Ward">
              <SelectField
                error={fieldErrors.ward}
                id="patient-ward"
                onChange={(value) => updateField("ward", value)}
                options={wards}
                placeholder="Select ward"
                value={values.ward}
              />
            </FormField>

            <FormField
              error={fieldErrors.department}
              id="patient-department"
              label="Department"
            >
              <SelectField
                error={fieldErrors.department}
                id="patient-department"
                onChange={(value) => updateField("department", value)}
                options={departments}
                placeholder="Select department"
                value={values.department}
              />
            </FormField>

            <FormField
              error={fieldErrors.doctor}
              id="patient-doctor"
              label="Doctor"
            >
              <SelectField
                error={fieldErrors.doctor}
                id="patient-doctor"
                onChange={(value) => updateField("doctor", value)}
                options={doctors}
                placeholder="Select doctor"
                value={values.doctor}
              />
            </FormField>

            <FormField
              error={fieldErrors.admission_date}
              id="patient-admission-date"
              label="Admission Date"
            >
              <input
                className={inputClassName}
                id="patient-admission-date"
                max={today}
                onChange={(event) =>
                  updateField("admission_date", event.target.value)
                }
                required
                type="date"
                value={values.admission_date}
                {...fieldErrorProps(
                  "patient-admission-date",
                  fieldErrors.admission_date,
                )}
              />
            </FormField>
          </fieldset>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
            <button
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting && (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  size={16}
                />
              )}
              {isSubmitting
                ? patient
                  ? "Saving changes…"
                  : "Adding patient…"
                : patient
                  ? "Save Changes"
                  : "Add Patient"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
        <span aria-hidden="true" className="text-red-600">
          {" "}
          *
        </span>
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-700" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps<Option extends string> {
  id: string;
  value: string;
  options: readonly Option[];
  placeholder: string;
  error?: string;
  onChange: (value: Option | "") => void;
}

function SelectField<Option extends string>({
  id,
  value,
  options,
  placeholder,
  error,
  onChange,
}: SelectFieldProps<Option>) {
  return (
    <select
      className={`${inputClassName} ${
        value ? "" : "text-slate-500"
      }`}
      id={id}
      onChange={(event) => {
        const selected = options.find(
          (option) => option === event.target.value,
        );
        onChange(selected ?? "");
      }}
      required
      value={value}
      {...fieldErrorProps(id, error)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function fieldErrorProps(id: string, error?: string) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}

function validatePatientForm(
  values: PatientFormValues,
  today: string,
): { errors: PatientFormErrors; payload?: PatientFormData } {
  const errors: PatientFormErrors = {};
  const name = values.name.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (!/^[\p{L} ]+$/u.test(name)) {
    errors.name = "Use letters and spaces only.";
  }

  const ageText = values.age.trim();
  const age = Number(ageText);
  if (!ageText) {
    errors.age = "Age is required.";
  } else if (!/^\d+$/.test(ageText) || age < 0 || age > 120) {
    errors.age = "Enter a whole number between 0 and 120.";
  }

  const gender = genders.find((option) => option === values.gender);
  const ward = wards.find((option) => option === values.ward);
  const department = departments.find(
    (option) => option === values.department,
  );
  const doctor = doctors.find((option) => option === values.doctor);

  if (!gender) errors.gender = "Gender is required.";
  if (!ward) errors.ward = "Ward is required.";
  if (!department) errors.department = "Department is required.";
  if (!doctor) errors.doctor = "Doctor is required.";

  if (!values.admission_date) {
    errors.admission_date = "Admission date is required.";
  } else if (values.admission_date > today) {
    errors.admission_date = "Admission date cannot be in the future.";
  }

  if (
    Object.keys(errors).length > 0 ||
    !gender ||
    !ward ||
    !department ||
    !doctor
  ) {
    return { errors };
  }

  return {
    errors,
    payload: {
      name,
      age,
      gender,
      ward,
      department,
      doctor,
      admission_date: values.admission_date,
    },
  };
}

function getLocalDateInputValue() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function getPatientFormValues(patient: Patient): PatientFormValues {
  return {
    name: patient.name,
    age: String(patient.age),
    gender: patient.gender,
    ward: patient.ward,
    department: patient.department,
    doctor: patient.doctor,
    admission_date: patient.admission_date.slice(0, 10),
  };
}

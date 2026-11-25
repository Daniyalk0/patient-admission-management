import { useEffect, useMemo, useRef, useState } from "react";
import { CircleCheck, Plus, RefreshCw, X } from "lucide-react";
import { AppHeader } from "./components/layout/AppHeader";
import { AddPatientForm } from "./components/patients/AddPatientForm";
import {
  PatientFilters,
  type PatientFiltersValue,
} from "./components/patients/PatientFilters";
import { PatientSummaryCards } from "./components/patients/PatientSummaryCards";
import { PatientsTable } from "./components/patients/PatientsTable";
import { apiRequest } from "./lib/api";
import type { Patient, PatientFormData } from "./types/patient";

const initialFilters: PatientFiltersValue = {
  ward: "",
  department: "",
  doctor: "",
};

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [processingPatientId, setProcessingPatientId] = useState<number | null>(
    null,
  );
  const patientActionInProgress = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPatients() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiRequest<Patient[]>("/patients/", {
          method: "GET",
          signal: controller.signal,
        });

        if (!Array.isArray(response)) {
          throw new Error("The patient API returned an invalid response.");
        }

        setPatients(response);
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load patients.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadPatients();
    return () => controller.abort();
  }, [refreshKey]);

  function closePatientForm() {
    setIsAddPatientOpen(false);
    setEditingPatient(null);
  }

  function handlePatientFormSaved(formData: PatientFormData) {
    const wasEditing = editingPatient !== null;
    if (editingPatient) {
      setPatients((currentPatients) =>
        currentPatients.map((patient) =>
          patient.id === editingPatient.id
            ? { ...patient, ...formData }
            : patient,
        ),
      );
    }

    closePatientForm();
    setNotice({
      type: "success",
      message: wasEditing
        ? "Patient updated successfully."
        : "Patient added successfully.",
    });

    if (!wasEditing) {
      setSearch("");
      setFilters(initialFilters);
    }

    setRefreshKey((key) => key + 1);
  }

  async function performPatientAction(
    patient: Patient,
    action: () => Promise<unknown>,
    successMessage: string,
    onSuccess?: () => void,
  ) {
    if (patientActionInProgress.current) {
      return;
    }

    patientActionInProgress.current = true;
    setProcessingPatientId(patient.id);
    setNotice(null);

    try {
      await action();
      onSuccess?.();
      setNotice({ type: "success", message: successMessage });
      setRefreshKey((key) => key + 1);
    } catch (actionError) {
      setNotice({
        type: "error",
        message:
          actionError instanceof Error
            ? actionError.message
            : "Unable to complete the patient action.",
      });
    } finally {
      patientActionInProgress.current = false;
      setProcessingPatientId(null);
    }
  }

  function handleDeletePatient(patient: Patient) {
    if (
      patientActionInProgress.current ||
      !window.confirm(
        `Delete ${patient.name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    void performPatientAction(
      patient,
      () =>
        apiRequest<unknown>(`/patients/${patient.id}`, {
          method: "DELETE",
        }),
      `${patient.name} was deleted successfully.`,
      () =>
        setPatients((currentPatients) =>
          currentPatients.filter((currentPatient) => currentPatient.id !== patient.id),
        ),
    );
  }

  function handleDischargePatient(patient: Patient) {
    if (patient.status !== "Admitted" || patientActionInProgress.current) {
      return;
    }

    void performPatientAction(
      patient,
      () =>
        apiRequest<unknown>(`/patients/${patient.id}/discharge`, {
          method: "PATCH",
        }),
      `${patient.name} was discharged successfully.`,
      () =>
        setPatients((currentPatients) =>
          currentPatients.map((currentPatient) =>
            currentPatient.id === patient.id
              ? { ...currentPatient, status: "Discharged" }
              : currentPatient,
          ),
        ),
    );
  }

  const filteredPatients = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return patients.filter((patient) => {
      const matchesName = patient.name
        .toLocaleLowerCase()
        .includes(normalizedSearch);
      const matchesWard = !filters.ward || patient.ward === filters.ward;
      const matchesDepartment =
        !filters.department || patient.department === filters.department;
      const matchesDoctor = !filters.doctor || patient.doctor === filters.doctor;

      return (
        matchesName && matchesWard && matchesDepartment && matchesDoctor
      );
    });
  }, [filters, patients, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Patients
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View and search patient admission records.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              onClick={() => {
                setNotice(null);
                setEditingPatient(null);
                setIsAddPatientOpen(true);
              }}
              type="button"
            >
              <Plus aria-hidden="true" size={17} />
              Add Patient
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              onClick={() => setRefreshKey((key) => key + 1)}
              type="button"
            >
              <RefreshCw
                aria-hidden="true"
                className={isLoading ? "animate-spin" : ""}
                size={16}
              />
              Refresh
            </button>
          </div>
        </div>

        {notice && (
          <div
            className={`mb-5 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
              notice.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
            role={notice.type === "error" ? "alert" : "status"}
          >
            <span className="inline-flex items-center gap-2">
              {notice.type === "success" && (
                <CircleCheck aria-hidden="true" size={17} />
              )}
              {notice.message}
            </span>
            <button
              aria-label="Dismiss message"
              className="rounded p-1 hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-slate-600"
              onClick={() => setNotice(null)}
              type="button"
            >
              <X aria-hidden="true" size={16} />
            </button>
          </div>
        )}

        <PatientSummaryCards patients={patients} />

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 px-4 pt-5 sm:px-5">
            <h2 className="text-base font-semibold text-slate-900">
              Patient records
            </h2>
            <p className="text-sm text-slate-500">
              {isLoading
                ? "Loading patient records…"
                : `${filteredPatients.length} ${
                    filteredPatients.length === 1 ? "patient" : "patients"
                  } shown`}
            </p>
          </div>

          <PatientFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearchChange={setSearch}
            search={search}
          />

          {error && (
            <div
              className="mx-4 mt-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:mx-5 sm:flex-row sm:items-center sm:justify-between"
              role="alert"
            >
              <p>{error}</p>
              <button
                className="inline-flex shrink-0 items-center gap-2 self-start font-medium underline underline-offset-2 hover:no-underline sm:self-auto"
                onClick={() => setRefreshKey((key) => key + 1)}
                type="button"
              >
                <RefreshCw aria-hidden="true" size={14} />
                Try again
              </button>
            </div>
          )}

          {isLoading && patients.length === 0 ? (
            <div
              aria-live="polite"
              className="flex items-center justify-center gap-3 px-6 py-14 text-sm text-slate-500"
              role="status"
            >
              <RefreshCw aria-hidden="true" className="animate-spin" size={18} />
              Loading patients…
            </div>
          ) : error && patients.length === 0 ? null : (
            <PatientsTable
              patients={filteredPatients}
              totalPatients={patients.length}
              processingPatientId={processingPatientId}
              onEdit={(patient) => {
                setNotice(null);
                setIsAddPatientOpen(false);
                setEditingPatient(patient);
              }}
              onDelete={handleDeletePatient}
              onDischarge={handleDischargePatient}
            />
          )}
        </section>
      </main>
      {(isAddPatientOpen || editingPatient !== null) && (
        <AddPatientForm
          key={editingPatient?.id ?? "new"}
          onClose={closePatientForm}
          onSaved={handlePatientFormSaved}
          patient={editingPatient ?? undefined}
        />
      )}
    </div>
  );
}

export default App;

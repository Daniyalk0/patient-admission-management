import {
  CalendarDays,
  LoaderCircle,
  LogOut,
  Pencil,
  Trash2,
  UsersRound,
} from "lucide-react";
import type { Patient } from "../../types/patient";

interface PatientsTableProps {
  patients: Patient[];
  totalPatients: number;
  processingPatientId: number | null;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onDischarge: (patient: Patient) => void;
}

export function PatientsTable({
  patients,
  totalPatients,
  processingPatientId,
  onEdit,
  onDelete,
  onDischarge,
}: PatientsTableProps) {
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <UsersRound aria-hidden="true" size={22} />
        </span>
        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          {totalPatients === 0 ? "No patients yet" : "No patients found"}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          {totalPatients === 0
            ? "Patient records will appear here when they are available."
            : "No patients match the current search and filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3.5">Name</th>
            <th className="px-4 py-3.5">Age</th>
            <th className="px-4 py-3.5">Gender</th>
            <th className="px-4 py-3.5">Ward</th>
            <th className="px-4 py-3.5">Department</th>
            <th className="px-4 py-3.5">Doctor</th>
            <th className="px-4 py-3.5">Admission Date</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {patients.map((patient) => (
            <tr className="text-slate-700" key={patient.id}>
              <td className="px-5 py-4 font-medium text-slate-900">
                {patient.name}
              </td>
              <td className="px-4 py-4">{patient.age}</td>
              <td className="px-4 py-4">{patient.gender}</td>
              <td className="px-4 py-4">{patient.ward}</td>
              <td className="px-4 py-4">{patient.department}</td>
              <td className="px-4 py-4">{patient.doctor}</td>
              <td className="whitespace-nowrap px-4 py-4">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays
                    aria-hidden="true"
                    className="text-slate-400"
                    size={15}
                  />
                  {formatAdmissionDate(patient.admission_date)}
                </span>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    patient.status === "Admitted"
                      ? "bg-teal-50 text-teal-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {patient.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <button
                    aria-label={`Edit ${patient.name}`}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={processingPatientId !== null}
                    onClick={() => onEdit(patient)}
                    type="button"
                  >
                    <Pencil aria-hidden="true" size={14} />
                    Edit
                  </button>
                  <button
                    aria-label={`Delete ${patient.name}`}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={processingPatientId !== null}
                    onClick={() => onDelete(patient)}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={14} />
                    Delete
                  </button>
                  {patient.status === "Admitted" && (
                    <button
                      aria-label={`Discharge ${patient.name}`}
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={processingPatientId !== null}
                      onClick={() => onDischarge(patient)}
                      type="button"
                    >
                      <LogOut aria-hidden="true" size={14} />
                      Discharge
                    </button>
                  )}
                  {processingPatientId === patient.id && (
                    <LoaderCircle
                      aria-label="Processing patient action"
                      className="animate-spin text-slate-500"
                      size={15}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatAdmissionDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    date,
  );
}

import { BedDouble, LogOut, Users } from "lucide-react";
import type { Patient } from "../../types/patient";

interface PatientSummaryCardsProps {
  patients: Patient[];
}

export function PatientSummaryCards({
  patients,
}: PatientSummaryCardsProps) {
  const summaries = [
    {
      label: "Total Patients",
      value: patients.length,
      icon: Users,
      iconClass: "bg-sky-50 text-sky-700",
    },
    {
      label: "Admitted",
      value: patients.filter((patient) => patient.status === "Admitted").length,
      icon: BedDouble,
      iconClass: "bg-teal-50 text-teal-700",
    },
    {
      label: "Discharged",
      value: patients.filter((patient) => patient.status === "Discharged")
        .length,
      icon: LogOut,
      iconClass: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <section
      aria-label="Patient summary"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {summaries.map(({ label, value, icon: Icon, iconClass }) => (
        <article
          key={label}
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {value}
            </p>
          </div>
          <span
            className={`flex size-11 items-center justify-center rounded-lg ${iconClass}`}
          >
            <Icon aria-hidden="true" size={21} />
          </span>
        </article>
      ))}
    </section>
  );
}

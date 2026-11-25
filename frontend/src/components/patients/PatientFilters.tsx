import { Search } from "lucide-react";
import {
  departments,
  doctors,
  wards,
} from "./patientOptions";
import type { Department, Doctor, Ward } from "../../types/patient";

export interface PatientFiltersValue {
  ward: Ward | "";
  department: Department | "";
  doctor: Doctor | "";
}

interface PatientFiltersProps {
  search: string;
  filters: PatientFiltersValue;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: PatientFiltersValue) => void;
}

export function PatientFilters({
  search,
  filters,
  onSearchChange,
  onFiltersChange,
}: PatientFiltersProps) {
  return (
    <section
      aria-label="Filter patients"
      className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(150px,1fr))]"
    >
      <label className="relative block">
        <span className="sr-only">Search patients by name</span>
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by patient name"
          type="search"
          value={search}
        />
      </label>

      <FilterSelect
        label="Ward"
        value={filters.ward}
        options={wards}
        onChange={(value) => onFiltersChange({ ...filters, ward: value })}
      />
      <FilterSelect
        label="Department"
        value={filters.department}
        options={departments}
        onChange={(value) =>
          onFiltersChange({ ...filters, department: value })
        }
      />
      <FilterSelect
        label="Doctor"
        value={filters.doctor}
        options={doctors}
        onChange={(value) => onFiltersChange({ ...filters, doctor: value })}
      />
    </section>
  );
}

interface FilterSelectProps<T extends string> {
  label: string;
  value: T | "";
  options: T[];
  onChange: (value: T | "") => void;
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps<T>) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        onChange={(event) => {
          const selectedValue = event.target.value;
          onChange(
            options.find((option) => option === selectedValue) ?? "",
          );
        }}
        value={value}
      >
        <option value="">All {label}s</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

import { HeartPulse } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <HeartPulse aria-hidden="true" size={22} />
        </span>
        <div>
          <p className="text-base font-semibold text-slate-900">
            Patient Admission Management
          </p>
          <p className="text-sm text-slate-500">Hospital overview</p>
        </div>
      </div>
    </header>
  );
}

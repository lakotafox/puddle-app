import Link from "next/link";
import { Building2, Clock } from "lucide-react";

/** Shown after sign-in when a user hasn't picked a role yet. */
export default function RoleChooser() {
  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Welcome to Puddle</h1>
        <p className="text-gray-400">How are you using Puddle?</p>
      </div>

      <div className="grid gap-4">
        <Link
          href="/onboarding/owner"
          className="flex items-start gap-4 p-5 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-colors"
        >
          <Building2 className="h-7 w-7 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-white font-semibold">I run a business</div>
            <div className="text-sm text-gray-400">Set up payroll and pay your employees.</div>
          </div>
        </Link>

        <Link
          href="/onboarding/employee"
          className="flex items-start gap-4 p-5 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-colors"
        >
          <Clock className="h-7 w-7 text-green-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-white font-semibold">I&apos;m an employee</div>
            <div className="text-sm text-gray-400">Join with a code, clock in, get paid.</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

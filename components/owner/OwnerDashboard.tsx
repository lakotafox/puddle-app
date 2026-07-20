import {
  getPublicMeta,
  getRosterFor,
  ensureOwnerSelfWallet,
  type OwnerPublic,
} from "@/lib/account";
import { getBalances } from "@/lib/horizon";
import FundPayroll from "@/components/owner/FundPayroll";
import LiveRoster from "@/components/owner/LiveRoster";

export default async function OwnerDashboard({ userId }: { userId: string }) {
  // Make sure the owner has a personal wallet (separate from the company pool).
  const selfAddress = await ensureOwnerSelfWallet(userId);

  const meta = (await getPublicMeta(userId)) as OwnerPublic;
  const pool = await getBalances(meta.stellarAddress);
  const personal = await getBalances(selfAddress);
  const roster = await getRosterFor(userId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{meta.companyName}</h1>
        <p className="text-gray-400 text-sm">Payroll dashboard</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Company payroll pool */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="text-sm text-gray-400">Payroll pool (company)</div>
          <div className="text-3xl font-bold text-white mt-1">${pool.usd.toFixed(2)}</div>
          <div className="mt-4">
            <FundPayroll />
          </div>
        </div>

        {/* Owner's personal bank */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg">
          <div className="text-sm text-blue-100">Your bank (personal)</div>
          <div className="text-3xl font-bold text-white mt-1">${personal.usd.toFixed(2)}</div>
          <div className="text-xs text-blue-200 mt-2">Your own pay — separate from the pool</div>
        </div>
      </div>

      {/* Join code */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="text-sm text-gray-400">Employee join code</div>
        <div className="text-2xl font-mono font-bold text-blue-400 tracking-wider mt-1">
          {meta.joinCode}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this code so employees can join your company.
        </p>
      </div>

      {/* Live team roster (owner + employees) */}
      <LiveRoster initial={roster} />
    </div>
  );
}

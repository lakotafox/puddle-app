import { getPublicMeta, type EmployeePublic } from "@/lib/account";
import { getBalances } from "@/lib/horizon";
import TimeClock from "@/components/employee/TimeClock";

export default async function EmployeeDashboard({ userId }: { userId: string }) {
  const meta = (await getPublicMeta(userId)) as EmployeePublic;
  const { usd } = await getBalances(meta.stellarAddress);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{meta.companyName}</h1>
        <p className="text-gray-400 text-sm">
          {meta.hourlyRate > 0
            ? `$${meta.hourlyRate.toFixed(2)} / hour`
            : "Your employer hasn't set your rate yet"}
        </p>
      </div>

      {/* Puddle bank */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg">
        <div className="text-sm text-blue-100">Puddle bank</div>
        <div className="text-5xl font-bold text-white mt-1">${usd.toFixed(2)}</div>
        <div className="text-xs text-blue-200 mt-2">Available to spend</div>
      </div>

      {/* Time clock */}
      <TimeClock
        clockInAt={meta.clockInAt ?? null}
        hourlyRate={meta.hourlyRate ?? 0}
      />
    </div>
  );
}

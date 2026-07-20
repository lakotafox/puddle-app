"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  getRoster,
  setEmployeeRate,
  setOwnRate,
  clockInSelf,
  clockOutSelf,
} from "@/app/actions/owner";
import type { RosterMember } from "@/lib/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LiveRoster({ initial }: { initial: RosterMember[] }) {
  const router = useRouter();
  const [roster, setRoster] = useState<RosterMember[]>(initial);
  const [now, setNow] = useState(() => Date.now());

  // Tick the clock every second (live accruing pay).
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Poll the roster every 5s so the owner sees clock-ins/outs in near-real-time.
  const refresh = async () => {
    try {
      setRoster(await getRoster());
    } catch {
      /* ignore transient errors */
    }
  };
  useEffect(() => {
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, []);

  const anyOnClock = roster.some((m) => m.clockInAt != null);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">Team ({roster.length})</div>
        {anyOnClock && (
          <span className="flex items-center gap-2 text-xs text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-700">
        {roster.map((m) => (
          <RosterRow key={m.id} member={m} now={now} onChanged={refresh} />
        ))}
      </div>
    </div>
  );
}

function RosterRow({
  member,
  now,
  onChanged,
}: {
  member: RosterMember;
  now: number;
  onChanged: () => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [rate, setRate] = useState(String(member.hourlyRate || ""));
  const [pending, startTransition] = useTransition();

  const onClock = member.clockInAt != null;
  const earned = onClock
    ? ((now - member.clockInAt!) / 3_600_000) * member.hourlyRate
    : 0;

  const saveRate = () => {
    const value = parseFloat(rate);
    if (!(value >= 0)) return;
    startTransition(async () => {
      if (member.isOwner) await setOwnRate(value);
      else await setEmployeeRate(member.id, value);
      setEditing(false);
      onChanged();
      router.refresh();
    });
  };

  const toggleClock = () => {
    startTransition(async () => {
      if (onClock) await clockOutSelf();
      else await clockInSelf();
      onChanged();
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-between py-3 gap-3">
      {/* Name + live status */}
      <div className="min-w-0">
        <div className="text-white truncate flex items-center gap-2">
          {member.name}
          {member.isOwner && (
            <span className="text-[10px] uppercase tracking-wide bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded">
              Owner
            </span>
          )}
        </div>
        {onClock ? (
          <div className="text-xs text-green-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            On the clock · earning ${earned.toFixed(2)}
          </div>
        ) : (
          <div className="text-xs text-gray-500">Clocked out</div>
        )}
      </div>

      {/* Rate (nice display + Edit) and owner clock control */}
      <div className="flex items-center gap-2 shrink-0">
        {editing ? (
          <>
            <span className="text-gray-400 text-sm">$</span>
            <Input
              type="number"
              min="0"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-20 bg-slate-900 border-slate-700 text-white"
            />
            <span className="text-gray-400 text-sm">/hr</span>
            <Button size="sm" onClick={saveRate} disabled={pending}>
              {pending ? "…" : "Save"}
            </Button>
          </>
        ) : (
          <>
            <span className="text-white font-medium tabular-nums">
              {member.hourlyRate > 0 ? `$${member.hourlyRate.toFixed(2)}/hr` : "No rate"}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-400 hover:text-blue-300"
              onClick={() => setEditing(true)}
            >
              {member.hourlyRate > 0 ? "Edit" : "Set rate"}
            </Button>
          </>
        )}

        {member.isOwner && (
          <Button
            size="sm"
            onClick={toggleClock}
            disabled={pending || member.hourlyRate <= 0}
            className={onClock ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {onClock ? "Clock Out" : "Clock In"}
          </Button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clockIn, clockOut, type ClockOutResult } from "@/app/actions/employee";
import { Button } from "@/components/ui/button";

interface Props {
  clockInAt: number | null;
  hourlyRate: number;
}

export default function TimeClock({ clockInAt, hourlyRate }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [now, setNow] = useState(() => Date.now());
  const [result, setResult] = useState<ClockOutResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Live timer while clocked in.
  useEffect(() => {
    if (clockInAt == null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [clockInAt]);

  const elapsedMs = clockInAt != null ? Math.max(0, now - clockInAt) : 0;
  const elapsedHours = elapsedMs / 3_600_000;
  const earning = elapsedHours * hourlyRate;
  const mm = Math.floor(elapsedMs / 60000);
  const ss = Math.floor((elapsedMs % 60000) / 1000);

  const handleClockIn = () => {
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        await clockIn();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to clock in");
      }
    });
  };

  const handleClockOut = () => {
    setError(null);
    startTransition(async () => {
      try {
        const r = await clockOut();
        setResult(r);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to clock out");
      }
    });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
      <div className="text-sm text-gray-400">Time clock</div>

      {clockInAt != null ? (
        <div className="text-center space-y-1">
          <div className="text-3xl font-mono font-bold text-green-400">
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </div>
          <div className="text-sm text-gray-400">
            Earning ~${earning.toFixed(2)} this session
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm">
          You&apos;re clocked out.
        </div>
      )}

      {clockInAt != null ? (
        <Button
          onClick={handleClockOut}
          disabled={pending}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {pending ? "Clocking out…" : "Clock Out & Get Paid"}
        </Button>
      ) : (
        <Button
          onClick={handleClockIn}
          disabled={pending || hourlyRate <= 0}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {pending ? "Clocking in…" : "Clock In"}
        </Button>
      )}

      {hourlyRate <= 0 && clockInAt == null && (
        <p className="text-xs text-yellow-400 text-center">
          Waiting for your employer to set your hourly rate.
        </p>
      )}

      {result && (
        <div className="text-center text-sm">
          {result.paid ? (
            <span className="text-green-400">
              Paid ${result.amount.toFixed(2)} for {(result.hours * 60).toFixed(1)} min 🎉
            </span>
          ) : result.amount > 0 ? (
            <span className="text-red-400">
              Couldn&apos;t pay ${result.amount.toFixed(2)}: {result.error}
            </span>
          ) : (
            <span className="text-gray-400">Clocked out (no earnings yet).</span>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-400 text-center">{error}</p>}
    </div>
  );
}

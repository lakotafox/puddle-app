"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { joinCompany } from "@/app/actions/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EmployeeOnboarding() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    startTransition(async () => {
      try {
        await joinCompany(code);
        router.push("/dashboard");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 bg-slate-800 border border-slate-700 rounded-xl p-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Join your company</h1>
          <p className="text-gray-400 text-sm">
            Enter the join code your employer gave you.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Join code</label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="PUDL-XXXX"
            className="bg-slate-900 border-slate-700 text-white font-mono tracking-wider"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button onClick={submit} disabled={pending} className="w-full">
          {pending ? "Joining…" : "Join company"}
        </Button>
      </div>
    </div>
  );
}

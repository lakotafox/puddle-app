"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { becomeOwner } from "@/app/actions/owner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OwnerOnboarding() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    startTransition(async () => {
      try {
        await becomeOwner(companyName);
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
          <h1 className="text-2xl font-bold text-white">Set up your business</h1>
          <p className="text-gray-400 text-sm">
            We&apos;ll create your payroll pool and a join code for your employees.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Company name</label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Joe's Diner"
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button onClick={submit} disabled={pending} className="w-full">
          {pending ? "Setting up…" : "Create my company"}
        </Button>
      </div>
    </div>
  );
}

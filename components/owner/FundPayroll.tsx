"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { fundPool } from "@/app/actions/owner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FundPayroll() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const fund = () => {
    setError(null);
    const value = parseFloat(amount);
    if (!(value > 0)) {
      setError("Enter an amount greater than 0");
      return;
    }
    startTransition(async () => {
      try {
        await fundPool(value);
        setAmount("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Funding failed");
      }
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="number"
          min="0"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (USD)"
          className="bg-slate-900 border-slate-700 text-white"
        />
        <Button onClick={fund} disabled={pending}>
          {pending ? "Funding…" : "Fund Payroll"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-gray-500">
        Loads test USDC into your pool (testnet amount is approximate).
      </p>
    </div>
  );
}

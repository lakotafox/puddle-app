import { UserProfile } from "@clerk/nextjs"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <div className="rounded-lg overflow-hidden">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-slate-800 border-slate-700 shadow-none w-full",
            },
          }}
        />
      </div>
    </div>
  )
}

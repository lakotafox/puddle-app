"use client"

import { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Menu, X, ChevronLeft } from "lucide-react"

const navItems = [{ href: "/dashboard", label: "Dashboard", icon: Home }]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">
            <Link href="/" className="text-2xl font-bold text-blue-400">
              PUDDL3
            </Link>
            <button
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Back to landing */}
          <div className="px-3 py-4 border-t border-slate-700">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 lg:px-6">
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

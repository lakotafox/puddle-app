"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import Script from "next/script"

export default function DashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [jwtToken, setJwtToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchJwt() {
      if (!isLoaded || !isSignedIn) return

      // TODO: Replace with real Clerk JWT once Unit auth is configured
      // const token = await getToken({ template: "unit" })
      // For now, use Unit's demo token to preview the banking experience
      localStorage.removeItem("unitCustomerToken")
      localStorage.removeItem("unitVerifiedCustomerToken")
      setJwtToken("demo.jwt.token")
      setLoading(false)
    }

    fetchJwt()
  }, [isLoaded, isSignedIn, getToken])

  useEffect(() => {
    if (!jwtToken || !scriptLoaded || !containerRef.current) return

    // Clear previous instance
    containerRef.current.innerHTML = ""

    // Create the Unit white-label app web component
    const unitApp = document.createElement("unit-elements-white-label-app")
    unitApp.setAttribute("jwt-token", jwtToken)

    // Apply Puddle branding
    unitApp.setAttribute("settings-json", JSON.stringify({
      global: {
        colors: {
          primary: "#3b82f6"
        },
        buttons: {
          primary: {
            default: {
              borderRadius: "8px"
            }
          }
        }
      },
      elementsCard: {
        designs: [
          {
            name: "default",
            url: "https://ui.dev.unit.sh/resources/outlay.png",
            fontColor: "#fafafa"
          }
        ]
      }
    }))

    containerRef.current.appendChild(unitApp)
  }, [jwtToken, scriptLoaded])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading your banking dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://ui.s.unit.sh/release/latest/components-extended.js"
        onLoad={() => setScriptLoaded(true)}
        strategy="afterInteractive"
      />
      <div
        ref={containerRef}
        className="h-[calc(100vh-8rem)] rounded-lg overflow-hidden bg-white"
      />
    </>
  )
}

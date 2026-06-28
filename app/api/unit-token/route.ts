import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const unitToken = process.env.UNIT_API_TOKEN
  const unitUrl = process.env.UNIT_API_URL || "https://api.s.unit.sh"

  if (!unitToken || unitToken === "REPLACE_WITH_YOUR_UNIT_SANDBOX_ORG_TOKEN") {
    return NextResponse.json(
      { error: "Unit API token not configured. Add UNIT_API_TOKEN to .env.local" },
      { status: 500 }
    )
  }

  try {
    // First, check if a customer exists for this Clerk user
    // In production, you'd map Clerk userId to Unit customerId in your database
    // For sandbox, we'll try to list customers and use the first one
    const customersRes = await fetch(`${unitUrl}/customers?page[limit]=1`, {
      headers: {
        Authorization: `Bearer ${unitToken}`,
        "Content-Type": "application/vnd.api+json",
      },
    })

    if (!customersRes.ok) {
      return NextResponse.json(
        { error: "Failed to connect to Unit API. Check your UNIT_API_TOKEN." },
        { status: 500 }
      )
    }

    const customersData = await customersRes.json()

    if (!customersData.data || customersData.data.length === 0) {
      return NextResponse.json(
        { error: "No customers found. Create a test customer in the Unit sandbox dashboard first." },
        { status: 404 }
      )
    }

    const customerId = customersData.data[0].id

    // Create a customer token
    const tokenRes = await fetch(`${unitUrl}/customers/${customerId}/token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${unitToken}`,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "customerToken",
          attributes: {
            scope: "customers accounts cards payments transactions",
            upgradableScope: "cards-sensitive cards-sensitive-write payments-write",
            expiresIn: 86400,
          },
        },
      }),
    })

    if (!tokenRes.ok) {
      const errorData = await tokenRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: "Failed to create customer token", details: errorData },
        { status: 500 }
      )
    }

    const tokenData = await tokenRes.json()
    const token = tokenData.data.attributes.token

    return NextResponse.json({ token })
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to connect to Unit API" },
      { status: 500 }
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, currency = "usd" } = await request.json()

    // In a real implementation, you would create a Stripe payment intent here
    // For now, we'll create a mock payment intent
    const mockPaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount,
      currency: currency,
      status: "requires_payment_method",
    }

    // Create a pending purchase record
    const { error: insertError } = await supabase.from("purchases").insert({
      user_id: user.id,
      ebook_title: "Master Modern Development with AI-Powered Coding",
      amount: amount / 100, // Convert cents to dollars
      payment_status: "pending",
      stripe_payment_intent_id: mockPaymentIntent.id,
    })

    if (insertError) {
      console.error("Error creating purchase record:", insertError)
      return NextResponse.json({ error: "Failed to create purchase record" }, { status: 500 })
    }

    return NextResponse.json({
      clientSecret: mockPaymentIntent.client_secret,
      paymentIntentId: mockPaymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

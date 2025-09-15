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

    const { paymentIntentId } = await request.json()

    // In a real implementation, you would verify the payment with Stripe here
    // For now, we'll simulate a successful payment
    const mockPaymentSuccess = Math.random() > 0.1 // 90% success rate for demo

    if (mockPaymentSuccess) {
      // Update the purchase record to completed
      const { error: updateError } = await supabase
        .from("purchases")
        .update({
          payment_status: "completed",
          purchase_date: new Date().toISOString(),
        })
        .eq("stripe_payment_intent_id", paymentIntentId)
        .eq("user_id", user.id)

      if (updateError) {
        console.error("Error updating purchase record:", updateError)
        return NextResponse.json({ error: "Failed to update purchase record" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Payment confirmed successfully",
      })
    } else {
      // Update the purchase record to failed
      const { error: updateError } = await supabase
        .from("purchases")
        .update({
          payment_status: "failed",
        })
        .eq("stripe_payment_intent_id", paymentIntentId)
        .eq("user_id", user.id)

      if (updateError) {
        console.error("Error updating purchase record:", updateError)
      }

      return NextResponse.json(
        {
          success: false,
          error: "Payment failed. Please try again.",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

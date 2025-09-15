import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, Eye, User, LogOut, CreditCard, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Check if user has purchased the ebook
  const { data: purchases } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("payment_status", "completed")

  const hasPurchased = purchases && purchases.length > 0

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">CodeCraft</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{profile?.full_name || data.user.email}</span>
              </div>
              <form action={handleSignOut}>
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Developer"}!
            </h1>
            <p className="text-lg text-muted-foreground">
              {hasPurchased
                ? "Continue your learning journey with full access to the ebook."
                : "You're one step away from accessing the complete ebook."}
            </p>
          </div>

          {hasPurchased ? (
            /* Premium Content - User has purchased */
            <div className="space-y-6">
              {/* Access Status */}
              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200">Full Access Activated</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        You have lifetime access to the complete ebook and all future updates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ebook Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    Master Modern Development with AI-Powered Coding
                  </CardTitle>
                  <CardDescription>Complete ebook • 300+ pages • Lifetime access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/reader">
                      <Button size="lg" className="w-full">
                        <Eye className="mr-2 h-5 w-5" />
                        Read Online
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="w-full bg-transparent">
                      <Download className="mr-2 h-5 w-5" />
                      Download PDF
                    </Button>
                  </div>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">What's included:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Complete 300+ page ebook in PDF format</li>
                      <li>• Interactive online reader with bookmarks</li>
                      <li>• Source code examples and templates</li>
                      <li>• Lifetime updates and new content</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Ebook purchased</p>
                        <p className="text-sm text-muted-foreground">
                          {purchases?.[0]?.purchase_date
                            ? new Date(purchases[0].purchase_date).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Account created</p>
                        <p className="text-sm text-muted-foreground">Welcome to CodeCraft!</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Purchase Required - User hasn't purchased yet */
            <div className="space-y-6">
              {/* Purchase Prompt */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-primary" />
                    Complete Your Purchase
                  </CardTitle>
                  <CardDescription>Get instant access to the complete ebook and start learning today.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">
                          Master Modern Development with AI-Powered Coding
                        </h4>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-foreground">$49</span>
                          <span className="text-sm text-muted-foreground line-through ml-2">$99</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">One-time payment • Lifetime access</p>
                    </div>
                    <div className="mt-8 space-y-3">
                      <Link href="/checkout">
                        <Button size="lg" className="w-full">
                          <CreditCard className="mr-2 h-5 w-5" />
                          Purchase Now - $49
                        </Button>
                      </Link>
                      <p className="text-xs text-center text-muted-foreground">
                        Secure payment powered by Stripe • 30-day money-back guarantee
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Free Preview</CardTitle>
                  <CardDescription>Get a taste of what you'll learn in the complete ebook.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" size="lg" className="w-full bg-transparent">
                      <Eye className="mr-2 h-5 w-5" />
                      Read Free Sample (20 pages)
                    </Button>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Sample includes:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Introduction to AI-powered development</li>
                        <li>• Setting up your development environment</li>
                        <li>• First steps with modern frameworks</li>
                        <li>• Code examples and best practices</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Why Purchase */}
              <Card>
                <CardHeader>
                  <CardTitle>Why developers love this ebook</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                      <div className="text-2xl font-bold text-primary mb-1">300+</div>
                      <div className="text-sm text-muted-foreground">Pages of content</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-2xl font-bold text-primary mb-1">10k+</div>
                      <div className="text-sm text-muted-foreground">Happy developers</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-2xl font-bold text-primary mb-1">4.9★</div>
                      <div className="text-sm text-muted-foreground">Average rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

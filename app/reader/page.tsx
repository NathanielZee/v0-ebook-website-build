import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowLeft, Download, Bookmark, Search, Settings } from "lucide-react"
import Link from "next/link"

export default async function ReaderPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user has purchased the ebook
  const { data: purchases } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("payment_status", "completed")

  const hasPurchased = purchases && purchases.length > 0

  if (!hasPurchased) {
    redirect("/home")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reader Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/home">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground">Master Modern Development</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Table of Contents Sidebar */}
        <aside className="w-80 border-r border-border/40 bg-muted/30 overflow-y-auto">
          <div className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Table of Contents</h3>
            <nav className="space-y-2">
              <div className="space-y-1">
                <button className="w-full text-left p-2 text-sm font-medium text-primary bg-primary/10 rounded-md">
                  1. Introduction to AI-Powered Development
                </button>
                <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                  2. Setting Up Your Environment
                </button>
                <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                  3. Modern JavaScript & TypeScript
                </button>
                <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                  4. React & Next.js Fundamentals
                </button>
                <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                  5. AI Integration Techniques
                </button>
                <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                  6. Database Design & Management
                </button>
                <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                  7. Authentication & Security
                </button>
                <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                  8. Deployment & DevOps
                </button>
                <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                  9. Performance Optimization
                </button>
                <button className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                  10. Advanced Patterns & Practices
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Chapter 1: Introduction to AI-Powered Development</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <div className="space-y-6 text-foreground leading-relaxed">
                  <p className="text-lg text-muted-foreground">
                    Welcome to the future of software development, where artificial intelligence isn't just a
                    buzzword—it's your most powerful ally in creating exceptional applications.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">The Evolution of Development</h3>
                  <p>
                    The landscape of software development has undergone a dramatic transformation in recent years. What
                    once required hours of manual coding, debugging, and optimization can now be accelerated through
                    intelligent tools and AI-powered assistance.
                  </p>

                  <p>
                    In this comprehensive guide, you'll discover how to harness the power of modern development tools,
                    frameworks, and AI technologies to build applications that are not only functional but exceptional
                    in their performance, user experience, and maintainability.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">What You'll Learn</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• How to integrate AI tools into your development workflow</li>
                    <li>• Modern JavaScript and TypeScript best practices</li>
                    <li>• Building scalable applications with React and Next.js</li>
                    <li>• Database design and management strategies</li>
                    <li>• Authentication, security, and performance optimization</li>
                    <li>• Deployment strategies and DevOps practices</li>
                  </ul>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Pro Tip</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      As you read through each chapter, try to implement the concepts in your own projects. The best way
                      to learn is by doing, and this ebook provides plenty of practical examples to get you started.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Prerequisites</h3>
                  <p>
                    This ebook assumes you have a basic understanding of web development concepts. While we'll cover
                    everything from the ground up, having some experience with HTML, CSS, and JavaScript will help you
                    get the most out of this content.
                  </p>

                  <div className="flex items-center justify-between pt-8 border-t border-border/40">
                    <div className="text-sm text-muted-foreground">Page 1 of 300</div>
                    <Button>
                      Next: Setting Up Your Environment
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

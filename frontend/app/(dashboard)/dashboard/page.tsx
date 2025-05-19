"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { formsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, FileText, BarChart3, Clock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Form {
  id: string
  title: string
  detail?: string
  is_active: boolean
  responses_count?: number
  created_at?: string
  updated_at?: string
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [forms, setForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchForms = async () => {
      if (!token) return

      try {
        setIsLoading(true)
        const response = await formsApi.getAll(token)
        setForms(response)
      } catch (err: any) {
        console.error("Error fetching forms:", err)
        setError(err.message || "Failed to fetch forms")
      } finally {
        setIsLoading(false)
      }
    }

    fetchForms()
  }, [token])

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || "User"}</h1>
          <p className="text-muted-foreground">Here's an overview of your forms and responses</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/forms/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Forms</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-3xl font-bold">{forms.length}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Forms</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold">{forms.filter((form) => form.is_active).length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-bold">
                {forms.reduce((total, form) => total + (form.responses_count || 0), 0)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-3xl font-bold">68%</div>}
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Forms</h2>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : forms.length === 0 ? (
        <Card className="bg-muted/40">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No forms yet</h3>
            <p className="text-muted-foreground mb-4">Create your first form to start collecting responses</p>
            <Link href="/forms/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Form
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.slice(0, 6).map((form) => (
            <Card key={form.id} className="overflow-hidden card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="truncate">{form.title}</CardTitle>
                <CardDescription className="flex items-center">
                  {form.is_active ? (
                    <span className="flex items-center text-green-500">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground mr-2"></span>
                      Draft
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span>{form.responses_count || 0} responses</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Created {new Date(form.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link href={`/forms/${form.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Edit
                  </Button>
                </Link>
                <Link href={`/forms/${form.id}/responses`} className="flex-1">
                  <Button variant="secondary" className="w-full">
                    Responses
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {forms.length > 6 && (
        <div className="mt-6 text-center">
          <Link href="/forms">
            <Button variant="outline">View All Forms</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

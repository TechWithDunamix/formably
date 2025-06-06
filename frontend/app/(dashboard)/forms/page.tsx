"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { formsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plus,
  Search,
  BarChart3,
  Clock,
  AlertCircle,
  FileText,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Pencil,
  Trash2,
  ArrowRight,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Form {
 id?: string
  title: string
  detail?: string
  logo?: string
  cover_image?: string
  max_response?: number
  is_active: boolean
  as_template?: boolean
  active_until?: string
  company_website?: string
  draft: boolean
  primary_color: string
  secondary_color: string
  collect_email: boolean
  multi_response: boolean
  public_id: string
  sections: any[]
}

export default function FormsPage() {
  const { token } = useAuth()
  const [forms, setForms] = useState<Form[]>([])
  const [filteredForms, setFilteredForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchForms = async () => {
      if (!token) return

      try {
        setIsLoading(true)
        const response = await formsApi.getAll(token)
        setForms(response || [])
        setFilteredForms(response.forms || [])
      } catch (err: any) {
        console.error("Error fetching forms:", err)
        setError(err.message || "Failed to fetch forms")
      } finally {
        setIsLoading(false)
      }
    }

    fetchForms()
  }, [token])

  useEffect(() => {
    // Filter forms based on search query and status filter
    let result = [...forms]

    if (searchQuery) {
      result = result.filter((form) => form.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (statusFilter !== "all") {
      result = result.filter((form) => (statusFilter === "active" ? form.is_active : !form.is_active))
    }

    setFilteredForms(result)
  }, [forms, searchQuery, statusFilter])

  const handleDelete = async (formId: string) => {
    if (!token) return

    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await formsApi.delete(formId, token)
        setForms(forms.filter((form) => form.id !== formId))
      } catch (err: any) {
        console.error("Error deleting form:", err)
        setError(err.message || "Failed to delete form")
      }
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Forms</h1>
          <p className="text-muted-foreground">Manage all your forms in one place</p>
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

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All forms</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
      ) : filteredForms.length === 0 ? (
        <Card className="bg-muted/40">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {forms.length === 0 ? "No forms yet" : "No matching forms found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {forms.length === 0
                ? "Create your first form to start collecting responses"
                : "Try adjusting your search or filter criteria"}
            </p>
            {forms.length === 0 && (
              <Link href="/forms/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Form
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredForms.map((form) => (
           <Card key={form.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={form.cover_image || "/placeholder.svg"}
                alt={form.title}
        
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl w-2/3 truncate">{form.title}</CardTitle>
                </div>
               
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Created on: {new Date(form.created_at || "").toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Total responses: {form.responses_count || 0}</span>
              </div>
               <div className="text-primary text-xs rounded-full">
                  {form.sections.reduce((total, section) => total + (section.fields?.length || 0), 0)} questions
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button size="sm" asChild>
                <Link href={`/forms/${form.id}`}>
                  View Details <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          ))}
        </div>
      )}
    </div>
  )
}

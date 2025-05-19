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
  id: string
  title: string
  detail?: string
  is_active: boolean
  responses_count?: number
  created_at?: string
  updated_at?: string
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
            <Card key={form.id} className="overflow-hidden card-hover">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-2">
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
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/forms/${form.id}`} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/forms/${form.id}/responses`} className="cursor-pointer">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          <span>View Responses</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/forms/${form.id}/preview`} className="cursor-pointer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Preview</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/f/${form.id}`)
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copy Link</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(form.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { formsApi,templatesApi } from "@/lib/api"
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
  cover_image?: string
  total_fields?:string
 
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
        const response = await templatesApi.getAll(token)
        setForms(response || [])
        setFilteredForms(response || [])
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

  

    setFilteredForms(result)
  }, [forms, searchQuery, statusFilter])

  const useTemplate = async (templateId: string) => {
    if (!token) return

    try {
      const response = await templatesApi.useTemplate(templateId, token)
    
        window.location.href = `/forms/${response.form_id}`
      
        setError(response.message || "Failed to use template")
      
    } catch (err: any) {
      console.error("Error using template:", err)
      setError(err.message || "Failed to use template")
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Templates</h1>
          <p className="text-muted-foreground">Browse Through Amazing Forms</p>
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
               <div className="text-primary text-xs rounded-full">
                  {form.total_fields} questions
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button size="sm"  onClick={() => useTemplate(form.id || "")}>
               
                  Use Form <ArrowRight className="ml-2 h-3 w-3" />
               
              </Button>

              <Button size="sm" asChild>
                <Link href={`/forms/${form.id}`}>
                  View Form <ArrowRight className="ml-2 h-3 w-3" />
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

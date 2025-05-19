"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { formsApi, responsesApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Download, Search, BarChart3 } from "lucide-react"
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FormResponse {
  id: string
  form_id: string
  response: any
  device_family?: string
  device_brand?: string
  device_os?: string
  device_browser?: string
  created_at: string
  update_at: string
}

interface FormData {
  id: string
  title: string
}

export default function FormResponsesPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [form, setForm] = useState<FormData | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        
        // Fetch form details
        const formResponse = await formsApi.getDetails(id as string, token);
        setForm({
          id: formResponse.id,
          title: formResponse.title
        });
        
        // Fetch form responses
        const responsesData = await responsesApi.getAll(id as string, token);
        setResponses(responsesData || []);
        setFilteredResponses(responsesData.responses || []);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  useEffect(() => {
    // Filter responses based on search query and device filter
    let result = [...responses];
    
    if (searchQuery) {
      result = result.filter(response => {
        const responseStr = JSON.stringify(response.response).toLowerCase();
        return responseStr.includes(searchQuery.toLowerCase());
      });
    }
    
    if (deviceFilter !== "all") {
      result = result.filter(response => {
        if (deviceFilter === "mobile") {
          return response.device_family?.toLowerCase().includes("mobile") || 
                 response.device_family?.toLowerCase().includes("phone");
        } else if (deviceFilter === "tablet") {
          return response.device_family?.toLowerCase().includes("tablet");
        } else if (deviceFilter === "desktop") {
          return response.device_family?.toLowerCase().includes("desktop") || 
                 (!response.device_family?.toLowerCase().includes("mobile") && 
                  !response.device_family?.toLowerCase().includes("tablet"));
        }
        return true;
      });
    }
    
    setFilteredResponses(result);
  }, [responses, searchQuery, deviceFilter]);

  const handleDownload = async () => {
    if (!token) return;
    
    try {
      const response = await responsesApi.download(id as string, token);
      
      // Create a download link
      const blob = new Blob([response], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form?.title || "form"}_responses.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error("Error downloading responses:", err);
      setError(err.message || "Failed to download responses");
    }
  };

  const openResponseModal = (response: FormResponse) => {
    setSelectedResponse(response);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="grid gap-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{form?.title || "Form"} Responses</h1>
            <p className="text-muted-foreground">
              View and analyze responses for your form
            </p>
          </div>
        </div>
        <div>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{responses.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mobile Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {responses.filter(r => 
                r.device_family?.toLowerCase().includes("mobile") || 
                r.device_family?.toLowerCase().includes("phone")
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Desktop Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {responses.filter(r => 
                r.device_family?.toLowerCase().includes("desktop") || 
                (!r.device_family?.toLowerCase().includes("mobile") && 
                 !r.device_family?.toLowerCase().includes("tablet"))
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Completion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2m 34s</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search responses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={deviceFilter} onValueChange={setDeviceFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All devices</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="tablet">Tablet</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredResponses.length === 0 ? (
        <Card className="bg-muted/40">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {responses.length === 0 ? "No responses yet" : "No matching responses found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {responses.length === 0 
                ? "Share your form to start collecting responses" 
                : "Try adjusting your search or filter criteria"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Response Data</CardTitle>
            <CardDescription>
              Showing {filteredResponses.length} of {responses.length} responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell>{new Date(response.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{response.device_family || "Unknown"}</TableCell>
                      <TableCell>{response.device_browser || "Unknown"}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openResponseModal(response)}
                        >
                          View Response
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
          </DialogHeader>
          {selectedResponse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p>{new Date(selectedResponse.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Device</h4>
                  <p>{selectedResponse.device_family || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Browser</h4>
                  <p>{selectedResponse.device_browser || "Unknown"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">OS</h4>
                  <p>{selectedResponse.device_os || "Unknown"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Response Data</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Answer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(selectedResponse.response).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">{key}</TableCell>
                          <TableCell>{JSON.stringify(value)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
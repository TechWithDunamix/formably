"use client";
import { useState, useEffect } from "react";
import { templatesApi } from "@/lib/api";
import { FormPreview } from "@/components/form-preview";
import { useAuth } from "@/lib/auth-context";
import {useParams} from "next/navigation";
export default function PreviewPage() {
const [template, setTemplate] = useState(null);
const [error, setError] = useState(null);
const { token } = useAuth();
const { id } = useParams();

useEffect(() => {
  const fetchTemplate = async () => {
    try {
      if (!token) {
        throw new Error("User not authenticated");
      }
    
      const response = await templatesApi.previewTemplate(id, token);
        setTemplate(response);
    } catch (err: any) {
      setError(err.message);
    }
  };
  fetchTemplate();
}, []);
if (error) {
    return <div>Error: {error}</div>;
  }
if (!template) {
    return <div>Loading...</div>;
  }
  return (

    <div>
      <FormPreview formData={template} />
    </div>
  );
}
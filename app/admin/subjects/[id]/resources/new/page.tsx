"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { ArrowLeft, Save, Plus } from "lucide-react"
import Link from "next/link"
import Papa from "papaparse"

interface Props {
  params: { id: string }
}

interface ResourceRow {
  title: string
  category: string
  file_url?: string
}

const RESOURCE_CATEGORIES = [
  "Syllabus",
  "Notes",
  "Presentations",
  "Resources",
  "Suggested List of Microprojects",
  "Assignments",
  "Microporject Rubrics",
  "Assignments Rubrics",
  "Question Bank",
  "Lab Manual",
  "GTU Question Papers",
  "Reference Materials",
  "Internal Viva Questions",
  "Practical Questions",
  "Diary Format",
  "Cover Pages",
  "Tutorials",
  "Tutorial Rubrics",
  "Other",
]

export default function BulkResourcePage({ params }: Props) {
  const [subject, setSubject] = useState<any>(null)
  const [rows, setRows] = useState<ResourceRow[]>([
    { title: "", category: "", file_url: "" },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadSubject = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error) {
        console.error("Error loading subject:", error)
        router.push("/admin/subjects")
        return
      }
      setSubject(data)
      setIsLoading(false)
    }
    loadSubject()
  }, [params.id, router])

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.")
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: any) => {
        const parsedRows = result.data.map((row: any) => ({
          title: row.title || "",
          category: row.category || "",
          file_url: row.file_url || "",
        }))

        setRows(parsedRows)
      },
      error: (err: any) => {
        console.error("CSV parse error:", err)
        alert("Failed to parse CSV file.")
      }
    })
  }

  const handleChange = (index: number, field: keyof ResourceRow, value: string) => {
    const newRows = [...rows]

    newRows[index][field] = value

    // Sync title with category for non-reference materials
    if (field === "category" && value !== "Reference Materials") {
      newRows[index].title = value
    }

    setRows(newRows)
  }



  const addRow = () => setRows([...rows, { title: "", category: "", file_url: "" }])
  const removeRow = (index: number) => setRows(rows.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error("User not authenticated")

      // Filter out empty rows
      const validRows = rows.filter((row) => row.title.trim() && row.category)

      if (!validRows.length) {
        alert("Please enter at least one valid resource.")
        setIsSubmitting(false)
        return
      }

      // Insert all rows at once
      const { error } = await supabase.from("resources").insert(
        validRows.map((row) => ({
          title: row.title.trim(),
          category: row.category,
          file_url: row.file_url?.trim() || null,
          subject_id: params.id,
          uploaded_by: user.id,
        }))
      )

      if (error) throw error

      router.push(`/admin/subjects/${params.id}/resources`)
    } catch (err: any) {
      console.error(err)
      alert("Failed to create resources. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div>Loading...</div>

  if (!subject) return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-foreground mb-2">Subject Not Found</h1>
      <Link href="/admin/subjects">
        <Button variant="outline">Back to Subjects</Button>
      </Link>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/admin/subjects/${params.id}/resources`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Resources
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bulk Add Resources</h1>
          <p className="text-muted-foreground">
            Subject: <strong>{subject.name}</strong>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Table</CardTitle>
          <CardDescription>Enter multiple resources in the table below</CardDescription>
          <Input
            className="w-16 bg-primary"
            type="file"
            accept=".csv"
            onChange={handleCSV}
          />

        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-background">
                    <th className="border p-2 text-left">Title</th>
                    <th className="border p-2 text-left">Category</th>
                    <th className="border p-2 text-left">File URL</th>
                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index} className="hover:bg-muted">
                      <td className="border p-2">
                        <Input
                          value={row.title}
                          onChange={(e) => handleChange(index, "title", e.target.value)}
                          placeholder="Resource title"
                          disabled={row.category !== "Reference Materials"}
                        />
                      </td>
                      <td className="border p-2">
                        <Select
                          value={row.category}
                          onValueChange={(val) => handleChange(index, "category", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {RESOURCE_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border p-2">
                        <Input
                          value={row.file_url}
                          onChange={(e) => handleChange(index, "file_url", e.target.value)}
                          placeholder="Optional URL"
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <Button type="button" variant="destructive" onClick={() => removeRow(index)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button type="button" onClick={addRow} className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Row
            </Button>

            <div className="flex space-x-4 mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : <><Save className="h-4 w-4 mr-2" /> Submit All</>}
              </Button>
              <Link href={`/admin/subjects/${params.id}/resources`}>
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

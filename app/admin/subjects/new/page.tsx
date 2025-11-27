"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { ArrowLeft, Save, Plus } from "lucide-react"
import Link from "next/link"
import { AVAILABLE_SEMESTERS } from "@/utils/semesterUtils"

interface SubjectRow {
  name: string
  code?: string
  semester?: string
}

export default function BulkSubjectPage() {
  const router = useRouter()
  const [rows, setRows] = useState<SubjectRow[]>([{ name: "", code: "", semester: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Unique sorted semester numbers for dropdown
  // Use full semester list (number + type)
  const semesterOptions = AVAILABLE_SEMESTERS;

  const handleChange = (index: number, field: keyof SubjectRow, value: string) => {
    const newRows = [...rows]
    newRows[index][field] = value
    setRows(newRows)
  }

  const addRow = () => setRows([...rows, { name: "", code: "", semester: "" }])
  const removeRow = (index: number) => setRows(rows.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    try {
      console.log("Submitting rows:", rows)

      const validRows = rows.filter(row => row.name.trim() && row.semester)
      if (!validRows.length) {
        alert("Please fill in at least one valid subject.")
        setIsSubmitting(false)
        return
      }

      const payload = validRows.map(row => {
        const semInfo = AVAILABLE_SEMESTERS.find(s => s.slug === row.semester)

        return {
          name: row.name.trim(),
          code: row.code?.trim() || null,
          semester: semInfo ? semInfo.number : null,
          old_new: semInfo ? semInfo.type : null,
        }
      })

      console.log("Submitting payload:", payload)

      const { error } = await supabase.from("subjects").insert(payload)

      if (error) throw error

      router.push("/admin/subjects")
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert("Failed to create subjects. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/subjects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Subjects
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bulk Add Subjects</h1>
          <p className="text-muted-foreground">Add multiple subjects at once</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subjects Table</CardTitle>
          <CardDescription>Fill in multiple subjects below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-background  table-auto border-collapse border border-slate-200">
                <thead>
                  <tr className="">
                    <th className="border p-2 text-left">Subject Name</th>
                    <th className="border p-2 text-left">Code</th>
                    <th className="border p-2 text-left">Semester</th>
                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index} className="hover:bg-muted">
                      <td className="border p-2">
                        <Input
                          value={row.name}
                          onChange={(e) => handleChange(index, "name", e.target.value)}
                          placeholder="Subject name"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          value={row.code}
                          onChange={(e) => handleChange(index, "code", e.target.value)}
                          placeholder="Optional code"
                        />
                      </td>
                      <td className="border p-2">
                        <Select
                          value={row.semester}
                          onValueChange={(val) => handleChange(index, "semester", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {semesterOptions.map((sem) => (
                              <SelectItem 
                                key={sem.slug} 
                                value={sem.slug} // store slug instead of number
                              >
                                {sem.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                {isSubmitting ? "Submitting..." : <><Save className="h-4 w-4 mr-2"/> Submit All</>}
              </Button>
              <Link href="/admin/subjects">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

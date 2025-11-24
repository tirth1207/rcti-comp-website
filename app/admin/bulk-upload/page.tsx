"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/subject-columns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, FileDown, Database, Loader2 } from "lucide-react";

// ----- FIXED CATEGORIES -----
const RESOURCE_CATEGORIES = [
  "Notes",
  "Presentations",
  "Assignments",
  "Syllabus",
  "Resources",
  "Lab Manual",
  "Question Papers",
  "Reference Materials",
  "Other",
];

function normalizeCategory(cat: any) {
  if (!cat) return "Other";
  const clean = cat.trim().toLowerCase();

  if (clean === "syllabus" || clean === "syallabus") return "Syllabus";
  if (clean.includes("assign")) return "Assignments";
  if (clean.includes("lab")) return "Lab Manual";
  if (clean.includes("previous") || clean.includes("paper")) return "Question Papers";
  if (clean.includes("study") || clean.includes("material")) return "Reference Materials";
  if (clean.includes("note")) return "Notes";
  if (clean.includes("present")) return "Presentations";
  if (clean.includes("resource")) return "Resources";

  return "Other";
}

export default function MultiSubjectUploader() {
  const supabase = createClient();

  type Resource = { category: string; url: string };
  type SubjectRow = { semester: number; code: string; name: string; resources: Resource[] };

  const [parsedData, setParsedData] = useState<SubjectRow[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const appendLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const handleUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (res: any) => processCSV(res.data),
    });
  };

  const downloadTemplate = () => {
    const csvContent =
      "Subject,,,Material,,\n" +
      "Semester,Sub_Code,Subject_Name,Category,URL\n" +
      "1,DI0100001,Example Subject,Syllabus,https://example.com\n" +
      ",,,Assignments,https://example.com\n" +
      ",,,Lab Manual,https://example.com\n" +
      ",,,Question Papers,https://example.com\n" +
      ",,,Reference Materials,https://example.com\n" +
      ",,,Notes,https://example.com\n" +
      ",,,Presentations,https://example.com\n" +
      ",,,Resources,https://example.com\n" +
      ",,,name(Other),https://example.com\n";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "subject_template.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const processCSV = (rows: any) => {
    appendLog("Processing CSV…");
    rows = rows.slice(2);

    let subjects: SubjectRow[] = [];
    let current: SubjectRow | null = null;

    rows.forEach((row: any) => {
      const [semester, code, name, category, url] = row;

      if (semester && code && name) {
        if (current) subjects.push(current);

        current = {
          semester: Number(semester),
          code: String(code),
          name: String(name),
          resources: [],
        };

        if (category && url) {
          current.resources.push({
            category: normalizeCategory(category),
            url: String(url),
          });
        }

        return;
      }

      if (!semester && !code && !name && category && url) {
        if (current) {
          current.resources.push({
            category: normalizeCategory(category),
            url: String(url),
          });
        }
      }
    });

    if (current) subjects.push(current);

    appendLog(`Detected ${subjects.length} subjects.`);
    setParsedData(subjects);
  };

  const handleInsert = async () => {
    setLoading(true);
    appendLog("Uploading to Supabase…");

    for (const s of parsedData) {
      appendLog(`→ Inserting subject ${s.name} (${s.code})`);

      const { data: sub, error: err1 } = await supabase
        .from("subjects")
        .insert({
          name: s.name,
          code: s.code,
          semester: s.semester,
        })
        .select()
        .single();

      if (err1) {
        appendLog("❌ Subject failed: " + err1.message);
        continue;
      }

      const resources = s.resources.map((r) => ({
        subject_id: sub.id,
        title: r.category,
        category: r.category,
        file_url: r.url,
        file_type: "link",
      }));

      const { error: err2 } = await supabase.from("resources").insert(resources);

      if (err2) appendLog("❌ Resource insert error: " + err2.message);
      else appendLog(`✔ Inserted ${resources.length} resources`);
    }

    appendLog("🎉 Upload complete.");
    setLoading(false);
  };

  return (
  <div className="space-y-10 ">

    {/* HEADER */}
    <div>
      <h1 className="text-3xl font-bold tracking-tight">CSV Subject Importer</h1>
      <p className="text-muted-foreground">Import subjects & resources the smart way</p>
    </div>

    {/* UPLOAD CARD */}
    <Card className="border">
      <CardHeader>
        <CardTitle>Upload CSV</CardTitle>
        <CardDescription>Attach your CSV file and preview before saving</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* TEMPLATE BUTTON */}
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="w-fit"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Download CSV Template
        </Button>

        {/* DROPZONE */}
        <label className="
          flex flex-col items-center justify-center
          w-full h-40 border-2 border-dashed rounded-md 
          cursor-pointer hover:bg-muted/20 transition
        ">
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <span className="mt-2 text-sm text-muted-foreground">
            Click to select CSV file
          </span>
          <input
            type="file"
            className="hidden"
            accept=".csv"
            onChange={handleUpload}
          />
        </label>

        {/* ACTION BUTTONS */}
        {parsedData.length > 0 && (
          <Button
            className=""
            onClick={handleInsert}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Insert into Supabase
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>

    {/* PREVIEW TABLE */}
    {parsedData.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Review extracted subjects before inserting</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={parsedData} />
        </CardContent>
      </Card>
    )}

    {/* IMPORT LOG */}
    <Card className="bg-background border border-muted">
      <CardHeader>
        <CardTitle className="text-foreground">Import Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto text-foreground font-mono text-sm p-2 space-y-1">
          {log.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </CardContent>
    </Card>

  </div>
);

}

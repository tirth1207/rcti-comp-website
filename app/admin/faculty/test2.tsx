// import { createClient } from "@/lib/supabase/server"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { Plus } from "lucide-react"
// import { DataTable } from "@/components/data-table"
// import { columns } from "@/components/column"

// export default async function FacultyPage() {
//   const supabase = await createClient()

//   const { data: faculty, error } = await supabase
//     .from("faculty")
//     .select("*")
//     .order("name", { ascending: true })

//   if (error) {
//     console.error("Error fetching faculty:", error)
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Faculty Management</h1>
//           <p className="text-muted-foreground">Manage faculty profiles and information</p>
//         </div>
//         <Link href="/admin/faculty/new">
//           <Button>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Faculty
//           </Button>
//         </Link>
//       </div>

//       {/* Faculty Data Table */}
//       <DataTable columns={columns} data={faculty || []} />
//     </div>
//   )
// }
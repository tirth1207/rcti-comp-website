"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"

export type Faculty = {
  id: string
  name: string
  designation: string
  qualification: string
  contact: string
  email: string
  photo_url: string | null
}

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "review", label: "Review" },
  { value: "inquiry", label: "Inquiry" },
  { value: "suggestions", label: "Suggestions" },
  { value: "technical_issue", label: "Technical Issues" },
  { value: "rfi", label: "Requests for Information" },
  { value: "content_accuracy", label: "Feedback on Content Accuracy" },
  { value: "experience", label: "User Experience Feedback" },
  { value: "event_feedback", label: "Event Feedback" },
]

export default function FacultyPage() {
  const [data, setData] = React.useState<Faculty[]>([])
  const [loading, setLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [searchTerm, setSearchTerm] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")

  const [openDialog, setOpenDialog] = React.useState(false)
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)

  // Move fetchFaculty outside useEffect so it can be reused
  const fetchFaculty = React.useCallback(async () => {
    const supabase = createClient()
    const { data: faculty, error } = await supabase
      .from("faculty")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) console.error("Error fetching faculty:", error)
    else setData(faculty || [])

    setLoading(false)
  }, [])

  React.useEffect(() => {
    fetchFaculty()
  }, [fetchFaculty])

  async function handleDeleteConfirmed() {
    if (!pendingDeleteId) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from("faculty").delete().eq("id", pendingDeleteId)
      if (error) {
        console.error("Failed to delete faculty:", error)
        alert("Failed to delete faculty. Please try again.")
        return
      }
      setOpenDialog(false)
      setPendingDeleteId(null)
      fetchFaculty()
    } catch (err) {
      console.error("Unexpected error deleting faculty:", err)
      alert("An unexpected error occurred while deleting faculty.")
    }
  }

  function deleteFeedback(id: string) {
    setPendingDeleteId(id)
    setOpenDialog(true)
  }

  const columns: ColumnDef<Faculty>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
//   {
//     accessorKey: "email",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Email
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//     cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
//   },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "qualification",
    header: "Qualification",
  },
  // {
  //   accessorKey: "contact",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Contact
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => <div className="lowercase">{row.getValue("contact")}</div>,
  // },
  {
    accessorKey: "photo_url",
    header: "Photo",
    cell: ({ row }) => {
      const photoUrl = row.getValue("photo_url") as string | null
      const name = row.getValue("name") as string
      
      return photoUrl ? (
        <a href={photoUrl} target="_blank" rel="noopener noreferrer">
          <img 
            src={photoUrl} 
            alt={name} 
            className="h-10 w-10 rounded-full object-cover" 
          />
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const faculty = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger >
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(faculty.id)}
            >
              Copy faculty ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/faculty/${faculty.id}/edit`}>
                Edit faculty
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
               onClick={() => deleteFeedback(faculty.id)}
              >
              Delete faculty
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

  // Filtered Data
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const email = item.email?.toLowerCase() || ""
    

      const matchesSearch =
        email.includes(searchTerm.toLowerCase()) || ""
        

    //   const matchesCategory =
    //     categoryFilter === "all" || item.category === categoryFilter

      return matchesSearch
    })
  }, [data, searchTerm, categoryFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  if (loading) return <p className="text-center py-12">Loading feedback...</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Management</h1>
          <p className="text-muted-foreground">
            View and manage faculty profiles and information
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {filteredData.length} Total
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 py-4">
        <Input
          placeholder="Search by email, message, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger >
            <Button variant="outline" className="sm:ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex justify-end">
        <Link href="/admin/faculty/new">
           <Button>
             <Plus className="h-4 w-4 mr-2" />
             Add Faculty
           </Button>
        </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-visible rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No feedback found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Deletion Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Feedback</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

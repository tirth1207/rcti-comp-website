"use client";

import { ArrowUpRight } from "lucide-react";

export const columns = [
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Subject",
  },
  {
    id: "resources",
    header: "Resources",
    cell: ({ row  }:any) => {
      const items = row.original.resources;

      return (
        <div className="space-y-1">
          {items.map((r:any, i:any) => (
            <div key={i} className="flex gap-2">
              <span>• {r.category}</span>
              <a
                href={r.url}
                target="_blank"
                className="text-blue-500 underline"
              >
                link <ArrowUpRight className="inline-block w-3 h-3 mb-0.5" />
              </a>
            </div>
          ))}
        </div>
      );
    },
  },
];

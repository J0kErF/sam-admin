"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "product",
    header: "מוצר",
    cell: ({ row }) => {
      return (
        <Link
          href={`/products/${row.original.product._id}`}
          className="hover:text-red-1"
        >
          {row.original.product.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "location",
    header: "מיקום",
  },
  {
    accessorKey: "size",
    header: "גודל",
  },
  {
    accessorKey: "quantity",
    header: "כמות",
  },
];

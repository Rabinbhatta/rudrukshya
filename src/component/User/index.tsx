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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
 


import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MdDelete } from "react-icons/md";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    name:"arabin bhattarai",
    email: "ken99@yahoo.com",
    phone: 9851000,
    address:"basundhara"
  },
  {
    id: "m5gr84i9",
    name:"brabin bhattarai",
    email: "ken99@yahoo.com",
    phone: 9851000,
    address:"basundhara"
  },
  {
    id: "m5gr84i9",
    name:"aaarabin bhattarai",
    email: "ken99@yahoo.com",
    phone: 9851000,
    address:"basundhara"
  },
  {
    id: "m5gr84i9",
    name:"aarabin bhattarai",
    email: "rabin@yahoo.com",
    phone: 9851000,
    address:"basundhara"
  },
  {
    id: "m5gr84i9",
    name:"rabin bhattarai",
    email: "ken99@yahoo.com",
    phone: 9851000,
    address:"basundhara"
  },
  {
    id: "m5gr84i9",
    name:"rabin bhattarai",
    email: "ken99@yahoo.com",
    phone: 9851000,
    address:"basundhara"
  },
  {
    id: "m5gr84i9",
    name:"rabin bhattarai",
    email: "ken99@yahoo.com",
    phone: 9851000,
    address:"basundhara"
  },
  {
    id: "m5gr84i9",
    name:"rabin bhattarai",
    email: "ken99@yahoo.com",
    phone: 9851000,
    address:"basundhara"
  },
  {id: "m5gr84i9",
    name:"rabin bhattarai",
    email: "ken99@yahoo.com",
    phone: 9851000,
    address:"basundhara"
  },
  {
    id: "m5gr84i9",
    name:"rabin bhattarai",
    email: "ken99@yahoo.com",
    phone: 9851000,
    address:"basundhara"
  },
]



  
 
  



export type Payment = {
  id: string
  name:string
  phone: number
  email: string
  address:string
}

export const columns: ColumnDef<Payment>[] = [

  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div>
            Name
           <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          
          <ArrowUpDown />
        </Button>
        </div>
        
      )
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("address")}</div>
    ),
  },

  {
    accessorKey: "phone",
    header: () => <div className="text-center">Phone number</div>,
    cell: ({ row }) => {
      const phone = parseFloat(row.getValue("phone"))

      // Format the amount as a dollar amount
      

      return <div className="text-center font-medium">{phone}</div>
    },

  },
  {
    header: " ",
    cell: ({ row }) => (
      <div className="capitalize">
          
           <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline"><MdDelete className="text-red-600 ml-2 text-xl"/><h1 className="text-red-600 text-left">Delete</h1></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              account and remove the data from your servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
           
      </div>
    ),
  },
  
]

export default function User() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
 
  return (
    <div className="w-full ">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter name or email ..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        
      </div>
      <div className="rounded-md border w-[58rem]">
        <Table >
          <TableHeader className="text-xl"  >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
    </div>
  )
}

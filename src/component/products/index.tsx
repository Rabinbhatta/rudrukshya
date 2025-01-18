"use client";
import * as React from "react"
import { useState,useEffect } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
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

import Link from "next/link";

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

import { getAllProduct,deleteProduct,createProduct} from "@/services/product";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";




export type Payment = {
  _id?: string;
  title: string;
  price: string;
  category: string;
  img: string[];
};

const handleDelete = async (id: string | undefined) => {
  try {
    console.log(id)
    if(id)
    await deleteProduct(id);
    window.location.reload();
  } catch (err) {
    console.error("Error deleting user:", err);
  }
};

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "img",
        header: "Image",
        cell: ({ row }) => (
          <div className="capitalize flex justify-center">
  <Image
    src={(row.getValue("img") as string[])[0]}
    alt="image"
    width={80}
    height={80}
    style={{
      objectFit: 'cover',
      maxWidth: '100%',
      maxHeight: '80px', // or a suitable max height
      width: 'auto',
      height: 'auto'
    }}
  />
</div>

        ),
      },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <div className="capitalize text-center">
        Title
      </div>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("price")}</div>
    ),
  },
 
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("category")}</div>
    ),
    
  },
  
  {
    header: "Action ",
    cell: ({ row }) => (
         <div className="flex gap-5 justify-center">
                  <div>
                  <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline"><MdDelete className="text-red-600 text-xl"/><h1 className="text-red-600">Delete</h1></Button>
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
                    <AlertDialogAction className="bg-red-600" onClick={()=>handleDelete(row.original._id)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
                  </div>
                  <div>
                    <Link href={`/products/product/${row.original._id}`} passHref>
                    <Button variant="outline"><MdOutlineModeEditOutline className="text-xl "/><h1>Edit</h1></Button>
                    </Link>
                  

          
                  </div>
                   
                   
              </div>
    ),
  },
  
];

export default function Products() {
  const [users, setUsers] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const[page,setPage]=useState(1);
  const[nextDisable,setNextDisable]=useState(false);
  const [previousDisable,setPreviousDisable]=useState(true);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: users,
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
  });
  
  const fetchData = async (page:number,limit:number) => {
    try {
      const data = await getAllProduct(page,limit);
      
      setPage(data.pagination.currentPage)
      if(data.pagination.currentPage===data.pagination.totalPages){
        setNextDisable(true)
      }else{
        setNextDisable(false)
      }
      if(data.pagination.currentPage===1){
        setPreviousDisable(true)
      }else{
        setPreviousDisable(false)
      }
      console.log(data)
      setUsers(data?.products);
      setLoading(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      setLoading(false);
    }
  };
 

  
  useEffect(() => {
    

    fetchData(1,8);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
              <Input
                placeholder="Filter title  ..."
                value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <Link href="/products/product/new" passHref>
              <Button variant="outline" ><FaPlus className="text-xl text-green-600 "/><h1 className="text-green-600 text-lg">Add Product</h1></Button></Link>
            </div>
      <div className="rounded-md border w-[65rem]  ">
        <Table>
          <TableHeader className="text-xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="text-center" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
        <Button
          variant="outline"
          size="sm"
          onClick={()=>fetchData(page-1,8)}
          disabled={previousDisable}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchData(page+1,8)}
          disabled={nextDisable}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

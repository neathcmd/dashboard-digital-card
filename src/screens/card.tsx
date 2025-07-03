// import React, { useState } from "react";
// import { requestCards } from "@/lib/api/cards-api";
// import {
//   type ColumnDef,
//   type ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   type SortingState,
//   useReactTable,
//   type VisibilityState,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// // import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { ArrowUpDown, ChevronDown, Pen, Trash } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { Pagination } from "@/lib/pagination";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";
// import { Badge } from "@/components/ui/badge";
// import type { ICard } from "@/types/cards-type";

// dayjs.extend(utc);
// dayjs.extend(timezone);

// const CardsTable: React.FC = () => {
//   const { CARDS } = requestCards();
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

//   const sortField = sorting[0]?.id ?? "created_at";
//   const sortOrder =
//     sorting.length === 0 ? "DESC" : sorting[0].desc ? "DESC" : "ASC";

//   const { data, isLoading } = useQuery({
//     queryKey: [
//       "cards",
//       pagination.pageIndex,
//       pagination.pageSize,
//       sortField,
//       sortOrder,
//     ],
//     queryFn: () =>
//       CARDS({
//         page: pagination.pageIndex + 1,
//         pageSize: pagination.pageSize,
//         sortBy: sortField,
//         sortOrder,
//       }),
//   });

//   const columns: ColumnDef<ICard>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <input
//           type="checkbox"
//           checked={table.getIsAllPageRowsSelected()}
//           onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
//         />
//       ),
//       cell: ({ row }) => (
//         <input
//           type="checkbox"
//           checked={row.getIsSelected()}
//           onChange={(e) => row.toggleSelected(e.target.checked)}
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       id: "no",
//       header: "No.",
//       cell: ({ row, table }) => {
//         const { pageIndex, pageSize } = table.getState().pagination;
//         return <div>{pageIndex * pageSize + row.index + 1}</div>;
//       },
//     },
//     {
//       accessorKey: "card_name",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
//         >
//           Card Name <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//     },
//     {
//       accessorKey: "card_number",
//       header: "Card Number",
//     },
//     {
//       accessorKey: "card_type",
//       header: "Type",
//     },
//     {
//       accessorKey: "card_expiry_date",
//       header: "Expiry",
//     },
//     {
//       accessorKey: "is_active",
//       header: "Status",
//       cell: ({ row }) => {
//         const active = row.original.is_active;
//         return (
//           <Badge variant={active ? "default" : "destructive"}>
//             {active ? "Active" : "Inactive"}
//           </Badge>
//         );
//       },
//     },
//     {
//       accessorKey: "created_at",
//       header: "Created At",
//       cell: ({ row }) => {
//         const rawDate = row.getValue("created_at") as string;
//         return (
//           <div>
//             {dayjs(rawDate).add(7, "hour").format("YYYY-MM-DD hh:mm A")}
//           </div>
//         );
//       },
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: () => (
//         <div className="flex gap-2">
//           <Badge>
//             <Pen className="w-3 h-3 mr-1" /> Edit
//           </Badge>
//           <Badge variant="destructive">
//             <Trash className="w-3 h-3 mr-1" /> Delete
//           </Badge>
//         </div>
//       ),
//     },
//   ];

//   const table = useReactTable({
//     data: data?.data || [],
//     columns,
//     pageCount: data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : -1,
//     manualPagination: true,
//     manualSorting: true,
//     getCoreRowModel: getCoreRowModel(),
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       pagination,
//     },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     onPaginationChange: setPagination,
//   });

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Cards Table</h2>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline">
//               Columns <ChevronDown />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             {table.getAllColumns().map((column) =>
//               column.getCanHide() ? (
//                 <DropdownMenuCheckboxItem
//                   key={column.id}
//                   checked={column.getIsVisible()}
//                   onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                 >
//                   {column.id}
//                 </DropdownMenuCheckboxItem>
//               ) : null
//             )}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       <div className="border rounded-md">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((group) => (
//               <TableRow key={group.id}>
//                 {group.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="text-center py-4"
//                 >
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="text-center py-4"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex justify-between items-center">
//         <Pagination
//           currentPage={table.getState().pagination.pageIndex + 1}
//           totalPages={table.getPageCount()}
//           onPageChange={(page) => table.setPageIndex(page - 1)}
//         />
//         <span className="text-sm text-muted-foreground">
//           Page {data?.meta?.page || 1} of {table.getPageCount()}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default CardsTable;

import React, { useState } from "react";
import { requestCard } from "@/lib/api/cards-api";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/lib/pagination";
import dayjs from "dayjs";

type ISocialLink = {
  id: string;
  platform: string;
  url: string;
};

type IUser = {
  id: string;
  full_name: string;
  email: string;
};

type ICard = {
  id: string;
  card_type: string;
  gender: string;
  phone: string;
  created_at: string;
  user: IUser;
  socialLinks: ISocialLink[];
};

type ApiResponse = {
  data: ICard[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
};

type GetCardsParams = {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  is_deleted: boolean;
  title?: string;
};

const CardsTable: React.FC = () => {
  const { CARDS } = requestCard();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortField = sorting[0]?.id ?? "created_at";
  const sortOrder: "ASC" | "DESC" =
    sorting.length === 0 ? "DESC" : sorting[0]?.desc ? "DESC" : "ASC";

  const titleFilter =
    (columnFilters.find((f) => f.id === "full_name")?.value as string) ?? "";

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: [
      "cards",
      pagination.pageIndex,
      pagination.pageSize,
      sortField,
      sortOrder,
      titleFilter,
    ],
    queryFn: async () => {
      const response = await CARDS({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sortField,
        sortOrder,
        is_deleted: false,
        title: titleFilter || undefined,
      } as GetCardsParams);

      // Ensure totalPages is present in meta
      const totalPages =
        typeof (response.meta as any)?.totalPages === "number"
          ? (response.meta as any).totalPages
          : Math.ceil(
              (response.meta?.total ?? 0) / (response.meta?.limit ?? 1)
            );

      return {
        ...response,
        meta: {
          ...response.meta,
          totalPages,
        },
        data: response.data.map((card: any) => ({
          ...card,
          gender: card.gender ?? "",
          phone: card.phone ?? "",
          socialLinks: card.socialLinks ?? [],
        })),
      };
    },
  });

  const columns: ColumnDef<ICard>[] = [
    {
      id: "no",
      header: "No.",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const rowIndex = row.index;
        return <div>{pageIndex * pageSize + rowIndex + 1}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "full_name",
      accessorFn: (row) => row.user.full_name,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.user.full_name}</div>,
    },
    {
      id: "email",
      accessorFn: (row) => row.user.email,
      header: "Email",
      cell: ({ row }) => <div>{row.original.user.email}</div>,
    },
    {
      accessorKey: "card_type",
      header: "Card Type",
      cell: ({ row }) => <div>{row.getValue("card_type")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {dayjs(row.getValue("created_at") as string).format(
            "YYYY-MM-DD hh:mm A"
          )}
        </div>
      ),
    },
    {
      id: "socialLinks",
      header: "Social Links",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {row.original.socialLinks?.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
              title={link.platform}
            >
              {link.platform}
            </a>
          )) || <span className="text-sm text-muted-foreground">No links</span>}
        </div>
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    pageCount: data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Cards Dashboard</h2>

      <div className="space-y-4">
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter name..."
              value={
                (table.getColumn("full_name")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("full_name")?.setFilterValue(e.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
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

          <div className="flex items-center justify-between py-4">
            <div className="text-muted-foreground text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {data?.meta?.total || 0} row(s) selected.
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
                >
                  {[5, 10, 20, 30, 40, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <Pagination
                currentPage={table.getState().pagination.pageIndex + 1}
                totalPages={table.getPageCount()}
                onPageChange={(page) => table.setPageIndex(page - 1)}
              />

              <div className="text-sm text-muted-foreground">
                Page {data?.meta?.page || 1} of {table.getPageCount()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsTable;

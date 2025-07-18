import React, { useState } from "react";
import { requestCards } from "@/lib/api/cards-api";
import { useCardDialog } from "@/store/card-dialog-store";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
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
import { ArrowUpDown, ChevronDown, Pen, Trash } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@/lib/pagination";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Badge } from "@/components/ui/badge";
import type { ICard } from "@/types/cards-type";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

dayjs.extend(utc);
dayjs.extend(timezone);

const CardsTable: React.FC = () => {
  const queryClient = useQueryClient();
  const { DELETE_CARD, CARDS } = requestCards();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const sortField = sorting[0]?.id ?? "created_at";
  const sortOrder =
    sorting.length === 0 ? "DESC" : sorting[0].desc ? "DESC" : "ASC";

  const { data, isLoading } = useQuery({
    queryKey: [
      "cards",
      pagination.pageIndex,
      pagination.pageSize,
      sortField,
      sortOrder,
    ],
    queryFn: () =>
      CARDS({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sortField,
        sortOrder,
      }),
    // Delete
  });
  console.log(data);
  const { mutate: deleteCard } = useMutation({
    mutationFn: (id: string) => DELETE_CARD(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  // console.log(data, "data===");
  const columns: ColumnDef<ICard>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "no",
      header: "No.",
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination;
        return <div>{pageIndex * pageSize + row.index + 1}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => {
        const avatar = row.getValue("avatar") as string;
        const defaultAvatar =
          "https://ui-avatars.com/api/?name=User&background=random";
        return (
          <img
            src={avatar || defaultAvatar}
            alt="User avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },

    {
      id: "full_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Full Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return typeof row.original.user === "object" &&
          row.original.user !== null &&
          "full_name" in row.original.user
          ? (row.original.user as { full_name: string }).full_name
          : "";
      },
      filterFn: (row, __, value) => {
        const userFullName =
          typeof row.original.user === "object" &&
          row.original.user !== null &&
          "full_name" in row.original.user
            ? (row.original.user as { full_name: string }).full_name
            : undefined;
        console.log("Filtering:", userFullName, value);

        return userFullName
          ? userFullName.toLowerCase().includes(value.toLowerCase())
          : false;
      },
    },
    {
      id: "user_name",
      accessorFn: (row) =>
        typeof row.user === "object" &&
        row.user !== null &&
        "user_name" in row.user
          ? (row.user as { user_name: string }).user_name
          : "",
      header: "Username", // Remove Button to allow built-in sorting
      cell: ({ row }) => {
        return typeof row.original.user === "object" &&
          row.original.user !== null &&
          "user_name" in row.original.user
          ? (row.original.user as { user_name: string }).user_name
          : "";
      },
      filterFn: (row, __, value) => {
        const userUserName =
          typeof row.original.user === "object" &&
          row.original.user !== null &&
          "user_name" in row.original.user
            ? (row.original.user as { user_name: string }).user_name
            : undefined;

        return userUserName
          ? userUserName.toLowerCase().includes(value.toLowerCase())
          : false;
      },
      enableSorting: true,
    },

    {
      accessorKey: "card_type",
      header: "Type",
    },

    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const rawDate = row.getValue("created_at") as string;
        return (
          <div>
            {dayjs(rawDate).add(7, "hour").format("YYYY-MM-DD hh:mm A")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const card = row.original;
        console.log(card.id, "card table");
        return (
          <div className="flex gap-2">
            {/* <Badge variant="destructive">
              <Trash className="w-3 h-3 mr-1" /> Delete
            </Badge>
            Delete Card */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Badge
                  variant="destructive"
                  className="cursor-pointer hover:opacity-80"
                >
                  <Trash size={16} /> Delete
                </Badge>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this card?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this card? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteCard(card.id)} // ✅ Make sure this runs
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
  console.log(data?.data, "===card");

  const table = useReactTable({
    data: data?.data || [],
    // typeof data?.cards === "object" &&
    // data?.cards !== null &&
    // "data" in (data.cards as Record<string, unknown>)
    //   ? (data.cards as { data: ICard[] }).data
    //   : [],
    columns,
    pageCount: data?.meta ? Math.ceil(data.meta.total / data.meta.limit) : -1,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
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
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Cards Table</h2>
          <Input
            placeholder="Filter card name..."
            value={
              (table.getColumn("full_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("full_name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {table.getAllColumns().map((column) =>
              column.getCanHide() ? (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ) : null
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
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
                  className="text-center py-4"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  className="text-center py-4"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <Pagination
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
        <span className="text-sm text-muted-foreground">
          Page {data?.meta?.page || 1} of {table.getPageCount()}
        </span>
      </div>
    </div>
  );
};

export default CardsTable;

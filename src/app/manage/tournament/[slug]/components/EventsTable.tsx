'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  Preloaded,
  useMutation,
  usePreloadedQuery,
  useQuery
} from 'convex/react';
import {
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  SettingsIcon,
  TrashIcon
} from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { TournamentProps } from '@/convex/schema/tournamentsSchema';
import { formatDate } from '@/helpers/formatDate';

import EmptyEvent from './EmptyEvent';

type Props = {
  preloadedData: Preloaded<
    typeof api.tournaments.getTournamentWithEventsBySlug
  >;
};

function GameCover({ id }: { id: number }) {
  const game = useQuery(api.games.getById, { id });

  return (
    <div className='aspect-9/12 max-w-[60px]'>
      {game ? (
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game?.cover?.imageId}.jpg`}
          alt={game?.name ?? 'Game Cover'}
          width={game?.cover.width ?? 100}
          height={game?.cover.height ?? 100}
        />
      ) : (
        <Skeleton className={'h-20 w-16 rounded-none'} />
      )}
    </div>
  );
}

export default function EventsTable({ preloadedData }: Props) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const { slug, events } = usePreloadedQuery(
    preloadedData
  ) as TournamentProps & {
    events: Doc<'events'>[];
  };
  const deleteEvent = useMutation(api.events.deleteEvent);
  const router = useRouter();

  async function handleDelete(id: Id<'events'>) {
    const res = await deleteEvent({ id });
    if (res.success) {
      toast.success(res.message);
      table.resetRowSelection();
      setRowSelection({});
    } else {
      toast.error(res.message);
    }
  }

  const columns: ColumnDef<Doc<'events'>>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'game',
      header: 'Game',
      cell: ({ row }) => {
        return <GameCover id={row.getValue('game')} />;
      }
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDownIcon className='ml-2' />
        </Button>
      ),
      cell: ({ row }) => (
        <span className='font-semibold'>{row.getValue('name')}</span>
      ),
      enableHiding: false
    },
    {
      accessorKey: 'entrantCap',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Player Cap
          <ArrowUpDownIcon className='ml-2' />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue('entrantCap')}</div>
    },
    {
      id: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => <span>{formatDate(row.original.startDate)}</span>
    },
    {
      id: 'actions',
      header: () => <span className='sr-only'>Actions</span>,
      enableHiding: false,
      cell: ({ row }) => (
        <div className='text-right'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='ghost'
                size='icon-sm'
              >
                <EllipsisVerticalIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={'max-w-[160px] p-2'}
              align={'end'}
            >
              <ul>
                <li>
                  <Button
                    asChild
                    variant='ghost'
                    className={'flex w-full items-center justify-start gap-2'}
                  >
                    <Link
                      href={`/manage/tournament/${slug}/events/${row.original._id}`}
                    >
                      <SettingsIcon size={16} />
                      Manage Event
                    </Link>
                  </Button>
                </li>
                <li>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        className={
                          'text-destructive hover:text-destructive flex w-full items-center justify-start gap-2'
                        }
                      >
                        <TrashIcon
                          size={16}
                          className='text-destructive'
                        />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {`Delete ${row.original.name} event?`}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the event from the tournament.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant={'destructive'}
                          onClick={() => handleDelete(row.original._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      )
    }
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
      pagination
    }
  });

  if (events.length === 0) {
    return <EmptyEvent slug={slug} />;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Input
          placeholder='Filter events by name...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='max-w-sm bg-white'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='ml-auto'
            >
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={(value: boolean) =>
                    column.toggleVisibility(value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='overflow-hidden border bg-white'>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='cursor-pointer'
                  onClick={() =>
                    router.push(
                      `/manage/tournament/${slug}/events/${row.original._id}`
                    )
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={
                        cell.column.id === 'select' ||
                        cell.column.id === 'actions'
                          ? (e) => e.stopPropagation()
                          : undefined
                      }
                    >
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
                  className='h-24 text-center'
                >
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

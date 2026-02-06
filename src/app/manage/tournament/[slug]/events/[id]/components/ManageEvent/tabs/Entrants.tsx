'use client';

import Image from 'next/image';
import { useState } from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import {
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  Users
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
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
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

type Props = {
  preloadedEntrants: Preloaded<typeof api.entrants.getByEvent>;
};

type Entrant = {
  _id: Id<'entrants'>;
  gamertag: string;
  seedHint?: number;
  user: {
    fullName: string;
    imageUrl?: string;
  } | null;
};

export default function Entrants({ preloadedEntrants }: Props) {
  const entrants = usePreloadedQuery(preloadedEntrants) as Doc<'entrants'>[];
  const removeEntrant = useMutation(api.entrants.removeEntrant);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  async function handleRemove(entrantId: Id<'entrants'>) {
    const res = await removeEntrant({ entrantId });
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  const columns: ColumnDef<Entrant>[] = [
    {
      id: 'avatar',
      header: '',
      cell: ({ row }) => {
        const user = row.original.user;
        return user?.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.fullName}
            width={32}
            height={32}
            className='size-8 rounded-full object-cover'
          />
        ) : (
          <div className='flex size-8 items-center justify-center rounded-full bg-gray-200 text-gray-500'>
            <Users className='size-4' />
          </div>
        );
      },
      enableSorting: false
    },
    {
      accessorKey: 'gamertag',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Gamertag
          <ArrowUpDownIcon className='ml-2 size-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <span className='font-medium'>{row.getValue('gamertag')}</span>
      )
    },
    {
      id: 'fullName',
      header: 'Name',
      accessorFn: (row) => row.user?.fullName ?? '',
      cell: ({ row }) => (
        <span className='text-gray-500'>
          {row.original.user?.fullName ?? '-'}
        </span>
      )
    },
    {
      accessorKey: 'seedHint',
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Seed
          <ArrowUpDownIcon className='ml-2 size-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const seed = row.getValue('seedHint') as number | undefined;
        return seed ? (
          <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600'>
            {seed}
          </span>
        ) : (
          <span className='text-gray-400'>-</span>
        );
      }
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
              className='max-w-[160px] p-2'
              align='end'
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='ghost'
                    className='text-destructive hover:text-destructive flex w-full items-center justify-start gap-2'
                  >
                    <TrashIcon size={16} />
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Remove {row.original.gamertag}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the entrant from this event. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant='destructive'
                      onClick={() => handleRemove(row.original._id)}
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </PopoverContent>
          </Popover>
        </div>
      )
    }
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: entrants ?? [],
    columns: columns as ColumnDef<Doc<'entrants'>>[],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination
    }
  });

  if (!entrants) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='size-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900' />
      </div>
    );
  }

  if (entrants.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <Users className='mb-4 size-12 text-gray-400' />
        <h3 className='text-lg font-semibold text-gray-900'>No entrants yet</h3>
        <p className='mt-1 text-sm text-gray-500'>
          Entrants will appear here once they register for the event.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <Input
        placeholder='Filter by gamertag...'
        value={(table.getColumn('gamertag')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('gamertag')?.setFilterValue(e.target.value)
        }
        className='max-w-sm bg-white'
      />

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
                  className='h-24 text-center'
                >
                  No entrants found.
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

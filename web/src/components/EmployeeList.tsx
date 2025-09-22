import { useState } from 'react';
import { Employee } from '../types';
import {
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function EmployeeList({
  employees,
  loading,
  onReload,
  onDelete,
}: {
  employees: Employee[];
  loading: boolean;
  onReload: () => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function confirmDelete(id: string) {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  }

  return (
    <div className='border rounded-sm p-4'>
      <div className='flex items-center justify-end mb-2'>
        <button
          className='text-sm underline hover:no-underline'
          onClick={onReload}
          disabled={loading}
          title='Ladda om'
        >
          <ArrowPathIcon className='h-4 w-4' />
        </button>
      </div>

      {loading ? (
        <p className='text-gray-500'>Laddar…</p>
      ) : employees.length === 0 ? (
        <p className='text-gray-500'>Inga anställda ännu.</p>
      ) : (
        <ul className='divide-y'>
          {employees.map((e) => (
            <li
              key={e.id}
              className='py-2 flex items-center justify-between gap-3'
            >
              <div>
                <div className='font-medium'>
                  {e.firstName} {e.lastName}
                </div>
                <div className='text-sm text-gray-600'>{e.email}</div>
              </div>

              {confirmingId === e.id ? (
                <div className='flex items-center gap-2'>
                  <button
                    className='text-sm text-red-700 font-semibold hover:underline disabled:opacity-60'
                    onClick={() => confirmDelete(e.id)}
                    disabled={deletingId === e.id}
                    title='Bekräfta'
                  >
                    {deletingId === e.id ? (
                      'Tar bort…'
                    ) : (
                      <CheckIcon className='h-4 w-4' />
                    )}
                  </button>
                  <button
                    className='text-sm text-gray-500 hover:underline'
                    onClick={() => setConfirmingId(null)}
                    disabled={deletingId === e.id}
                    title='Avbryt'
                  >
                    <XMarkIcon className='h-4 w-4' />
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmingId(e.id)} title='Ta bort'>
                  <TrashIcon className='h-5 w-5 hover:opacity-80' />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export function Alert({
  kind,
  children,
  autoHideMs = 3000,
  onClose,
}: {
  kind: 'success' | 'error';
  children: React.ReactNode;
  autoHideMs?: number;
  onClose?: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const tIn = setTimeout(() => setVisible(true), 10);
    let tOut: number | undefined;
    let tClose: number | undefined;

    if (autoHideMs > 0) {
      tOut = window.setTimeout(() => {
        setVisible(false);
        tClose = window.setTimeout(() => onClose?.(), 300);
      }, autoHideMs);
    }
    return () => {
      clearTimeout(tIn);
      if (tOut) clearTimeout(tOut);
      if (tClose) clearTimeout(tClose);
    };
  }, [autoHideMs, onClose]);

  const palette =
    kind === 'success'
      ? 'border-green-500 bg-green-100 text-green-800'
      : 'border-red-500 bg-red-100 text-red-800';

  return (
    <div
      className={[
        'mb-4 flex items-start gap-2 rounded-md border px-3 py-2 shadow-sm',
        palette,
        'transition-all duration-300 ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1',
      ].join(' ')}
      role={kind === 'success' ? 'status' : 'alert'}
    >
      <div className='mt-0.5'>
        {kind === 'success' ? (
          <CheckIcon className='h-5 w-5' />
        ) : (
          <ExclamationTriangleIcon className='h-5 w-5' />
        )}
      </div>
      <div className='font-medium'>{children}</div>
    </div>
  );
}

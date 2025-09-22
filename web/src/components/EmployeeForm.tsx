import { FieldErrors } from '../types';

export default function EmployeeForm({
  form,
  fieldErrors,
  submitting,
  onChange,
  onSubmit,
}: {
  form: { firstName: string; lastName: string; email: string };
  fieldErrors: FieldErrors;
  submitting: boolean;
  onChange: <K extends keyof typeof form>(key: K, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className='grid gap-3 sm:grid-cols-3 mb-6'>
      <div>
        <input
          className={`border rounded-sm px-3 py-2 w-full ${
            fieldErrors.firstName ? 'border-red-400' : ''
          }`}
          placeholder='Förnamn'
          value={form.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          required
        />
        {fieldErrors.firstName && (
          <p className='text-sm text-red-600 mt-1'>{fieldErrors.firstName}</p>
        )}
      </div>

      <div>
        <input
          className={`border rounded-sm px-3 py-2 w-full ${
            fieldErrors.lastName ? 'border-red-400' : ''
          }`}
          placeholder='Efternamn'
          value={form.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          required
        />
        {fieldErrors.lastName && (
          <p className='text-sm text-red-600 mt-1'>{fieldErrors.lastName}</p>
        )}
      </div>

      <div className='sm:col-span-3'>
        <input
          className={`border rounded-sm px-3 py-2 w-full ${
            fieldErrors.email ? 'border-red-400' : ''
          }`}
          type='email'
          placeholder='E-post'
          value={form.email}
          onChange={(e) => onChange('email', e.target.value)}
          required
        />
        {fieldErrors.email && (
          <p className='text-sm text-red-600 mt-1'>{fieldErrors.email}</p>
        )}
      </div>

      <button
        className='sm:col-span-3 bg-gray-900 text-white py-2 rounded-sm hover:bg-gray-800 disabled:opacity-60'
        type='submit'
        disabled={submitting}
      >
        {submitting ? 'Sparar…' : 'Spara'}
      </button>
    </form>
  );
}

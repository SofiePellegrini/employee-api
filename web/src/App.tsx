import { useEffect, useState } from 'react';
import { Employee, FieldErrors } from './types';
import { fetchEmployees, createEmployee, deleteEmployee } from './api';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import { Alert } from './components/Alert';

export default function App() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (e: any) {
      setError(e.message ?? 'Kunde inte hämta anställda.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((fe) => ({ ...fe, [key]: undefined }));
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
      };

      await createEmployee(payload);
      setForm({ firstName: '', lastName: '', email: '' });
      await load();
      setSuccess('Anställd skapad');
    } catch (err: any) {
      if (err?.status === 400 && Array.isArray(err.body?.issues)) {
        const next: FieldErrors = {};
        for (const i of err.body.issues) {
          if (i?.path && typeof i.path === 'string')
            next[i.path as keyof FieldErrors] = i.message;
        }
        setFieldErrors(next);
        setError('Validering misslyckades.');
      } else if (err?.status === 409) {
        setFieldErrors((fe) => ({ ...fe, email: 'E-posten finns redan' }));
        setError('E-posten finns redan.');
      } else {
        setError(err?.message ?? 'Kunde inte skapa anställd.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    setSuccess(null);
    try {
      await deleteEmployee(id);
      await load();
      setSuccess('Anställd borttagen');
    } catch (e: any) {
      setError(e.message ?? 'Kunde inte ta bort anställd.');
    }
  }

  return (
    <div className='max-w-3xl mx-auto p-6 font-sans'>
      <div className='mt-12'>
        <h1 className='text-2xl mb-6'>Personalregister</h1>
        <div className='h-12'>
          {success && (
            <Alert
              kind='success'
              onClose={() => setSuccess(null)}
              autoHideMs={3000}
            >
              {success}
            </Alert>
          )}
          {error && (
            <Alert
              kind='error'
              onClose={() => setError(null)}
              autoHideMs={3500}
            >
              {error}
            </Alert>
          )}
        </div>
        <EmployeeForm
          form={form}
          fieldErrors={fieldErrors}
          submitting={submitting}
          onChange={updateField}
          onSubmit={handleSubmit}
        />

        <EmployeeList
          employees={employees}
          loading={loading}
          onReload={load}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

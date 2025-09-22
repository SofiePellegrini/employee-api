import { Employee } from "./types";


export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch("/api/employees");
  if (!res.ok) throw new Error(`GET failed: ${res.status}`);
  return res.json();
}

export async function createEmployee(payload: {
  firstName: string;
  lastName: string;
  email: string;
}): Promise<Employee> {
  const res = await fetch("/api/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || `POST failed: ${res.status}`, res.status, body);
  }

  return res.json();
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || `DELETE failed: ${res.status}`, res.status, body);

  }
}

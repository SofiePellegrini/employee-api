import express from "express";
import { z } from "zod";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string; 
};

const employees = new Map<string, Employee>();
let idCounter = 1;

const CreateEmployee = z.object({
  firstName: z.string().trim().min(1, "Förnamn krävs"),
  lastName: z.string().trim().min(1, "Efternamn krävs"),
  email: z
    .string()
    .trim()
    .toLowerCase()               
    .refine(v => v.includes("@"), "E-post måste innehålla '@'"),
});

export function createApp(serveFrontend = false) {
  const app = express();
  app.use(express.json());

  app.post("/api/employees", (req, res) => {
  const parsed = CreateEmployee.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "ValidationError",
      issues: parsed.error.issues.map(i => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const { firstName, lastName, email } = parsed.data; 

  const exists = [...employees.values()].some(e => e.email === email); 
  if (exists) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const emp: Employee = {
    id: String(idCounter++),
    firstName,
    lastName,
    email,                             
    createdAt: new Date().toISOString(),
  };

  employees.set(emp.id, emp);
  return res.status(201).json(emp);
});

  app.get("/api/employees", (_req, res) => {
    const list = [...employees.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(list);
  });

  app.delete("/api/employees/:id", (req, res) => {
    const { id } = req.params;
    if (!employees.has(id)) return res.status(404).json({ error: "Not found" });
    employees.delete(id);
    res.status(204).send();
  });

  return app;
}

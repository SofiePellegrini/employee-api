import request from "supertest";
import { createApp } from "../src/app.js";
import { describe, it, expect, beforeEach } from "vitest";
import type { Employee } from "../../web/src/types.js";

type ValidationIssue = {
  path: string;
  message: string;
};

type ValidationErrorResponse = {
  error: "ValidationError";
  issues: ValidationIssue[];
};

describe("Employees API", () => {
  let app = createApp();

  beforeEach(() => {
    app = createApp();
  });

  it("POST /api/employees creates employee", async () => {
    const res = await request(app)
      .post("/api/employees")
      .set("Content-Type", "application/json")
      .send({ firstName: "Anna", lastName: "Svensson", email: "anna@example.com" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      firstName: "Anna",
      lastName: "Svensson",
      email: "anna@example.com"
    });
    expect(res.body).toHaveProperty("id");
  });

  it("rejects empty fields and email without '@'", async () => {
    const res = await request(app)
      .post("/api/employees")
      .set("Content-Type", "application/json")
      .send({ firstName: "", lastName: "", email: "noatsign" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
    const body: ValidationErrorResponse = res.body;
    const messages = body.issues.map((i) => i.message);    
    expect(messages.join(" ")).toMatch(/Förnamn krävs/i);
    expect(messages.join(" ")).toMatch(/Efternamn krävs/i);
    expect(messages.join(" ")).toMatch(/@/);
  });

  it("lowercases email and prevents duplicates", async () => {
    const first = await request(app)
      .post("/api/employees")
      .set("Content-Type", "application/json")
      .send({ firstName: "Bo", lastName: "Li", email: "Bo.Li@Example.com" });

    expect(first.status).toBe(201);
    expect(first.body.email).toBe("bo.li@example.com");

    const dup = await request(app)
      .post("/api/employees")
      .set("Content-Type", "application/json")
      .send({ firstName: "Bo", lastName: "Li", email: "bo.li@example.com" });

    expect(dup.status).toBe(409);
    expect(dup.body).toMatchObject({ error: "Email already exists" });
  });

  it("GET /api/employees returns created items", async () => {
    await request(app)
      .post("/api/employees")
      .set("Content-Type", "application/json")
      .send({ firstName: "Eva", lastName: "Nilsson", email: "eva@example.com" });

    const res = await request(app).get("/api/employees");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("DELETE /api/employees/:id removes employee", async () => {
    const create = await request(app)
      .post("/api/employees")
      .set("Content-Type", "application/json")
      .send({ firstName: "Tim", lastName: "Olson", email: "tim@example.com" });
    const id = create.body.id;

    const del = await request(app).delete(`/api/employees/${id}`);
    expect(del.status).toBe(204);

    const list = await request(app).get("/api/employees");
expect(list.body.some((e: Employee) => e.id === id)).toBe(false);
  });

  it("DELETE non-existing -> 404", async () => {
    const res = await request(app).delete("/api/employees/does-not-exist");
    expect(res.status).toBe(404);
  });
});

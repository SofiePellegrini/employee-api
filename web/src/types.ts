export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

export type FieldErrors = Partial<Record<"firstName" | "lastName" | "email", string>>;

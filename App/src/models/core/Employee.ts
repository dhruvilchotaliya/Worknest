export enum EmployeePosition {
  Developer = 0,
  Designer = 1,
  Manager = 2,
  QA = 3,
}

export interface Employee {
  id: string;
  createdAt: string;
  updatedAt?: string;
  surname?: string;
  name?: string;
  joinedAt: string;
  position?: EmployeePosition;
  email?: string;
  teamId?: string;
}

export const EmployeePosition = {
  TechLead: 0,
  Developer: 1,
  HR: 2,
  ProjectManager: 3,
  PragramManager: 4,
  BDE: 5,
  QA: 6,
  Designer: 7,
} as const;

export type EmployeePosition = typeof EmployeePosition[keyof typeof EmployeePosition];

export const WorkModel = {
  Remote: 0,
  Hybrid: 1,
  OnSite: 2,
} as const;

export type WorkModel = typeof WorkModel[keyof typeof WorkModel];

export const POSITION_OPTIONS = [
	{ label: "Tech Lead", value: EmployeePosition.TechLead },
	{ label: "Developer", value: EmployeePosition.Developer },
	{ label: "HR", value: EmployeePosition.HR },
	{ label: "Project Manager", value: EmployeePosition.ProjectManager },
	{ label: "Program Manager", value: EmployeePosition.PragramManager },
	{ label: "BDE", value: EmployeePosition.BDE },
	{ label: "QA", value: EmployeePosition.QA },
	{ label: "Designer", value: EmployeePosition.Designer },
];

export const WORK_MODEL_OPTIONS = [
	{ label: "Remote", value: WorkModel.Remote },
	{ label: "Hybrid", value: WorkModel.Hybrid },
	{ label: "On-site", value: WorkModel.OnSite },
];

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



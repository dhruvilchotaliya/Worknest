export enum ProjectStatus {
  Planning = 0,
  InProgress = 1,
  Completed = 2,
  OnHold = 3,
}

export interface Project {
  id: string;
  createdAt: string;
  updatedAt?: string;
  teamId?: string;
  name: string;
  code?: string;
  status: ProjectStatus;
  description?: string;
  clientName?: string;
  startedAt?: string;
  endedAt?: string;
  isActive: boolean;
}

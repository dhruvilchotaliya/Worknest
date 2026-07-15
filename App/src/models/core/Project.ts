export const ProjectStatus = {
  Planning: 0,
  InProgress: 1,
  Completed: 2,
  OnHold: 3,
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

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

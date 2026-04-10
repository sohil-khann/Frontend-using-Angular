export interface TaskItem {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  userId: number;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface DeleteTaskResponse {
  message: string;
}

export interface AdminTaskItem {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  userId: number;
  username: string;
}

export interface UpdateRoleRequest {
  role: string;
}

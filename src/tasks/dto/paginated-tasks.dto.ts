export interface TaskResponse {
  TASK_KEY: string;
  ADMIN_KEY: string;
  TASK_TITLE?: string | null;
  TASK_COMPANY?: string | null;
  TASK_PRIORITY?: string | null;
  TASK_PROGRESSING?: string | null;
  TASK_ORDER_DATE?: Date | null;
  TASK_DELIVERY_DATE?: Date | null;
  TASK_DETAIL?: any;
  CREATED_AT?: Date | null;
  UPDATED_AT?: Date | null;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTasksResponse {
  data: TaskResponse[];
  pagination: PaginationInfo;
}

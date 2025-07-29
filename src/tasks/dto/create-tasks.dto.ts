export class CreateTasksDto {
  taskKey: string;
  adminKey: string;
  taskTitle?: string;
  taskDesc?: string;
  taskDetail?: any;
}

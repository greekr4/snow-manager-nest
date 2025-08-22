export class CreateTasksDto {
  adminKey: string;
  taskTitle: string;
  taskCompany: string;
  taskPriority: string;
  taskProgressing: string;
  taskOrderDate: Date;
  taskDeliveryDate: Date;
  taskDetail: any;
  taskThumbnail: string;
  taskDel: number;
}

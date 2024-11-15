import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task } from 'src/models/task';
import { TaskIdDto } from './dtos/task-id.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: TaskIdDto): Promise<Task> {
    console.log('PARAMS', params);
    return this.taskService.findOne(+params.id);
  }

  @Put(':id')
  update(
    @Param() params: TaskIdDto,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.update(+params.id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param() params: TaskIdDto) {
    return this.taskService.remove(+params.id);
  }
}

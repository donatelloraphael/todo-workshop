import { UpdateTaskDto } from './dtos/update-task.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/models/task';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create(createTaskDto);
    return await this.taskRepo.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepo.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id: id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const menu = await this.findOne(id);
    Object.assign(menu, updateTaskDto);
    return await this.taskRepo.save(menu);
  }

  async remove(id: number) {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`A task with id "${id}" was not found`);
    }
    return { message: 'Task successfully deleted' };
  }
}

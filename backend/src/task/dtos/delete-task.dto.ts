import { IsInt, Min } from 'class-validator';

export class DeleteTaskDto {
  @Min(1)
  @IsInt()
  id: number;
}

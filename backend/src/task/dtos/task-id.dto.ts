import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class TaskIdDto {
  @Min(1)
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;
}

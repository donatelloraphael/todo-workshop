import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTaskDto {
  @Min(1)
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  id: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  status: 'pending' | 'in progress' | 'completed';
}

import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  @Min(3000)
  @Max(65535)
  public readonly PORT: number;

  @IsNotEmpty()
  @IsString()
  public readonly DATABASE_URL: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  @Max(50)
  public readonly HASH_SALT: number;

  @IsNotEmpty()
  @IsString()
  public readonly JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  public readonly JWT_EXPIRE_IN: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

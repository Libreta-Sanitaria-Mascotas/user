import 'dotenv/config';
import { envValidationSchema } from './env.validation';

interface EnvVars {
  NODE_ENV: string;
  PORT: number;

  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_TYPE: 'postgres' | 'mysql' | 'mariadb' | 'sqlite';
  REDIS_HOST: string;
  REDIS_PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_EXPIRES_IN_REFRESH: string;
}

const { error, value } = envValidationSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
    type: envVars.DB_TYPE,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
    expiresInRefresh: envVars.JWT_EXPIRES_IN_REFRESH,
  }
};

import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URI: string;
  ENV_MODE: "development" | "production";
  BCRYPT_SALT_ROUNDS: number;
  OTP_LENGTH: number;
  OTP_EXPIRE_IN: string;

  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRE_IN: string;

  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRE_IN: string;

  JWT_RESET_SECRET: string;
  JWT_RESET_EXPIRE_IN: string;

  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
}

const loadEnv = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DATABASE_URI",
    "ENV_MODE",
    "BCRYPT_SALT_ROUNDS",
    "OTP_LENGTH",
    "OTP_EXPIRE_IN",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRE_IN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRE_IN",
    "JWT_RESET_SECRET",
    "JWT_RESET_EXPIRE_IN",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
  ];

  requiredEnvVariables.forEach((envVariable) => {
    if (!process.env[envVariable]) {
      throw new Error(`Environment variable ${envVariable} is not defined`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URI: process.env.DATABASE_URI as string,
    ENV_MODE: process.env.ENV_MODE as "development" | "production",

    BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS),
    OTP_LENGTH: Number(process.env.OTP_LENGTH),
    OTP_EXPIRE_IN: process.env.OTP_EXPIRE_IN!,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_ACCESS_EXPIRE_IN: process.env.JWT_ACCESS_EXPIRE_IN!,

    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_REFRESH_EXPIRE_IN: process.env.JWT_REFRESH_EXPIRE_IN!,

    JWT_RESET_SECRET: process.env.JWT_RESET_SECRET!,
    JWT_RESET_EXPIRE_IN: process.env.JWT_RESET_EXPIRE_IN!,

    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL!,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD!,
  };
};

const appConfig = loadEnv();

export default appConfig;

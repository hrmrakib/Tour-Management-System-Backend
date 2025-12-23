import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  MONGODB_URI: string;
  ENV_MODE: "development" | "production";
}

const loadEnv = (): EnvConfig => {
  const requiredEnvVariables: string[] = ["PORT", "DATABASE_URI", "NODE_ENV"];

  requiredEnvVariables.forEach((envVariable) => {
    if (!process.env[envVariable]) {
      throw new Error(`Environment variable ${envVariable} is not defined`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    MONGODB_URI: process.env.DATABASE_URI as string,
    ENV_MODE: process.env.NODE_ENV as "development" | "production",
  };
};

const environment = loadEnv();

export default environment;

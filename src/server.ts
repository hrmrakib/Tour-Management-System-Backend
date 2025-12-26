import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import "dotenv/config";
import appConfig from "./app/config/env";
import seedSuperAdmin from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(appConfig.DATABASE_URI as string);
    console.log(`Connected to database!`);

    server = app.listen(appConfig.PORT as string, () => {
      console.log(`Server started at http://localhost:${appConfig.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

// uncaughtException error
// process.on("uncaughtException", (error) => {
//   console.log("Uncaught Exception - Shutting down", error);
//   if (server) {
//     server.close(() => {
//       console.log(error);
//       process.exit(1);
//     });
//   }
// });

// Unhandled rejection error
// Promise.reject(new Error("I forgot to handle this error"));

// Uncaught Exception error
// Promise.reject(new Error("I forgot to handle this error"));

/**
 * Unhandled rejection error
 * Uncaught Exception error
 * signal termination - ctrl + C (sigterm)
 */

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

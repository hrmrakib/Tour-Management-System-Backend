import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import "dotenv/config";
import environment from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(environment.MONGODB_URI as string);
    console.log(`Connected to database!`);

    server = app.listen(environment.PORT as string, () => {
      console.log(`Server started at http://localhost:${environment.PORT}`);
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

startServer();

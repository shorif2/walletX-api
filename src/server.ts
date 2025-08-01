import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.MONGO_URI as string);
    console.log("Connected to MongoDB");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

(async () => {
  await startServer();
})();

// handle unhandledRejection error
process.on("unhandledRejection", async (err) => {
  console.log("Unhandled rejection", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// handle unhandledRejection error
process.on("uncaughtException", async (err) => {
  console.log("uncaughtException rejection", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// handle unhandledRejection error
process.on("SIGTERM", async () => {
  console.log("SIGTERM rejection");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", async () => {
  console.log("SIGINT rejection");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Promise.reject(new Error("I forget to catch this promise"));
// throw new Error("I forgot to handle this local error");
export { startServer };

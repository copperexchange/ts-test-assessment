import 'reflect-metadata';
import child_process from 'child_process';
import { container } from 'tsyringe';
import MainRoutes from './routes/mainRoutes';
import { Db } from './utils/db';

const start = async () => {
  child_process.execSync('flyway -c ./dist/utils/flywayDev migrate', { stdio: 'inherit' });

  const db = container.resolve(Db);

  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}. Closing resources...`);
    try {
      await db.close();
      console.log("Database connection closed.");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  const router = container.resolve(MainRoutes);
  router.init();
};

start();

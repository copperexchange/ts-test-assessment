import "reflect-metadata";
import child_process from "child_process";
import { container } from "tsyringe";
import { Db } from "../src/utils/db";

child_process.execSync("flyway -c ./dist/utils/flywayDev migrate", {
  stdio: "inherit",
});

afterAll(async () => {
  const db = container.resolve(Db);
  await db.close();
});

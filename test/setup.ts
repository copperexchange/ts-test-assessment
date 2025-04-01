import "reflect-metadata";
import child_process from "child_process";
import { container } from "tsyringe";
import { Db } from "../src/utils/db";
import path from "path";

const bin = path.resolve(process.cwd(), "node_modules/.bin");

try {
  child_process.execSync(`${bin}/flyway -c ./dist/utils/flywayDev migrate`, {
    stdio: "inherit",
  });
} catch (e) {
  console.error("Flyway migration exception:", e);
  throw e;
}

afterAll(async () => {
  const db = container.resolve(Db);
  await db.close();
});

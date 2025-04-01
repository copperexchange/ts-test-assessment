import { container } from "tsyringe";
import TestService from "../src/services/testService";
import { plainToClass } from "class-transformer";
import Test from "../src/datamodel/test";
import { Db } from "../src/utils/db";

describe("Test Service test", function () {
  beforeEach(async () => {
    const db = container.resolve(Db);
    await db.query('DELETE FROM test WHERE id > 1', Number);
  });

  it("should return data from database", async function () {
    const testService = container.resolve(TestService);
    const info = await testService.getInfo();

    expect(info).toBeInstanceOf(Test);
    expect(info).toMatchObject({
        id: "1",
        val: "some text",
    });
  });

  it("should insert many records", async function () {
    const testService = container.resolve(TestService);

    const data = [
      { id: "10", val: "some 20 text" },
      { id: "20", val: "some 10 text" },
    ];

    const result = await testService.insertMany(
      data.map((r) => plainToClass(Test, r)),
    );

    expect(result).toHaveLength(2);
    expect(result).toEqual(expect.arrayContaining(data));
  });
});

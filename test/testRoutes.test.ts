import { container } from "tsyringe";
import MainRoutes from "../src/routes/mainRoutes";

describe("Test Routes test", function () {
  beforeAll(() => {
    const router = container.resolve(MainRoutes);
    router.init();
  });

  afterAll(() => {
    const router = container.resolve(MainRoutes);
    router.close();
  });

  it("should return data from api", async function () {
    const result = await fetch("http://localhost:3000/test")
        .then((res) => res.json())

    expect(result).toMatchObject({
      id: "1",
      val: "some text",
    });
  });
});

import rewire from "rewire"
const ex1 = rewire("./ex1")
const main = ex1.__get__("main")
// @ponicode
describe("main", () => {
    test("0", async () => {
        await main()
    })
})

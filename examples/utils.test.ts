import * as utils from "./utils"
// @ponicode
describe("utils.delay", () => {
    test("0", () => {
        let callFunction: any = () => {
            utils.delay(12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            utils.delay("c466a48309794261b64a4f02cfcc3d64")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            utils.delay(9876)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            utils.delay(7588892)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            utils.delay("bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            utils.delay(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

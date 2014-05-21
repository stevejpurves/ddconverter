/**
 * Created with JetBrains RubyMine.
 * User: Steve
 * Date: 21/05/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */

function convert(input) {
    return "0.0, 0.0";
}

describe("Converting coordinates to Decimal Degrees",function(){
    it("Empty String", function(){
        expect(convert("")).toEqual("0.0, 0.0");
    });
    it("Degrees Minutes Seconds", function(){
        expect(convert("0 0 0.0N 0 0 0.0W")).toEqual("0.0, 0.0");
    });
});
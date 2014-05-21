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
    function expectConversion(input, expected) {
        expect(convert(input)).toEqual(expected);
    }

    it("Empty String", function(){
        expectConversion("", "0.0, 0.0");
    });
    it("Malformed Input", function(){
        expectConversion("jand7s1&* ksdj", "0.0, 0.0");
    });
    it("Degrees Minutes Seconds", function(){
        expectConversion("0 0 0.0N 0 0 0.0W", "0.0, 0.0");
    });
});
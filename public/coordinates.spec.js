/**
 * Created with JetBrains RubyMine.
 * User: Steve
 * Date: 21/05/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */

function looksLikeDegreesMinutesSeconds(input) {
    return input.match(/((\d+)\s(\d+)\s(\d+\.?\d?)N?)\s*((\d+)\s(\d+)\s(\d+\.?\d?)W?)/);
}

function convert(input) {
    var tokens = looksLikeDegreesMinutesSeconds(input);
    if (tokens)
        return parseFloat(tokens[0]).toString() + ".0, 0.0";
    return "";
}

describe("Converting coordinates to Decimal Degrees",function(){
    function expectConversion(input, expected) {
        expect(convert(input)).toEqual(expected);
    }

    it("Empty String", function(){
        expectConversion("", "");
    });
    it("Malformed Input", function(){
        expectConversion("jand7s1&* ksdj", "");
    });
    it("Degrees Minutes Seconds", function(){
        expectConversion("0 0 0.0N 0 0 0.0W", "0.0, 0.0");
        expectConversion("1 0 0.0N 0 0 0.0W", "1.0, 0.0");
    });
});
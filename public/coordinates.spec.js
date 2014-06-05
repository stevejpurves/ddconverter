/**
 * Created with JetBrains RubyMine.
 * User: Steve
 * Date: 21/05/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */

function looksLikeDegreesMinutesSeconds(input) {
    return input.match(/((-?\d+)\s(\d+)\s(\d+\.?\d?)N?)[,\s]+((-?\d+)\s(\d+)\s(\d+\.?\d?)W?)/);
}

function DecimalDegrees(degrees, minutes, seconds) {
        var dd = parseInt(degrees) + (parseInt(minutes) / 60) + (parseInt(seconds) / 360);
        var fix = 1;
        if (minutes > 0 || seconds > 0) fix = 5;
        return { toString: function() { return dd.toFixed(fix); } };
}

function convert(input) {
    var tokens = looksLikeDegreesMinutesSeconds(input);
    if (tokens) {
        var lat = DecimalDegrees(tokens[2], tokens[3], tokens[4]);
        var lng = DecimalDegrees(tokens[6], tokens[7], tokens[8]);
        return lat.toString() + ", " + lng.toString();
    }
    return "";
}

describe("Converting coordinates to Decimal Degrees",function(){
    function expectConversion(input, expected) {
        expect(convert(input)).toEqual(expected);
    }

    function itIsAnExpectedConversion(input, expected) {
        it(input, function(){
            expectConversion(input, expected);
        });
    }

    it("Empty String", function(){
        expectConversion("", "");
    });
    it("Malformed Input", function(){
        expectConversion("jand7s1&* ksdj", "");
    });

    describe("Degrees Minutes Seconds", function(){
        describe("general formatting",function(){
            itIsAnExpectedConversion("0 0 0.0N 0 0 0.0W", "0.0, 0.0");
            itIsAnExpectedConversion("0 0 0.0 0 0 0.0", "0.0, 0.0");
            itIsAnExpectedConversion("0 0 0.0N, 0 0 0.0W", "0.0, 0.0");
            itIsAnExpectedConversion("0 0 0.0, 0 0 0.0", "0.0, 0.0");
        });

        itIsAnExpectedConversion("1 0 0.0N 0 0 0.0W", "1.0, 0.0");
        itIsAnExpectedConversion("1 0 0.0N 1 0 0.0W", "1.0, 1.0");
        itIsAnExpectedConversion("1 1 0.0N 0 0 0.0W", "1.01667, 0.0");
        itIsAnExpectedConversion("1 0 1.0N 0 0 0.0W", "1.00278, 0.0");
        itIsAnExpectedConversion("1 1 1.0N 0 0 0.0W", "1.01944, 0.0");
        itIsAnExpectedConversion("0 0 0.0N 1 0 1.0W", "0.0, 1.00278");
        itIsAnExpectedConversion("0 0 0.0N 1 1 0.0W", "0.0, 1.01667");

        itIsAnExpectedConversion("90 0 0.0N 180 0 0.0W", "90.0, 180.0");
        itIsAnExpectedConversion("90 0 0.0N 360 0 0.0W", "90.0, 360.0");
        itIsAnExpectedConversion("-90 0 0.0N 180 0 0.0W", "-90.0, 180.0");
        itIsAnExpectedConversion("90 0 0.0N -180 0 0.0W", "90.0, -180.0");
    });
});
/**
 * Created with JetBrains RubyMine.
 * User: Steve
 * Date: 21/05/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */

function looksLikeDegreesMinutesSeconds(input) {
    return input.match(/((-?\d+)\s(\d+)\s(\d+\.?\d?)([NS]?))[,\s]+((-?\d+)\s(\d+)\s(\d+\.?\d?)([EW]?))/);
}

function dms2dd(degrees, minutes, seconds, letter) {
    var sign = (letter.indexOf("S") > -1.0) || (letter.indexOf("W") > -1.0) ? -1.0 : 1.0;
    return DecimalDegrees( sign * ( parseInt(degrees) + (parseInt(minutes) / 60) + (parseFloat(seconds) / 360) ) );
}

function DecimalDegrees(value) {
        var dd = value;
        if (dd > 180)
            dd -= 360;
        var fix = 1;
        if (value - Math.floor(value) > 0) fix = 5;
        return { toString: function() { return dd.toFixed(fix); } };
}

function LatLong(lat, lng) {
    var the_lat = lat;
    var the_long = lng;
    return { toString: function(){
        return the_lat.toString() + ", " + the_long.toString();
    }};
}

function convert(input) {
    var tokens = looksLikeDegreesMinutesSeconds(input);
    if (tokens) {
        var latlong = LatLong( dms2dd(tokens[2], tokens[3], tokens[4], tokens[5]), dms2dd(tokens[7], tokens[8], tokens[9], tokens[10]) );
        return latlong.toString();
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
            itIsAnExpectedConversion("0 0 0.0N 0 0 0.0E", "0.0, 0.0");
            itIsAnExpectedConversion("0 0 0.0S 0 0 0.0W", "0.0, 0.0");
            itIsAnExpectedConversion("0 0 0.0 0 0 0.0", "0.0, 0.0");
            itIsAnExpectedConversion("0 0 0.0N, 0 0 0.0E", "0.0, 0.0");
            itIsAnExpectedConversion("0 0 0.0S, 0 0 0.0W", "0.0, 0.0");
            itIsAnExpectedConversion("0 0 0.0, 0 0 0.0", "0.0, 0.0");
        });

        describe("Handling each of Degrees, Minutes and Decimal Seconds",function(){
            itIsAnExpectedConversion("1 0 0.0N 0 0 0.0E", "1.0, 0.0");
            itIsAnExpectedConversion("1 0 0.0N 1 0 0.0E", "1.0, 1.0");
            itIsAnExpectedConversion("1 1 0.0N 0 0 0.0E", "1.01667, 0.0");
            itIsAnExpectedConversion("1 0 1.0N 0 0 0.0E", "1.00278, 0.0");
            itIsAnExpectedConversion("1 1 1.0N 0 0 0.0E", "1.01944, 0.0");
            itIsAnExpectedConversion("0 0 0.0N 1 0 1.0E", "0.0, 1.00278");
            itIsAnExpectedConversion("0 0 0.0N 1 1 0.0E", "0.0, 1.01667");
            itIsAnExpectedConversion("0 0 0.1N 0 0 0.0E", "0.00028, 0.0");
        });

        describe("recognising W & S",function(){
            itIsAnExpectedConversion("10 10 10.1S 10 10 10.1W", "-10.19472, -10.19472");
        });

        describe("wrapping on the equator",function(){
            itIsAnExpectedConversion("0 0 0.0N 181 0 0.0E", "0.0, -179.0");
        });

        itIsAnExpectedConversion("90 0 0.0N 180 0 0.0E", "90.0, 180.0");
        itIsAnExpectedConversion("90 0 0.0N 360 0 0.0E", "90.0, 0.0");
        itIsAnExpectedConversion("-90 0 0.0N 180 0 0.0E", "-90.0, 180.0");
        itIsAnExpectedConversion("90 0 0.0N -180 0 0.0E", "90.0, -180.0");
    });
});
/**
 * Created with JetBrains RubyMine.
 * User: Steve
 * Date: 21/05/14
 * Time: 22:37
 * To change this template use File | Settings | File Templates.
 */

var dms_regexp_str = "((-?\\d+)\\s(\\d+)\\s(\\d+\\.?\\d?)([NS]?))[,\\s]+((-?\\d+)\\s(\\d+)\\s(\\d+\\.?\\d?)([EW]?))([,\\s]?)";

function looksLikeDegreesMinutesSeconds(input) {
    return extractDegreesMinutesSeconds(input) !== null;
}

function extractDegreesMinutesSeconds(input) {
    return input.match(new RegExp(dms_regexp_str, "g"));
}

function parseDegreesMinutesSeconds(input) {
    return input.match(new RegExp(dms_regexp_str));
}

function dms2dd(tokens) {
    var value = parseInt(tokens[0]);
    value += parseInt(tokens[1]) / 60;
    value += parseFloat(tokens[2]) / 360;
    var sign = (tokens[3].match(/[SW]/) !== null) ? -1.0 : 1.0;
    return DecimalDegrees( sign * value );
}

function DecimalDegrees(value) {
    var dd = value;
    if (dd > 180) dd -= 360;
    if (dd < -180) dd += 360;
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
    if (looksLikeDegreesMinutesSeconds(input)) {
        var matched_sets = extractDegreesMinutesSeconds(input);
        var output_string = "";
        for (var i = 0; i < matched_sets.length; i++) {
            var tokens = parseDegreesMinutesSeconds(matched_sets[i]);
            var latlong = LatLong( dms2dd(tokens.slice(2)), dms2dd(tokens.slice(7)) );
            output_string += latlong.toString();
            if (matched_sets.length > 0) output_string += tokens[11];
        }
        return output_string;
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

        describe("multiple entries",function(){
            itIsAnExpectedConversion("1 1 1.1 2 2 2.2\n3 3 3.3 4 4 4.4","1.01972, 2.03944\n3.05917, 4.07889");
            itIsAnExpectedConversion("1 1 1.1 2 2 2.2 3 3 3.3 4 4 4.4","1.01972, 2.03944 3.05917, 4.07889");
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
            itIsAnExpectedConversion("0 0 0.0N 181 0 0.0W", "0.0, 179.0");
        });

        describe("the poles",function(){
            itIsAnExpectedConversion("90 0 0.0N 180 0 0.0E", "90.0, 180.0");
            itIsAnExpectedConversion("90 0 0.0N 360 0 0.0E", "90.0, 0.0");
            itIsAnExpectedConversion("-90 0 0.0N 180 0 0.0E", "-90.0, 180.0");
            itIsAnExpectedConversion("90 0 0.0N -180 0 0.0E", "90.0, -180.0");
        });
    });
});
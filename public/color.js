var stackcolors
var items, scol, ecol;
function int(color1, color2, factor) {
    if (arguments.length < 3) { factor = 0.5; }
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
};

function stylesteps(c1, c2, len) {
    var colors = [];
    items = len,
        scol = h2r(c1),
        ecol = h2r(c2);
    var factorStep = 1 / (items - 1);
    //console.log(items)
    for (i = 0; i < items; i++) {
        var icol = int(scol, ecol, factorStep * i),
            res = 'rgba(' + icol[0] + ', ' + icol[1] + ','+ icol[2]+ ')'
        hcol = res;
        colors.push(hcol)
    }
    // console.log(colors)
    if (colors.length == 1) {
        colors = c1;
    }
    return colors
}

var h2r = function (hex) {
    var result = /^#?([a-f\d]{2})([ a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
};

// var r2h = function (rgb) {
//     return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
// };

var stackcolors = stackcolorgen()

function stackcolorgen() {
    // console.log("in")
    var sc = ["#297F87", "#297F87", "#DF2E2E", "#DF2E2E"]
    var srgb1 = []
    sc.forEach(function (color) {
        var col = h2r(color)
        var res = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + 1 + ')'
        //console.log(res)
        srgb1.push(res);
    });
    return srgb1;
}

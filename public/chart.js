// var ctx = document.getElementById('Charti').getContext('2d'); 
// var ctx1 = document.getElementById('Charti').getContext('20'); 
// var ctx3 = document.getElementById('Chart3').getContext('20'); 
// var ctx4 = document.getElementById('Chart4').getContext('2d'); 
// var ctxs = document.getElementById('Chart2').getContext('20');

var treemaparray = [], keys = [];
var newjson = [], keys, stackedBar, len, piename, labelsvi, oriwidth, onclickfilter
var Featurecount, Errorcount, maindata;
var booleanvalue = false

//var tempjson
var tp = { "Creation": { $exists: true } }
loader("none", "flex", "A11")

var value = localStorage.getItem("data")
// console.log(JSON.parse(value))
// console.log(value)
var json = JSON.parse(value)
// fetch('/contract', {
//     method: 'POST',
//     body: JSON.stringify(),
//     headers: {
//         'Content-type': 'application/json; charset=UTF-8'
//     }
// })
//     .then(response => response.json())
//     .then(json => {
try {

    loader("block", "none", "A11")

    maindata = json;
    console.log(maindata)
    // counter(json)
    chartselection.forEach(function (chart) {
        // console.log(chart)
        var titlename = '#' + chart.id + 'title'
        // console.log(titlename) 
        var title = document.querySelector(titlename)
        var valuename = '#' + chart.id + 'value'
        // console.log(titlename) 
        var totalvalue = document.querySelector(valuename)
        // console.log(title)
        switch (chart.Chart) {
            case "Line":
                // line(json[chart.Xaxis], chart.Maxis, chart.Naxis, chart.sort)
                window[chart.id] = createline(chart.id)
                // updateline(chart.id, newjson)
                // febuttons(chart)
                title.innerHTML = chart.Xaxis + " vs " + chart.Maxis

                break
            case "Bar":
                // console.log(json[chart.Xaxis])
                bar(json[chart.Xaxis], chart.Yaxis)
                window[chart.id] = createbar(chart.id, chart.Xaxis)
                updatebar(chart.id, barxaxis, baryaxis)
                febuttons(chart)
                title.innerHTML = chart.Xaxis + " vs " + chart.Yaxis

                break
            case "Pie":
                // console.log(json)
                pie(json[chart.Xaxis], chart.Yaxis)
                window[chart.id] = createpie(chart.id, chart.Xaxis)
                updatepie(chart.id, piexaxis, pieyaxis)
                febuttons(chart)
                title.innerHTML = chart.Xaxis + " vs " + chart.Yaxis

                break

            case "Treemap":
                // treemapnew(json[chart.Xaxis], chart.Yaxis)
                // console.log(json[chart.Xaxis])
                treemapnew(json[chart.Xaxis], chart.Yaxis)
                window[chart.id] = createtree(chart.id, chart.Xaxis)
                updatetree(chart.id)
                febuttons(chart)
                title.innerHTML = chart.Xaxis + " vs " + chart.Yaxis

                break

            case "StackedBar":
                var node = document.getElementById(chart.id)
                var chartcon = node.parentNode
                oriwidth = chartcon.offsetWidth
                // console.log(chart.Maxis)
                var tempjson = json[chart.Xaxis].slice(0, chart.value)
                stackbar(tempjson, chart.Maxis, chart.Naxis, chart.sort)
                window[chart.id] = createstackedbar(chart.id, chart.Xaxis)
                updatestackbar(chart.id, newjson)
                febuttons(chart)
                title.innerHTML = chart.Xaxis + " vs " + chart.Maxis

                break

            case "Info":
                var node = document.getElementById(chart.id)
                title.innerHTML = chart.title
                switch (chart.type) {
                    case "total":
                        var total
                        // console.log(chart.parameter)
                        // for (i = 0; i < json[chart.Xaxis].length; i++) {
                        //    var j=json[chart.Xaxis][i]
                        //    console.log(j[chart.parameter])
                        // }
                        total = json[chart.Xaxis].reduce(function (previousvalue, currentvalue) {
                            return previousvalue + currentvalue[chart.parameter];
                        }, 0);
                        // console.log(total);
                        totalvalue.innerHTML = total
                        break

                    case "highest":
                        var first = json[chart.Xaxis].sort(sortByProperty(chart.parameter))
                        var highest = first[0][chart.parameter]
                        totalvalue.innerHTML = highest
                        break
                }
        }


        function febuttons(chart) {
            //debugger
            var chartname = document.getElementById(chart.id)
            var parent = chartname.parentNode.parentNode.parentNode
            var value = chart.Yaxis;
            var chartid = parent.querySelector('canvas').id
            var febtn = parent.querySelectorAll('.febtn')
            var titlename = '#' + chart.id + 'title'
            //console.log(titlename) 
            var title = document.querySelector(titlename)
            var charttype

            febtn.forEach(function (btn) {
                // console.log(btn) 
                if (btn.value == value & chart.Chart != "StackedBar") {
                    switch (btn.value) {
                        case "count":

                            btn.style.color = "white"
                            btn.style.backgroundColor = "blue"
                            break

                        case "Error":
                        case "NormalError":
                        case "CriticalErron":

                            btn.style.color = "white"
                            btn.style.backgroundColor = "red"
                            break
                    }
                }
            })
        }
    })

    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;
    keys = [];
    for (var k in json) {
        // if (k != "Values")
        keys.push(k)
    }
    // console.log(keys)
    for (i = 0; i < keys.length; i++) {
        var lielement = document.createElement("li")
        lielement.id = "lidrop" + keys[i]
        var btn = document.createElement("button")
        btn.className = "dropdown-btn";
        btn.innerHTML = '<btn>' + keys[i] + '<btn>'
        var divelement = document.createElement("div")
        divelement.id = "drop" + keys[i]
        divelement.className = "dropdown-container"
        lielement.appendChild(btn);
        lielement.appendChild(divelement);
        document.getElementById("ulelement").appendChild(lielement);
        var anchor = document.createElement("a")
        // console.log(keys[i])
        anchor.id = keys[i];
        divelement.appendChild(anchor);
    }
    for (i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function () {
            for (i = 0; i < dropdown.length; i++) {
                if (dropdown[i].classList.contains('active')) {
                    //this.classList.remove('active')
                    if (dropdown[i] != this) {
                        var dropdownContent = dropdown[i].nextElementSibling;
                        dropdownContent.style.display = "none";
                        dropdown[i].classList.toggle("active")
                    }
                }
            }
            this.classList.toggle("active");
            var dropdownContent = this.nextElementSibling;
            //console.log(dropdownContent) 
            if (dropdownContent.style.display === "block") {
                //console.log("S")
                dropdownContent.style.display = "none";
            } else {
                //console.log("p") 
                dropdownContent.style.display = "block";
            }
        });
    }

    for (i = 0; i < keys.length; i++) {
        for (j = 0; j < json[keys[i]].length; j++) {
            var iDiv = document.createElement('div');
            iDiv.className = 'block1';
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            // console.log(json[keys[i]])
            checkbox.className = keys[i];
            checkbox.value = json[keys[i]][j].name;
            var opt = document.createElement('option');
            opt.className = 'opcb'
            opt.innerHTML = '<option id="' + j + '">' + json[keys[i]][j].name + '</option>'
            //iDiv.className = 'cb'; 
            iDiv.appendChild(checkbox);
            iDiv.appendChild(opt)
            document.getElementById(keys[i]).appendChild(iDiv);
        }
    }
} catch (error) {
    console.log(error);
}
// });

function expand(buttony, chart) {
    var x = buttony.parentNode.parentNode.parentElement;
    x.style.position = "fixed"
    x.style.top = "70px",
        x.style.left = "0",
        x.style.width = "100vw";
    x.style.height = "100vh-100px";
    chart.resize();
    exp = true
}

function close(buttony, chart) {
    var x = buttony.parentNode.parentNode.parentElement;
    x.style.position = null;
    x.style.top = null,
        x.style.left = null,
        x.style.width = null;
    x.style.height = null;
    chart.resize();
    exp = false
}

// var chart1fs = document.getElementById("Chart1Fs");
// var chart2fs = document.getElementById("Chart2Fs");
// var chart3fs = document.getElementById("Chart3Fs");
// var chart4fs = document.getElementById("Chart4Fs");

// chart1fs.addEventListener("click", function () {
//     exp ? close(this, Chart1) : expand(this, Chart1)
// });
// chart2fs.addEventListener("click", function () {
//     exp ? close(this, Chart2) : expand(this, Chart2)
// });
// chart3fs.addEventListener("click", function () {
//     exp ? close(this, Chart3) : expand(this, Chart3)
// });
// chart4fs.addEventListener("click", function () {
//     exp ? close(this, Chart4) : expand(this, Chart4)
// });

function yticks(item, index) {
    item = item / 1000 + 'k';
    if (!(index % 2)) {
        return item
    }
    if (item == "ok") {
        return item
    }
}
function xticks(value, num) {
    // console.log(value)
    if (value == null) {
        return "x"
    }
    else if (value.length > num) {
        // console.log(value.length)
        return value.substr(0, num) + '...'; //truncate 
    }
    else {
        return value
    }
}
function getid(chartname) {
    return chartselection.filter(function (chart) {
        if (chart.Chart == chartname) {
            return chart.id
        }
    })
};

function updatecharts(json, idval) {
    // console.log(chartselection) 
    // counter(json)
    //document.getElementById("FeatureVal").innerText=
    chartselection.forEach(function (chart) {

        switch (chart.Chart) {

            case "Bar":
                // console.log(json)
                if (chart.id !== idval) {
                    // console.log(json[chart.Xaxis])
                    bar(json[chart.Xaxis], chart.Yaxis)
                    updatebar(chart.id, barxaxis, baryaxis)
                }
                break
            case "Pie":
                // console.log(chart.id)
                // console.log(json[chart.Xaxis])
                if (chart.id !== idval) {
                    var pietempjson = json[chart.Xaxis].slice(0, chart.value)
                    pie(pietempjson, chart.Yaxis)
                    // pie(json[chart.Xaxis], chart.Yaxis)
                    updatepie(chart.id, piexaxis, pieyaxis)
                }
                break

            case "Treemap":
                // console.log(chart.id)
                // console.log(idval)
                if (chart.id !== idval) {
                    var treetempjson = json[chart.Xaxis].slice(0, chart.value)
                    // console.log(treetempjson)
                    treemapnew(treetempjson, chart.Yaxis)
                    updatetree(chart.id)
                }
                break

            case "StackedBar":
                if (chart.id !== idval) {
                    var tempjson = json[chart.Xaxis].slice(0, chart.value)
                    stackbar(tempjson, chart.Maxis, chart.Naxis, chart.sort)
                    updatestackbar(chart.id, newjson)
                }

            case "Line":
                // line(json[chart.Xaxis], chart.Maxis, chart.Naxis, chart.sort)
                window[chart.id] = createline(chart.id)
                // updateline(chart.id, newjson)
                // febuttons(chart)
                title.innerHTML = chart.Xaxis + " vs " + chart.Maxis
                break
        }
    })
}
// function counter(json) {
//     var Features = json.FeatureName
//     Featurecount = 0,
//         Errorcount = 0,
//         CriticalErrorcount = 0,
//         Features.forEach(function (val) {
//             Featurecount += val.count
//             //Errorcount += val.Error
//             Errorcount += val.NormalError
//             CriticalErrorcount += val.CriticalError
//         })
//     document.getElementById("FeatureVal").innerHTML = Featurecount
//     document.getElementById("ErrorsVal").innerHTML = Errorcount
//     document.getElementById("CriticalVal").innerHTML = CriticalErrorcount
//     document.getElementById("PartsVal").innerHTML = json.Values.Parts
// }
function loader(x, y, val) {
    //var Chart1 = document.getElementById("Chart1")
    //var Chart2 = document.getElementById("Chart2")
    //var Chart3 = document.getElementById("Chart3") 
    // var Chart4 = document.getElementById("Chart4")
    var loader = document.getElementsByClassName("loader");
    if ("Chart1" != val) {
        document.getElementById("Chart1").style.display = x
        loader[0].style.display = y;
    }
    if ("Chart2" != val) {
        document.getElementById("Chart2").style.display = x
        loader[1].style.display = y;
    }
    if ("Chart3" != val) {
        document.getElementById("Chart3").style.display = x
        loader[2].style.display = y;
    }
    if ("Chart4" != val) {
        document.getElementById("Chart4").style.display = x
        loader[3].style.display = y;
    }

    //var loader = document.getElementsByClassName("loader");
    //for (var i = 0; i < loader.length; i++) { 
    //loader[i].style.display = y;
    //}
}
// function counttofeature(count) {
//     if (count == 'count') {
//         return "Features"
//     }
//     else {
//         return count
//     }
// }


var filter = null

function getcheckold(classname) {
    let y = []
    ys = document.getElementsByClassName(classname);

    for (var i = 0; i < ys.length; i++) {
        if (ys[i].checked == true) {
            y.push(ys[i].value)
        }
    }
    console.log(y)
    if (y.length == 0) {
        for (var i = 0; i < ys.length; i++) {
            y.push(ys[i].value)
        }
        return y
    }
    else {
        //console.log(y) 
        return y
    }
}

function getcheck(classname) {
    let y = []
    ys = document.getElementsByClassName(classname);
    // console.log(ys)
    // console.log(ys[i].checked)
    for (var i = 0; i < ys.length; i++) {
        if (ys[i].checked == true) {
            y.push(ys[i].value)
        }
        // console.log(ys[i].checked)
    }
    // console.log(y)
    // if (y.length==0){ 
    //     for (var i=0; i<ys.length; i++)
    //            y.push(ys[i].value)
    //      }
    //      return y
    //  }
    //  else {
    //console.log(y)
    return y
    //}
}


function checkAll() {
    loader("none", "flex", "All")
    filter = []
    var arr = []
    // console.log(keys) 
    keys.forEach(function (k) {
        // console.log(k) 
        var fil = getcheck(k)
        if (fil.length != 0) {
            // console.log(k) 
            var jsonfile = {
                [k]: fil
            }
            arr.push(jsonfile)
        }
    });
    // console.log(maindata)
    // console.log(arr) 
    //console.log(a) 
    //const arr = { "year": y, "airport":a}
    onclickfilter = arr;
    // var tp= { "Creation": {
    //     $gte: '10/01/2021 00:00:00', 
    //     $lt: '10/03/2021 00:00:00'
    // }}
    // var tp= { "Creation": {$exists:true 
    // } }

    fetch('/filterdatajson', {
        method: 'POST',
        body: JSON.stringify({"filteredvalue":arr,"mainjson":maindata}),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(json => {
            // maindata = json
            // console.log(json) 
            try {
                loader("block", "none", "All")
                // console.log(document.getElementById("Charts").style.display) 
                if (document.getElementById("Charts").style.display = "flex") {

                    updatecharts(json, "Updated")
                }
                // else{ 
                //     createtable(onclickfilter)
                // }
                // console.log(onclickfilter)

                // generalname (json) 
                // generaldata(json) 
                // //updatebar1(); 
                // updatebar2(); 
                // updatetree(); 
                // updatepie();
                // updatestackbar() 
            } catch (error) {
                console.log(error);
            }
        });
}

function uncheck() {
    keys.forEach(function (k) {

        let y = []
        ys = document.getElementsByClassName(k);

        for (var i = 0; i < ys.length; i++) {
            ys[i].checked = false

        }
    })
    chartreset()
}

function onBarclickedairport(airportvalue, _callback) {
    const an = { "name": airportvalue, "filter": filter }
    //console.log(an)
    fetch('http://localhost:3000/airport', {
        method: 'POST',
        body: JSON.stringify(an),
        headers: {
            'Content-type': 'application/json; charset-UTF-8'
        }
    })
        .then(response => response.json())
        .then(json => {
            //console.log(json) 
            try {
                generaldata(json)
                _callback();

            } catch (error) {
                console.log(error);
            }
        });
}

function onBarclickedyears(_callback) {
    const an = { "year": yearvalue, "filter": filter }
    fetch('http://localhost:3000/years', {
        method: 'POST',
        body: JSON.stringify(an),
        headers: {
            'Content-type': 'application/json; charset-UTF-8'
        }
    })
        .then(response => response.json())
        .then(json => {
            try {
                //console.log(json) 
                generalname(json)
                _callback();

            } catch (error) {
                console.log(error);
            }
        });
}

function uncheckold() {
    ys = document.getElementsByClassName("cby");
    as = document.getElementsByClassName("cba")
    for (var i = 0; i < ys.length; i++) {
        ys[i].checked = false;
        as[i].checked = false;
    }
    chartreset()
}

function filterxaxis(xvalues, idval, callback) {
    // console.log(xvalues)
    // console.log(idval)
    loader("none", "flex", idval.canvas.id)
    //const an = { "xaxis": _xvalues,"filter":filter } 
    //fetch('http://localhost: 3000/ onclick, {
    // console.log(xvalues)
    fetch('/filterdatajson', {
        method: 'POST',
        body: JSON.stringify({"filteredvalue":xvalues,"mainjson":maindata}),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(json => {
            try {
                // maindata=json; 
                // console.log(maindata) 
                //generalname (json) 
                //console.log(json)
                loader("block", "none", idval.canvas.id)
                callback(json, idval);

            }
            catch (error) {
                console.log(error);
            }
        });
}

function onfeatureerrorclick(id) {
    var parent = id.parentNode.parentNode.parentNode.parentNode
    var value = id.value;
    var chartid = parent.querySelector('canvas').id
    var febtn = parent.querySelectorAll('.febtn')
    //console.log(febtn) 
    var charttype

    febtn.forEach(function (btn) {
        //console.log(btn) 
        btn.style.backgroundColor = "#F2F2F2"
        btn.style.color = "black"
    })

    console.log(id)
    switch (id.value) {
        case "count":

            id.style.color = "white"
            id.style.backgroundColor = "blue"
            break

        case "Error":
        case "NormalError":
        case "CriticalError":

            id.style.color = "white"
            id.style.backgroundColor = "red"
            break
    }

    chartselection.forEach(function (chart) {
        if (chart.id == chartid) {

            chart.Yaxis = value;
            charttype = chart.Chart
            var titlename = '#' + chart.id + 'title'
            var title = document.querySelector(titlename)

            switch (charttype) {
                case "Bar":
                    console.log(chart.id)
                    bar(maindata[chart.Xaxis], chart.Yaxis)
                    updatebar(chart.id, barxaxis, baryaxis)
                    title.innerHTML = chart.Xaxis + " vs " + counttofeature(value)
                    break

                case "Pie":
                    console.log(chart.id)
                    pie(maindata[chart.Xaxis], chart.Yaxis)
                    updatepie(chart.id, piexaxis, pieyaxis)
                    title.innerHTML = chart.Xaxis + " vs " + counttofeature(value)
                    break

                case "Treemap":
                    treemapnew(maindata[chart.Xaxis], chart.Yaxis)
                    updatetree(chart.id)
                    title.innerHTML = chart.Xaxis + ' ' + counttofeature(chart.Yaxis) + " Instances"
                    break

                case "StackedBar":
                    stackbar(maindata[chart.Xaxis])
                    var newdata = festackbar()
                    console.log(newdata)
                    window[chart.id].data.datasets = newdata;
                    window[chart.id].data.labels = labelsv1;
                    window[chart.id].update();
                    title.innerHTML = chart.Xaxis + " vs " + counttofeature(value)
                    break

            }

        }

    })
    //festackbar()
    function festackbar() {

        console.log(valus)
        const dataRemoves = newjson.filter((e1) => {
            return e1.label == value;
        });

        return (dataRemoved)
    }
}

function onclickfiltered(Xaxisonchart, clickname) {
    // console.log(Xaxisonchart)
    // console.log(clickname)
    if (onclickfilter != null) {
        var changed = false
        onclickfilter.forEach(function (fil) {
            if (Object.keys(fil)[0] == Xaxisonchart) {
                fil[Object.keys(fil)[0]] = [clickname]
                changed = true
            }

        })
        if (changed == false) {
            var newjson = {
                [Xaxisonchart]: [clickname]
            }

            onclickfilter.push(newjson)
        }


    }
    else {
        onclickfilter = [{ [Xaxisonchart]: [clickname] }]
    }

}

function chartreset() {
    filter = [];
    // Chart1.destroy();
    // Chart2.destroy();
    // Chart3.destroy();
    // Chart4.destroy();

    // fetch('/contract', {
    //     method: 'POST',
    //     body: JSON.stringify(),
    //     headers: {

    //         'Content-type': 'application/json; chartset=UTF-8'
    //     }
    // })
    //     .then(response => response.json())
    //     .then(json => {
    try {
        maindata = json;
        // counter (json) 
        chartselection.forEach(function (chart) {
            switch (chart.Chart) {
                case "Bar":
                    bar(maindata[chart.Xaxis], chart.Yaxis)
                    updatebar(chart.id, barxaxis, baryaxis)
                    break

                case "Pie":
                    pie(json[chart.Xaxis], chart.Yaxis)
                    window[chart.id] = createpie(chart.id, chart.Xaxis)
                    updatepie(chart.id, piexaxis, pieyaxis)
                    break

                case "Treemap":
                    treemapnew(json[chart.Xaxis], chart.Yaxis)
                    window[chart.id] = createtree(chart.id, chart.Xaxis)
                    updatetree(chart.id)
                    break

                case "StackedBar":
                    var node = document.getElementById(chart.id)
                    var chartcon = node.parentNode
                    oriwidth = chartcon.offsetWidth
                    var tempjson = json[chart.Xaxis].slice(0, chart.value)
                    stackbar(tempjson, chart.Maxis, chart.Naxis, chart.sort)
                    window[chart.id] = createstackedbar(chart.id, chart.Xaxis)
                    updatestackbar(chart.id, newjson)
                    break
            }

        })


        // var dropdown = document.getElementsByClassName("dropdown-btn");
        // var i;
        // keys = [];
        // for (var k in json) {
        //     if (k != "Values")
        //         keys.push(k)
        // }
    } catch (error) {
        console.log(error);
    }
    // });
}

function setting(id) {
    hide("myPopup", y)
    var cut = document.getElementById("cutoffvalue")
    cut.value = ""
    // document.getElementById("category").selectedIndex = 0
    // document.getElementById("parameter").selectedIndex = 0
    settingchartid = id.parentNode.parentNode.parentNode.querySelector('canvas').id
    // if (booleanvalue == false) {
    chartselection.forEach(function (chart) {
        var axes = [];
        var settingkeys = [];
        if (booleanvalue == false) {
            if (chart.id == settingchartid) {
                // console.log(maindata[chart.Xaxis][0])
                for (var k in maindata[chart.Xaxis][0]) {
                    settingkeys.push(k)
                }
                // console.log(settingkeys)
                settingkeys = settingkeys.filter(val => val !== "name");
                // console.log(axes)
                for (var k in maindata) {
                    axes.push(k)
                }
                for (i = 0; i < axes.length; i++) {
                    var option = document.createElement('option');
                    option.className = 'categoryaxes'
                    option.id = i
                    option.value = axes[i]
                    option.innerHTML = axes[i]
                    // option.innerHTML = '<option id="' + i + '" value="'+axes[i]+'">' + axes[i] + '</option>'
                    document.getElementById("category").appendChild(option)
                }
                for (i = 0; i < settingkeys.length; i++) {
                    var option = document.createElement('option');
                    option.className = 'parameter'
                    option.id = i
                    option.value = settingkeys[i]
                    option.innerHTML = settingkeys[i]
                    // option.innerHTML = '<option id="' + i + '" value="'+settingkeys[i]+'">' + settingkeys[i] + '</option>'
                    document.getElementById("parameter").appendChild(option)
                }
                for (i = 0; i < settingkeys.length; i++) {
                    var option = document.createElement('option');
                    option.className = 'parameter2'
                    option.id = i
                    option.value = settingkeys[i]
                    option.innerHTML = settingkeys[i]
                    // option.innerHTML = '<option id="' + i + '" value="'+settingkeys[i]+'">' + settingkeys[i] + '</option>'
                    document.getElementById("parameter2").appendChild(option)
                }
                // console.log(settingkeys)
                const removeValFromIndex = new Array(0, 1, 4, 5);
                var sortsettingkeys = settingkeys.filter((value, i) => removeValFromIndex.includes(i))
                // console.log(sortsettingkeys)
                for (i = 0; i < settingkeys.length; i++) {
                    var option = document.createElement('option');
                    option.className = 'sortparameter'
                    option.id = i
                    option.value = settingkeys[i]
                    option.innerHTML = settingkeys[i]
                    // option.innerHTML = '<option id="' + i + '" value="'+settingkeys[i]+'">' + settingkeys[i] + '</option>'
                    document.getElementById("sortparameter").appendChild(option)
                }
            }
        }
        // console.log(chart.Chart)
        switch (chart.Chart) {
            case "Bar":
                if (chart.id == settingchartid) {
                    // hide("sortparameter", y)
                    hide("sortpara", y)
                    hide("divpara2", y)
                    hide("divsortpara", y)
                    hide("para2", y)
                    document.getElementById("flex1").style.height = "40%"
                    document.getElementById("flex2").style.height = "40%"
                    document.getElementById("flex3").style.height = "20%"
                    document.getElementById("category").value = chart.Xaxis;
                    document.getElementById("parameter").value = chart.Yaxis;
                }
                break
            case "Pie":
                if (chart.id == settingchartid) {
                    // hide("sortparameter", y)
                    hide("sortpara", y)
                    hide("divpara2", y)
                    hide("divsortpara", y)
                    hide("para2", y)
                    document.getElementById("flex1").style.height = "40%"
                    document.getElementById("flex2").style.height = "40%"
                    document.getElementById("flex3").style.height = "20%"
                    document.getElementById("category").value = chart.Xaxis;
                    document.getElementById("parameter").value = chart.Yaxis;
                }
                break
            case "Treemap":
                if (chart.id == settingchartid) {
                    // hide("sortparameter", y)
                    hide("sortpara", y)
                    hide("divpara2", y)
                    hide("divsortpara", y)
                    hide("para2", y)
                    document.getElementById("flex1").style.height = "40%"
                    document.getElementById("flex2").style.height = "40%"
                    document.getElementById("flex3").style.height = "20%"
                    document.getElementById("category").value = chart.Xaxis;
                    document.getElementById("parameter").value = chart.Yaxis;
                }
                break
            case "StackedBar":
                if (chart.id == settingchartid) {
                    // hide("sortparameter", "flex")
                    hide("sortpara", "flex")
                    hide("divpara2", "flex")
                    hide("divsortpara", "flex")
                    hide("para2", "flex")
                    document.getElementById("category").value = chart.Xaxis;
                    document.getElementById("parameter").value = chart.Maxis;
                    document.getElementById("sortparameter").value = chart.sort;
                    document.getElementById("parameter2").value = chart.Naxis;
                }
                break

        }
    })
    booleanvalue = true
    // }

}

function apply() {
    var categoryval = document.getElementById("category");
    var selectedcat = categoryval.value;
    // console.log(selectedcat)
    var parameterval = document.getElementById("parameter");
    var selectedpara = parameterval.value;
    // console.log(selectedpara)
    var sortparameter = document.getElementById("sortparameter");
    var selectedsort = sortparameter.value;
    var parameter2 = document.getElementById("parameter2");
    var selectedpara2 = parameter2.value;
    var cutoffvalue
    chartselection.forEach(function (chart) {
        var titlename = '#' + chart.id + 'title'
        var title = document.querySelector(titlename)
        switch (chart.Chart) {
            case "Bar":
                if (chart.id == settingchartid) {
                    chart.Xaxis = selectedcat
                    chart.Yaxis = selectedpara
                    cutoffvalue = document.getElementById("cutoffvalue").value
                    if (cutoffvalue == "") {
                        // var popup = document.getElementById("myPopup");
                        // popup.classList.toggle("show");
                        hide("myPopup", z)
                    } else {
                        hide("myPopup", y)
                        chart.value = cutoffvalue
                    }
                    // console.log(chart.value)
                    var bartempjson = maindata[chart.Xaxis].slice(0, chart.value)
                    bar(bartempjson, chart.Yaxis)
                    updatebar(chart.id, barxaxis, baryaxis)
                    title.innerHTML = chart.Xaxis + " vs " + chart.Yaxis
                }
                break
            case "Pie":
                if (chart.id == settingchartid) {
                    chart.Xaxis = selectedcat
                    chart.Yaxis = selectedpara
                    cutoffvalue = document.getElementById("cutoffvalue").value
                    if (cutoffvalue == "") {
                        // var popup = document.getElementById("myPopup");
                        // popup.classList.toggle("show");
                        hide("myPopup", z)
                    } else {
                        hide("myPopup", y)
                        chart.value = cutoffvalue
                    }
                    // console.log(chart.value)
                    var pietempjson = maindata[chart.Xaxis].slice(0, chart.value)
                    pie(pietempjson, chart.Yaxis)
                    updatepie(chart.id, piexaxis, pieyaxis)
                    title.innerHTML = chart.Xaxis + " vs " + chart.Yaxis
                }
                break
            case "Treemap":
                if (chart.id == settingchartid) {
                    chart.Xaxis = selectedcat
                    chart.Yaxis = selectedpara
                    cutoffvalue = document.getElementById("cutoffvalue").value
                    if (cutoffvalue == "") {
                        hide("myPopup", z)
                    } else {
                        hide("myPopup", y)
                        chart.value = cutoffvalue
                    }
                    var treemaptempjson = maindata[chart.Xaxis].slice(0, chart.value)
                    treemapnew(treemaptempjson, chart.Yaxis)
                    updatetree(chart.id)
                    title.innerHTML = chart.Xaxis + " vs " + chart.Yaxis
                }
                break
            case "StackedBar":
                if (chart.id == settingchartid) {
                    chart.Xaxis = selectedcat
                    chart.Maxis = selectedpara
                    chart.Naxis = selectedpara2
                    chart.sort = selectedsort
                    cutoffvalue = document.getElementById("cutoffvalue").value
                    if (cutoffvalue == "") {
                        hide("myPopup", z)
                    } else {
                        hide("myPopup", y)
                        chart.value = cutoffvalue
                    }
                    var stackedbartempjson = maindata[chart.Xaxis].slice(0, chart.value)
                    stackbar(stackedbartempjson, chart.Maxis, chart.Naxis, chart.sort)
                    updatestackbar(chart.id, newjson)
                    title.innerHTML = chart.Xaxis + " vs " + chart.Maxis
                }
                break
        }
    })
    if (cutoffvalue !== "") {
        hide("settingmodal", y)
    }
    else {
        hide("settingmodal", z)
    }
}
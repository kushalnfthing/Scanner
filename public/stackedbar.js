var title = "CHART5"
var idstack = "chartstackbar"

//chartname(idstack, title) 
//console.log(stylesteps(stackcolor1, stackcolor1, len))

function createstackedbar(stackedBar, Xaxisonsb) {
    stackedBar = new Chart(stackedBar, {
        type: 'bar',
        data: {
            labels: labelsv1,
            datasets: newjson,
            //backgroundColor: stylesteps(stackcolor1, stackcolor1, len), 
            barPercentage: 2.5,
            categoryPercentage: 0.25,
            // barThickness:15, 
            //maxBarthickness: 10
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            onClick: event => {
                const datasetIndex = stackedBar.getElementAtEvent(event)[0]._datasetIndex;
                // console.log(stackedBar.getElementAtEvent(event)[0]._chart.canvas.id)
                // console.log(stackedBar.getElementAtEvent(event)[0]._datasetIndex) 
                const model = stackedBar.getElementsAtEvent(event)[datasetIndex]._model;
                //console.log(model) 
                const color1 = stackedBar.getElementsAtEvent(event)[datasetIndex]._model.backgroundColor;
                //console.log(color1)
                var result = color1.substring(color1.indexOf('(') + 1, color1.indexOf(')'));
                result = result.split(',')
                result = 'rgba(' + result[0] + ', ' + result[1] + ', ' + result[2] + ', ' + 1 + ')'
                //console.log(result) 
                var dataset = stackedBar.data.datasets;
                //dataset.forEach(element => {
                //console.log(element.backgroundcolor) 
                for (var i = 0; i < dataset.length; i++) {
                    //console.log(dataset[i] backgroundColor) 
                    var temp = dataset[i].backgroundColor
                    //console.log(temp)
                    temp = temp.substring(temp.indexOf('(') + 1, temp.indexOf(')'));
                    temp = temp.split(',')
                    temp = 'rgba(' + temp[0] + ', ' + temp[1] + ', ' + temp[2] + ', ' + 0.1 + ')'
                    dataset[i].backgroundColor = temp
                }
                stackedBar.update();
                //});
                //var element = stackedBar.getElementAtEvent(event)[0]._model.backgroundColor; 
                var element1 = stackedBar.getElementAtEvent(event)[0]._index;
                //console.log(stackedBar.getDatasetMeta(1)) 
                // console.log(stackedBar.getDataset Meta(0).data[element1])
                // console.log(newjson)
                // console.log(dataset.length)
                for (var i = 0; i < dataset.length; i++) {
                    stackedBar.getDatasetMeta(i).data[element1]._model.backgroundColor = stackcolors[i + 1]
                }
                sbname = model.label

                var xaxis
                chartselection.forEach(function (chart) {
                    var setid = stackedBar.getElementAtEvent(event)[0]._chart.canvas.id
                    if (chart.Chart == "StackedBar") {
                        if (chart.id == setid) {
                            xaxis = chart.Xaxis
                            // console.log(xaxis)
                        }
                    }
                })
                onclickfilter = JSON.parse(JSON.stringify(filter));
                onclickfiltered(xaxis, sbname)
                // console.log(onclickfilter)
                var xvalues = onclickfilter
                filterxaxis(xvalues, stackedBar, function (json) {
                    updatecharts(json, stackedBar.canvas.id)
                });
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    ticks: {
                        callback: function (value) {
                            // console.log(value)
                            // if (value.includes('Windows')) {
                            //     return '..' + value.substr(-14)
                            // }
                            // else {
                            return xticks(value, 6)
                            // }
                        }
                    }
                }],
                yAxes: [{
                    stacked: true,
                    // ticks: {
                    //     userCallback: function (item, index) {
                    //         return yticks(item, index)
                    //     }
                    // }
                }]
            }
        }
    });
    return stackedBar
}

function stackbar(json, xaxis, yaxis, sortelement) {
    // console.log(xaxis)
    // console.log(json)
    json.sort(sortByProperty(sortelement))
    // console.log(json)
    var keys = []
    var newjsondata = []
    newjson = []
    for (var k in json[0]) {
        // if (k!="Error"){
        keys.push(k);
        // }
    }
    // console.log(keys)
    keys = ["name", xaxis, yaxis]
    // console.log(keys)
    var i = 0
    keys.forEach((kus) => {
        // console.log(kus)
        newjsondata = {
            label: kus,
            data: [],
            backgroundColor: stackcolors[i],
            barThickness: 20,
            maxBarThickness: 20
        }
        json.forEach((item) => {
            newjsondata.data.push(item[kus])
        });
        // console.log(newjsondata)
        newjson.push(newjsondata)
        i++;
    });
    // console.log(newjson)
    labelsv1 = newjson[0].data
    // console.log(labelsv1)
    newjson.shift();

}

function updatestackbar(stackedBar, newjson) {
    // console.log(labelsv1)
    var node = document.getElementById(stackedBar)
    var chartcon = node.parentNode
    // console.log(chartcon) 
    var ratio = labelsv1.length * 45
    // console.log(ratio) 
    // console.log(oriwidth)
    if (ratio < oriwidth) {
        ratio = oriwidth
    }

    chartcon.style.width = ratio + 'px'
    // console.log(window)
    // console.log(window[stackedBar])
    window[stackedBar].resize()
    chartcon.style.width = null
    //console.log(newjson)

    for (var i = 0; i < newjson.length; i++) {
        newjson[i].backgroundColor = stackcolors[i + 1]
    }

    // console.log(stackedBar)
    window[stackedBar].data.datasets = newjson;
    window[stackedBar].data.labels = labelsv1;
    window[stackedBar].update();

}
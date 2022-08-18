var barcolor1 = "#50cdf7"
var barcolor2 = "#1ff4bf"
var Xaxisonbar
var titlebar = "CHART1"
var idyear = "chartbar1"

// chartname(idyear,title)
function createbar(chartbar, Xaxisonbar) {
    chartbar = new Chart(chartbar, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: "",
                data: [],
                backgroundColor: [stylesteps(barcolor1, barcolor2, [].length)],
                // barPercentage: 2.5,
                // categoryPercentage: 0.25,
                barThickness: 20,
                maxBarThickness: 10
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: event => {
                const clickedElementIndex = chartbar.getElementAtEvent(event)[0]._index;
                const label = chartbar.data.labels[clickedElementIndex];
                // console.log(label)
                barname = label;
                const value = chartbar.data.datasets[0].data[clickedElementIndex];
                const color1 = chartbar.getElementsAtEvent(event)[0]._model.backgroundColor;
                var result = color1.substring(color1.indexOf('(') + 1, color1.indexOf(')'));
                result = result.split(',')
                result = 'rgba(' + result[0] + ', ' + result[1] + ', ' + result[2] + ', ' + 1 + ')'
                var dataset = chartbar.data.datasets[0];
                for (var i = 0; i < dataset.data.length; i++) {
                    var temp = dataset.backgroundColor[i]
                    temp = temp.substring(temp.indexOf('(') + 1, temp.indexOf(')'));
                    temp = temp.split(',')
                    temp = 'rgba(' + temp[0] + ', ' + temp[1] + ', ' + temp[2] + ', ' + 0.1 + ')'
                    dataset.backgroundColor[i] = temp
                    chartbar.update();
                }
                var element = chartbar.getElementAtEvent(event)[0]._index;
                dataset.backgroundColor[element] = result
                chartbar.update();
                // console.log(filter)
                var xaxis
                chartselection.forEach(function (chart) {
                    if (chart.Chart == "Bar") {
                        xaxis = chart.Xaxis
                    }
                })
                onclickfilter = JSON.parse(JSON.stringify(filter));
                onclickfiltered(Xaxisonbar, barname)
                // console.log(onclickfilter) 
                var xvalues = onclickfilter
                filterxaxis(xvalues, chartbar, function (json) {
                    updatecharts(json, chartbar.canvas.id)
                });
            },
            legend: {
                display: false,
                position: 'right',
                boxWidth: 40
            },
            scales: {
                xAxes: [{
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
                    // stacked: true,
                    // ticks: {
                    //     userCallback: function (item, index) {
                    //         return yticks(item, index)
                    //     }
                    // }
                }]
            }
        }
    });
    return chartbar
}

function bar(data, y) {
    console.log(data)
    barxaxis = []
    baryaxis = []
    data.forEach(function (item) {
        // console.log(item)
        barxaxis.push(item.name);
        baryaxis.push(item[y])
    }
    )
    //return {"X":xaxis, "Y":yaxis}
}
function updatebar(chartbar, xaxis, yaxis) {
    window[chartbar].data.datasets[0].data = [...yaxis];
    window[chartbar].data.labels = [...xaxis];
    window[chartbar].data.datasets[0].backgroundColor = stylesteps(barcolor1, barcolor2, [...xaxis].length)
    window[chartbar].update();
}
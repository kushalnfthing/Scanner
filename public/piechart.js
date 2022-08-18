var piecolor1 = "#f980d9";
var piecolor = "#0bd5a3";
var Xaxisonpie
var titlepie = "CHART2";
var idpie = "chartpie";

//chartname (idpie, titlepie)

function createpie(chartpie, Xaxisonpie) {
    // console.log(chartpie)
    chartpie = new Chart(chartpie,

        {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    label: 'No. of flights delayed',
                    data: [],
                    backgroundColor: [stylesteps(piecolor1, piecolor, [].length)],
                    //backgroundcolor: [], 
                }],
            },
            options: {
                cutoutPercentage: 70,
                responsive: true,
                maintainAspectRatio: false,
                onClick: event => {
                    // console.log(chartpie)
                    const clickedElementIndex = chartpie.getElementAtEvent(event)[0]._index;
                    const label = chartpie.data.labels[clickedElementIndex];
                    piename = label;
                    const value = chartpie.data.datasets[0].data[clickedElementIndex];
                    const color1 = chartpie.getElementsAtEvent(event)[0]._model.backgroundColor;
                    var result = color1.substring(color1.indexOf('(') + 1, color1.indexOf(')'));
                    result = result.split(',')
                    result = 'rgba(' + result[0] + ', ' + result[1] + ', ' + result[2] + ', ' + 1 + ')'
                    var dataset = chartpie.data.datasets[0];
                    for (var i = 0; i < dataset.data.length; i++) {
                        var temp = dataset.backgroundColor[i]
                        temp = temp.substring(temp.indexOf('(') + 1, temp.indexOf(')'));
                        temp = temp.split(',')
                        temp = 'rgba(' + temp[0] + ', ' + temp[1] + ', ' + temp[2] + ', ' + 0.1 + ')'
                        dataset.backgroundColor[i] = temp
                        chartpie.update();
                    }
                    var element = chartpie.getElementAtEvent(event)[0]._index;
                    dataset.backgroundColor[element] = result
                    chartpie.update();
                    // console.log(filter)
                    var xaxis
                    chartselection.forEach(function (chart) {
                        if (chart.Chart == "Pie") {
                            xaxis = chart.Xaxis
                        }
                    })
                    // console.log(chartpie.options.scales.xAxes)
                    // var y=chartpie.options.scales.xAxes
                    // y=Xaxisonpie
                    // console.log(y)
                    onclickfilter = JSON.parse(JSON.stringify(filter));
                    onclickfiltered(xaxis, piename)
                    // console.log(onclickfilter) 
                    var xvalues = onclickfilter
                    filterxaxis(xvalues, chartpie, function (json) {
                        updatecharts(json, chartpie.canvas.id)
                    });
                },
                //plugins:{
                legend: {
                    display: false,
                    position: 'right',
                    boxWidth: 40
                },
                //},
                /*  labels:{
                        boxWidth: 12
                    }, */
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            display: false
                        },
                        gridlines: {
                            display: false
                        }
                    }],
                    xAxes: []
                }
            }
        });
    return chartpie

}

function pie(data, y) {
    piexaxis = []
    pieyaxis = []
    data.sort(sortByProperty(y))
    // console.log(data)
    data.forEach(function (item) {
        // console.log(item)
        piexaxis.push(item.name);
        pieyaxis.push(item[y])

    }
    )
    //return {"X":xaxis, "Y":yaxis}
}

function updatepie(chartpie, xaxis, yaxis) {
    window[chartpie].data.datasets[0].data = [...yaxis];
    window[chartpie].data.labels = [...xaxis];
    window[chartpie].data.datasets[0].backgroundColor = stylesteps(piecolor1, piecolor, [...xaxis].length)
    window[chartpie].update();
}
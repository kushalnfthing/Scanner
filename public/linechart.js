var linecolor1 = "#50cdf7"
var linecolor2 = "#1ff4bf"
var Xaxisonbar

function createline(chartline) {
    chartline = new Chart(chartline, {
        type: 'line',
        data: {
            labels: ["January", "Febrary", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: 'Dataset 1',
                    lineTension: 0,     
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgb(54, 162, 235)',
                    yAxisID: 'y',
                },
                {
                    label: 'Dataset 2',
                    lineTension: 0,     
                    data: [10, 20, 90, 40, 30, 70, 68, 100],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgb(75, 192, 192)',
                    yAxisID: 'y',
                }],
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            maintainAspectRatio: false,
            stacked: false,
            scales: {
                yAxes: [{
                    id: 'y',
                    type: 'linear',
                    display: true,
                    position: 'left',
                }, {
                    id: 'y1',
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        display: false,
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                }]
            }
        }
    });
    return chartline
}

function line(json, xaxis, yaxis) {
    // console.log(xaxis)
    // console.log(json)
    // json.sort(sortByProperty(sortelement))
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
    keys.forEach((elem) => {
        // console.log(kus)
        newjsondata = {
            label: elem,
            data: [],
            lineTension: 0,   
            fill: false,
            borderColor: stackcolors[i],
            backgroundColor: stackcolors[i],
        }
        json.forEach((item) => {
            newjsondata.data.push(item[elem])
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

// function line(data, y) {
//     // console.log(data)
//     lineyaxis = []
//     liney1axis = []
//     data.forEach(function (item) {
//         // console.log(item)
//         lineyaxis.push(item.name);
//         liney1axis.push(item[y])
//     }
//     )
//     //return {"X":xaxis, "Y":yaxis}
// }

function updateline(chartline, newjson) {
    for (var i = 0; i < newjson.length; i++) {
        newjson[i].backgroundColor = stackcolors[i + 1]
    }
    window[chartline].data.datasets[0].data = newjson;
    window[chartline].data.labels = labelsv1;
    window[chartline].update();
}
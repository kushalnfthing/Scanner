var treecolo1="#50cdf7"; 
var treecolor2="#1ff4bf"; 
var titletree="CHART3"; 
var idtree="charttree" 
//chartname(idtree, titletree)

//createpie(treechart)

function createtree(charttree,Xaxisontree){ 
charttree = new Chart(charttree, {
    type: 'treemap', 
    data: { 
        datasets: [{
            label: 'No. of flights cancelled', 
            tree: truncatedtreemap, 
            backgroundColor: stylesteps(treecolo1, treecolor2, len), 
            rtl: false, // control in which direction the squares are positioned 
            key: ['can'], 
            groups: ['name'], 
            spacing: 0.5, 
            borderWidth: 1.5, 
            fontColor: "black", 
            borderColor: "grey", 
            borderRadius: 20,
        }]
    },
    options: {
        responsive: true, 
        maintainAspectRatio: false, 
        onClick: event => {
            var ind = charttree.getElementAtEvent(event)[0]._index 
            var dataset = charttree.config.data.datasets[0].data;
            // console.log(dataset) 
            var dataItem = dataset[ind]; 
            //console.log(dataItem._data.children[0].ref)
            treename = dataItem._data.children[0].ref; 
            //treename = treemap[ind].name; 
            const color1 = charttree.getElementsAtEvent(event)[0]._model.backgroundColor; 
            var result = color1.substring(color1.indexOf('(') + 1, color1.indexOf(')')); 
            result = result.split(',') 
            result = 'rgba(' + result[0] + ', ' + result[1] + ','+ result[2] + ', ' + 1 + ')'
            var dataset = charttree.data.datasets[0]; 
            for (var i =0; i < dataset.data.length; i++) {
                var temp = dataset.backgroundColor[i] 
                // console.log(temp)
                temp = temp.substring(temp.indexOf('(') + 1, temp.indexOf(')')); 
                temp = temp.split(',') 
                temp = 'rgba(' + temp[0] + ', ' + temp[1] + ', ' + temp[2] + ', ' + 0.1 + ')'
                dataset.backgroundColor[i] = temp 
                //console.log("new")
            }
            var element = ind; 
            dataset.backgroundColor[element] = result 
            charttree.update(); 
            var xvalues ={'Filobj':Xaxisontree, 'filvalue': treename}

            var xaxis
            chartselection.forEach(function (chart) {
                if(chart.Chart=="Treemap"){
                    xaxis=chart.Xaxis
                    // console.log(xaxis)
                }
            })
            onclickfilter = JSON.parse(JSON.stringify(filter));
            onclickfiltered (xaxis, treename)
            // console.log(onclickfilter) 
            var xvalues=onclickfilter; 
            filterxaxis(xvalues, charttree, function(json) {
                updatecharts(json, charttree.canvas.id) 
            }); 
        }, 
        legend: {
            display: false,
        },
        tooltips: {
            callbacks: {
                title: function() {}, 
                label: function(item, data) {
                    var dataset = data.datasets[item.datasetIndex]; 
                    //console.log(dataset) 
                    var dataItem = dataset.data[item. index]; 
                    //console.log(dataItem)
                    var obj = dataItem._data.children[0].ref; 
                    var obj1 = dataItem._data.can; 
                    // reftree - charttree.data.datasets[0].tree 
                    //console.log(reftree[ind].name) 
                    return obj + ":" + obj1; 
                    //return treemap[ind].name + ":" + treemap[ind].can;
                }
            }
        }
    }
});
return charttree
}


    function sortByProperty(property) { 
        return function (a, b) { 
            if (a[property] < b[property])
                return 1; 
            else if (a[property] > b[property])
                return -1; 
            return 0;
        }
    }

    function treemapnew(data,y){
        // console.log(data)
        treemap=[], truncatedtreemap=[] 
        var i=0 
        data.forEach(function(tree){ 
            console.log(tree)
            str=tree.name; 
            // console.log(str)
            UniqueNamelength=str.length; 
            space=4; 
            UniqueNamepadding=str.padStart(UniqueNamelength + space,' ');
            obj = { name: tree.name, can: tree[y] } 
            treemap.push(obj); 
            truncatedobj = { name: xticks (UniqueNamepadding,8), ref:tree.name, can: tree[y] } 
            repeatedname=truncatedtreemap.filter(rep=>rep.name==truncatedobj.name) 
            if(repeatedname.length!=0){
                truncatedobj.name=truncatedobj.name+i
                repeatedname = []
            }
            truncatedtreemap.push(truncatedobj);
            i++ 
        }); 
        // console.log(treemap) 
        // console.log(truncatedtreemap)
    }


    function updatetree(charttree){
        window[charttree].data.datasets[0].tree = truncatedtreemap; 
        window[charttree].data.datasets[0].backgroundColor=stylesteps(treecolo1, treecolor2,
            truncatedtreemap.length); 
        window[charttree].update();
    }

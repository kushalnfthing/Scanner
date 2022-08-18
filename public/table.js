function createtable(onclickfilter) {

    var fil = onclickfilter
    //
    console.log(fil);

    var fil =JSON.stringify (onclickfilter) 
    //console.log(filter)

    var table = new Tabulator("#Table", {
        pagination: "remote",
        ajaxURL:"/table?filter="+fil+"",
        paginationSize:20, 
        paginationDataSent:{
            "page":"pageNo", 
            "size":"sizeNo"
        },
        columns: [ 
            {title: "Feature", field: "FeatureName"}, 
            {title: "NX", field: "NX Version"},
            {title: "Department", field: "Department"}, 
            {title: "Business Unit", field: "Business Unit"},
            // {title:"Windows", field: "Windows Version"}, 
            {title: "Creation", field: "Creation"},
            {title: "Error", field: "Error"}, 
            {title: "Error Message", field: "Error Message"}
        ],
    });

}

function tablefil(id){

    var value=id.value; 
    var febtn = document.querySelectorAll('.febtn')
    var febtn = document.querySelectorAll('.febtn') 
    var fil  = JSON.stringify (onclickfilter)

    try{ 
        fil -JSON.parse(fil) 
    }catch(error) {
        console.log(error) 
        fil=[]
    }
    //onclickfilter=onclickfilter,


    febtn.forEach(function(btn) {
        //console.log(btn) 
        btn.style.backgroundColor ="#F2F2F2" 
        btn.style.color="black"
    })

    console.log(id.value) 
    switch(id.value){
        case "count":
            
        id.style.color="white" 
        id.style.backgroundColor - "blue" 
        var newval = {"Error": [0]}
        fil.push(newval)

        break

        case "Error":
        case "Normal Error":
        case "Critical Error":
        
        var newval ={"ErrroType":[value]}
        fil.push(newval)
        id.style.color="white"
        id.style.backgroundColor = "red"
        break
    }

    console.log(onclickfilter)

    createtable(fil)

}
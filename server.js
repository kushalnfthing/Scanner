'use strict';
const express = require('express');

var bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('./public'))

// app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.urlencoded({ extended: false }))

const https = require('https');

const fs = require('fs');

const csv = require('csvtojson');

const { resolve } = require('path');

const axios = require('axios').default;

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

const client = new MongoClient(url);

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var arr
//     var dbo = db.db("Contract_NFTs_10");
//     dbo.collection("NFT_Details").find({}).toArray(function (err, result) {
//         if (err) throw err;
//         // console.log(result);
//         dbgetdata(result)
//         // let counter = 0
//         // result.forEach(function (elem) {
//         //     // console.log(elem.contract.type)
//         //     elem.contract.type = ++counter
//         //     var animationurl = elem.nft.animation_url
//         //     // console.log(url)
//         //     if (animationurl != null) {
//         //         const urlextension = fileurl.split('.').pop();
//         //         console.log(urlextension)
//         //     }
//         //     else {
//         //     }
//         // })
//         // console.log(counter)
//         db.close();
//     });
// });



// const cookieParser = require("cookie-parser");

// app.use(cookieParser());

// app.post('/file', (req, res, next) => {
// console.log(req.body)
// var filedata = req.body
// var string = encodeURIComponent(filedata);
// res.redirect('http://localhost:3000/chart.html?data=' + filedata);
// res.cookie("name", filedata, { httpOnly: true });
// res.redirect("http://localhost:3000/chart.html");
// https.createServer(function(req, res) {
//     res.writeHead({Location: 'http://localhost:3000/chart.html'});
//     res.end();
//   })
// });

// app.post("/contract", (req, res) => {
//     console.log(req.body)
// console.log(req.cookies["name"])
// const context = req.cookies["name"];
// res.clearCookie("name", { httpOnly: true });
// res.send({"name":req.body});
// });


// csvtojson()

var jsondata
async function csvtojson() {
    jsondata = await csv({ flatKeys: true }).fromFile('./public/nftcontract.csv');
    // console.log(jsondata)
    // var path = './public/nftcontractdata.json'
    // var data = fs.writeFileSync(path, JSON.stringify(jsondata))
}

// var rawdata = fs.readFileSync('./public/nftcontractdata.json');
// var newdata = JSON.parse(rawdata);
// console.log(newdata)
// var filteredcontractarray = jsondata.filter(element => {
//     return element['Contract Address'] != "" && element.Brand != "";
// });
//  console.log(filteredcontractarray)

var options = {
    "method": "GET",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "068da24a-741f-49da-bc13-477f53da2b61",
    }
}

function test(element, resolve, users) {
    https.get('https://api.nftport.xyz/v0/transactions/stats/' + element["Contract Address"] + '?chain=ethereum', options, res => {
        res.on('data', elem => {
            resolve();
            const obj = JSON.parse(elem)
            // console.log(obj)
            const newobj = obj.statistics
            newobj.name = element.Brand
            users.push(newobj)
            // console.log(users)
            // users.push(elem.toString());
            // var path = './public/filterdata.json'
            // var data = fs.writeFileSync(path, JSON.stringify(users))
        });
    }).on('error', err => {
        console.log('Error: ', err.message);
    });
    //  console.log(users)
    // result.send(users)
}

async function getdata(array, result) {
    var users = []
    for (var i in array) {
        var data = array[i]
        // console.log(data["Contract Address"])
        // console.log("time")
        let promise = await new Promise(function (resolve, reject) {
            // the function is executed automatically when the promise is constructed
            // after 1 second signal that the job is done with the result "done"
            setTimeout(() => test(data, resolve, users), 1000);
        });
    }
    result.send(users)
}
// getdata(filteredcontractarray)

app.post('/file', (req, res, next) => {
    // console.log(req.body)
    var dataarray = req.body
    getdata(dataarray, res)
});

app.post('/filterdatajson', (req, res) => {
    // var rawdata = fs.readFileSync('./public/filterdata.json');
    // var newdata = JSON.parse(rawdata);
    // console.log(req.body.mainjson)
    var updated = req.body.mainjson.name;
    var filterdata = req.body.filteredvalue
    // console.log(filterdata)
    filterdata.forEach(function (key) {
        var filtercriteria = Object.keys(key)[0]
        // console.log(filtercriteria)
        var filtervalue = key[filtercriteria]
        // console.log(filtervalue)
        updated = updated.filter(st => filtervalue.includes(st[filtercriteria]));
        // console.log(updated)
    })
    res.send({ "name": updated })
});

// app.get('/contract', (req, res, next) => {
//     res.send({ "name": users })
// });

// var add_, tx, token_details;

//Get token Transaction details
async function getTransactions(address, nfts, i) {
    var id = nfts[i].token_id

    var link = "https://api.nftport.xyz/v0/transactions/nfts/" + address + "/" + id

    const options = {
        method: 'GET',
        url: link,
        params: {
            chain: 'ethereum',
            type: 'all'
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: '068da24a-741f-49da-bc13-477f53da2b61'
        }
    };

    await axios.request(options).then(function (response) {
        tx = response.data;

    }).catch(function (error) {
        // console.error(error);
    });
}

//Get details of particular token of the contract
async function getTokenDetails(address, nfts, i) {
    var id = nfts[i].token_id
    var link = "https://api.nftport.xyz/v0/nfts/" + address + "/" + id

    const options = {
        method: 'GET',
        url: link,
        params: {
            chain: 'ethereum',
            include: 'all',
            refresh_metadata: 'true'
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: '068da24a-741f-49da-bc13-477f53da2b61'
        }
    };
    await axios.request(options).then(function (response) {
        token_details = response.data;

    }).catch(function (error) {
        // console.error(error);
    });
}

async function getEachNFTDetails(address, contractDetails, array, resolve) {
    var data = JSON.parse(contractDetails);
    var nfts = data.nfts;
    for (var i = 0; i < nfts.length; i++) {
        add_ = address + "/" + nfts[i].token_id
        await getTokenDetails(address, nfts, i);
        await getTransactions(address, nfts, i);
        var newData = { "contractAddress/token_id": add_, "token_details": token_details, "transaction": tx };
        // console.log(newData)
        array.push(newData)
        console.log(array.length)
        async function run() {
            try {
                await client.connect();
                const database = client.db('NFT_Contract' + "_" + address);
                const nftsDetails = database.collection('Details_of_Token');
                // insert the response.data into given db collection
                const query = newData
                const nft = await nftsDetails.insertOne(query);
                // console.log(nft);
            } finally {
                // Ensures that the client will close when you finish/error
                await client.close();
            }
        }
        run().catch(console.dir);

    }
    resolve("I am done");
}

//Get the contract details 
async function getContractDetails(address, array, resolve) {
    const options = {
        method: 'GET',
        url: 'https://api.nftport.xyz/v0/nfts/' + address,
        params: {
            chain: 'ethereum',
            include: 'all',
            refresh_metadata: 'true'
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: '068da24a-741f-49da-bc13-477f53da2b61'
        }
    };
    await axios.request(options).then(response => {
        // console.log(response)
        var data = JSON.stringify(response.data)
        getEachNFTDetails(address, data, array, resolve)
    }).catch(function (error) {
        console.error(error);
    });
}

// var address = new Array

// pass the array of contract address to "address" array
// address = ["0x2c3fc1d826bc12027d05fbe3aeace0a2453bf9fd", "0x57a204aa1042f6e66dd7730813f4024114d74f37"];

// const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

//Delay loop 200000 msec
async function loop(address, array, result) {
    for (const add of address) {
        console.log(add)
        let promise = await new Promise(function (resolve, reject) {
            setTimeout(() => getContractDetails(add, array, resolve), 200000);
            // getContractDetails(add, array, resolve)
        });
        // await getContractDetails(add, array);
        // await wait(200000);
        // console.log(array)
    }
    // console.log(array)
    dbgetdata(array, result)
}
// var array = []
// loop(address, array)
app.post('/nftdetails', (req, res) => {
    // console.log(req.body)
    var detail = req.body
    var address = []
    detail.forEach((e) => {
        // console.log(e["Contract Address"])
        address.push(e["Contract Address"])
    })
    address = address.slice(0, 1)
    // console.log(address)
    var array = []
    loop(address, array, res)
    // loop(array, res)
})

function dbgetdata(data, result) {
    // console.log(data)
    var type_array = [], formattype_array = [], transaction_array = [], transactions = [], transactiondate_array = []
    // var arr = [{
    //     fileurl: "https://storage.googleapis.com/grails-mint-pass/grails-2-mint-pass.png"
    // },
    // { fileurl: "https://storage.googleapis.com/grails-mint-pass/grails-2-mint-pass" },
    // { fileurl: "https://storage.googleapis.com/grails-mint-pass/grails-2-mint-pass" },
    // { fileurl: "https://storagegoogleapiscom/grails-mint-pass/grails-2-mint-passmp4" },
    // { fileurl: "https://storage.googleapis.com/grails-mint-pass/grails-2-mint-pass.png" },
    // { fileurl: "https://storage.googleapis.com/grails-mint-pass/grails-2-mint-pass.mp4" },
    // { fileurl: "https://storage.googleapis.com/grails-mint-pass/grails-2-mint-pass.png" },
    // { fileurl: "https://storage.googleapis.com/grails-mint-pass/grails-2-mint-pass.mp4" },
    // { fileurl: "https://storage.googleapis.com/grails-mint-pass/grails-2-mint-pass.mp4" }]
    data.forEach(function (e) {
        var type = "t" + e.contract
        var formattype = "f" + e.nft
        var typevalue = e.token_details.contract.type
        var animationurl = e.token_details.nft.animation_url
        var fileurl = e.token_details.nft.file_url
        var url_type = urlcategory(animationurl)
        // var file = e.fileurl
        // // console.log(file)
        // var url_type = urlcategory(file)

        function urlcategory(url) {
            var name
            var extension
            // console.log(url)
            try {
                extension = url.split(".").pop()
                // if (url != null) {
                switch (extension) {
                    case "png": return name = "image";
                        break;
                    case "mp4": return name = "video";
                        break;
                    default:
                        return name = "video"
                }
                // if (extension) {
                //     if (extension == "png") {
                //         return name = "image"
                //     } else if (extension == "mp4") {
                //         return name = "video"
                //     }
                //     else {
                //         return name = "video"
                //     }
                // }
                // else {
                //     return name = "video"
                // }
                // }
                // else {
                //     url = fileurl
                //     if (url != null) {
                //         if (extension) {
                //             // console.log("in")
                //             if (extension == "png") {
                //                 return name = "image"
                //             } else if (extension == "mp4") {
                //                 return name = "video"
                //             } else {
                //                 return name = "video"
                //             }
                //         }
                //         else {
                //             return name = "video"
                //         }
                //     } else {
                //         return name = "empty"
                //     }
                // }
            } catch {
                url = fileurl
                // console.log(url)
                // if (url != null) {
                switch (extension) {
                    case "png": return name = "image";
                        break;
                    case "mp4": return name = "video";
                        break;
                    default:
                        return name = "image"
                }
                // if (extension) {
                //     // console.log("in")
                //     if (extension == "png") {
                //         return name = "image"
                //     } else if (extension == "mp4") {
                //         return name = "video"
                //     } else {
                //         return name = "video"
                //     }
                // }
                // else {
                //     return name = "video"
                // }
            }
            // else {
            //     return name = "image"
            // }
        }

        function category(obj, value, array) {
            // console.log(obj)
            // console.log(obj[value])
            // console.log(obj[element])
            // !obj[element] ? (obj[element] = { "type": value, "count": 1 }, array.push(obj[element])) : obj[element].count++
            // !obj[value] ? (obj[value] = { "formattype": value, "formattype_count": 1 }, array.push(obj[value])) : obj[value].formattype_count++
            !obj[value] ? (obj[value] = { "name": value, "count": 0 }, array.push(obj[value]),
                obj[value] != null ? (obj[value], "name", "count") : (obj[value], "count")) :
                obj[value] != null ? (obj[value], "name", "count") : (obj[value], "count"), obj[value].count++
        }
        category(this, typevalue, type_array)
        category(this, url_type, formattype_array)
        // category(this, transaction_type, transaction_array)
    }, {})

    console.log(type_array)
    console.log(formattype_array)
    // console.log(transaction_array)
    // console.log(transactiondate_array)
    result.send({ type_array, formattype_array })
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
var add_, tx, token_details;
// var obj = new Array;

//Get token Transaction details
async function getTransaction(address, nfts, i) {
    var id = nfts[i].token_id

    var link = "https://api.nftport.xyz/v0/transactions/nfts/" + address + "/" + id

    const options = {
        method: 'GET',
        url: link,
        params: {
            chain: 'ethereum',
            type: 'all'
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: '74aa6344-267c-46ef-aaa5-c7cfbf0eaf5c'
        }
    };

    await axios.request(options).then(function (response) {
        tx = response.data;

    }).catch(function (error) {
        // console.error(error);
    });
}


//Get details of particular token of the contract
async function getTokenDetail(address, nfts, i) {
    var id = nfts[i].token_id
    var link = "https://api.nftport.xyz/v0/nfts/" + address + "/" + id

    const options = {
        method: 'GET',
        url: link,
        params: {
            chain: 'ethereum',
            include: 'all',
            refresh_metadata: 'true'
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: '74aa6344-267c-46ef-aaa5-c7cfbf0eaf5c'
        }
    };
    await axios.request(options).then(function (response) {
        token_details = response.data;

    }).catch(function (error) {
        // console.error(error);
    });
}


async function getEachNFTDetail(address, contractDetails,obj) {
    var data = JSON.parse(contractDetails);
    var nfts = data.nfts;
    for (var i = 0; i < nfts.length; i++) {
        add_ = address + "/" + nfts[i].token_id
        await getTokenDetail(address, nfts, i);
        await getTransaction(address, nfts, i);
        var newData = { "contractAddress/token_id": add_, "token_details": token_details, "transaction": tx };
        obj.push(newData);
        // console.log(newData)
        console.log(obj.length)

        async function run() {
            try {
                // await client.connect();
                // const database = client.db('NFT_Contract' + "_" + address);
                // const nftsDetails = database.collection('Details_of_Token');
                // // insert the response.data into given db collection
                // const query = newData
                // const nft = await nftsDetails.insertOne(query);
                // console.log(nft);
            } finally {
                // Ensures that the client will close when you finish/error
                // await client.close();
            }
        }
        run().catch(console.dir);

    }
}

//Get the contract details 
async function getContractDetail(address,obj) {
   // for (let i = 1; i <= 50; i++) {
        const options = {
            method: 'GET',
            url: 'https://api.nftport.xyz/v0/nfts/' + address,
            params: {
                chain: 'ethereum',
                include: 'all',
                refresh_metadata: 'true',
                page_number: 1
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'a2194375-f545-4197-a3b5-5b4cb1ba26e7'
            }
        };
        var totalres = await axios.request(options)
       var total =totalres.data.total
        console.log(total)
   // }
   // await wait(5000)
}


var address = new Array

//pass the array of contract address to "address" array
//address = ["0x0e220A4F3957C17a2e780922DBC13Cb2C9aa4274", "0x78d61C684A992b0289Bbfe58Aaa2659F667907f8"];
address = ["0x0e220A4F3957C17a2e780922DBC13Cb2C9aa4274"];

//Delay loop 200000 msec
const loops = async () => {
    var finalobj=[]
    for (const add of address) {
        console.log(add)
        await getContractDetail(add,finalobj);
        //await wait(30000);
    }
    console.log(finalobj.length)
}

loops()

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
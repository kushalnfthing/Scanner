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

// function subcategory(){

// }

function dbgetdata(data) {
    var typearray = [], url = []
    // console.log(data)
    data.forEach(function (e) {
        // console.log(e)
        var type = e.nft
        // console.log(type)
        var typevalue = e.contract.type
        // console.log(type)
        var animationurl = e.nft.animation_url
        var fileurl = e.nft.file_url
        // data = type
        function category(obj, element, value, s3) {
            // console.log(obj)
            !obj[element] ? (obj[element] = { "type": value, "count": 1 }, s3.push(obj[element])) : obj[element].count++
            // !obj[element] ? (obj[element] = { "type": obj[element], "count": 1}, s3.push(obj[element])) : obj[element].count++
            // !obj[element] ? (obj[element] = { uniquename: uniquename, "count": 1 }, s3.push(obj[element])) : obj[element].count++
            !obj[type] ? (obj[type] = { "type": value }, array.push(obj[type]),
            animationurl != '' ? subcategory(obj[type], animationurl) : subcategory(obj[type], fileurl)) :
            animationurl != '' ? subcategory(obj[type], animationurl) : subcategory(obj[type], fileurl)
        }
        category(this, type, typevalue, typearray)
    },{})
    console.log(typearray)
}

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
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

// async function getTokenDetails(address, nfts, i) {
//     // console.log(nfts[i].token_id)
//     var link = "https://api.nftport.xyz/v0/nfts/" + address + "/" + nfts[i].token_id
//     // console.log(link)
//     const options = {
//         method: 'GET',
//         url: link,
//         params: { chain: 'ethereum', include: 'all', refresh_metadata: 'true' },
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: '74aa6344-267c-46ef-aaa5-c7cfbf0eaf5c'
//         }
//     };
//     await axios.request(options).then(function (response) {
//         async function run() {
//             try {
//                 await client.connect();
//                 const database = client.db('Contract_NFTs_10');
//                 const nftsDetails = database.collection('NFT_Details');
//                 // insert the response.data into given db collection
//                 const query = response.data
//                 const nft = await nftsDetails.insertOne(query);
//                 // console.log(nft)
//             } finally {
//                 // Ensures that the client will close when you finish/error
//                 await client.close();
//             }
//         }
//         run().catch(console.dir);

//     }).catch(function (error) {
//         console.error(error);
//     });
// }


// //Calling the "getTokenDetails" according to the length of nfts.length
// async function getEachNFTDetails(address, data) {
//     var newData = JSON.parse(data);
//     var nfts = newData.nfts;
//     for (var i = 0; i < nfts.length; i++) {
//         await getTokenDetails(address, nfts, i)
//     }
// }

// function getDetails(_address) {
//     const options = {
//         method: 'GET',
//         url: 'https://api.nftport.xyz/v0/nfts/' + _address,
//         params: { chain: 'ethereum', include: 'all', refresh_metadata: 'true' },
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: '068da24a-741f-49da-bc13-477f53da2b61'
//         }
//     };
//     axios.request(options).then(function (response) {
//         var data = JSON.stringify(response.data);
//         // console.log(_address, data)
//         getEachNFTDetails(_address, data);

//     }).catch(function (error) {
//         console.error(error);
//     });
// }
// getDetails('0x2c3fc1d826bc12027d05fbe3aeace0a2453bf9fd')

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
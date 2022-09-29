'use strict';
const express = require('express');

var bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('./public'))

// app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.json());

app.use(express.urlencoded({ extended: false }))

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

const https = require('https');

const fs = require('fs');

const csv = require('csvtojson');

const { resolve } = require('path');

const axios = require('axios').default;

var XLSX = require('xlsx');

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

const client = new MongoClient(url);

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
    jsondata = await csv({ flatKeys: true }).fromFile('./public/NFTsResearch.csv');
    // console.log(jsondata)
    // var path = './public/NFTsResearchdata.json'
    // var data = fs.writeFileSync(path, JSON.stringify(jsondata))
}

// var filteredcontractarray = newdata.filter(element => {
//     // return element['Contract Address'] != "" && element.Brand != "";
// });
// getStatisticalDetail(filteredcontractarray)

var maindata
app.post("/xlsxupload", (req, res) => {
    // var workbook = XLSX.readFile('./public/Book.xlsx');
    console.log(req.body)
    var workbook = req.body[0].workbook
    console.log(workbook)
    var sheet_name = req.body[1].sheetname
    console.log(sheet_name)
    // var sheet_name_list = workbook.SheetNames;
    // console.log(sheet_name_list)
    //maindata = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    try {
        maindata = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name]);
        // console.log(maindata);
        res.send({ "message": "Uploaded successfully" })
    } catch {
        res.send({ "message": "Failed to upload" })
    }
})

// var rawdata = fs.readFileSync('./public/NFTsResearchdata.json');
// var newdata = JSON.parse(rawdata);
// console.log(newdata)

app.post('/category', (req, res) => {
    // console.log(maindata)
    var category_array = [], chain = "Ethereum"
    maindata.forEach((element) => {
        if (element['Contract Address'] != '') {
            if (element.Blockchain == chain) {
                var json = { "Contract Address": element['Contract Address'], "Brand": element.Brand, "Blockchain": element.Blockchain, "Sector": element.Sector }
                category_array.push(json)
            }
            else {
                console.log("error")
            }
        }
    })
    // console.log(category_array)
    res.send(category_array)
})

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

var options = {
    "method": "GET",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "068da24a-741f-49da-bc13-477f53da2b61",
    }
}

function getStatisticalData(element, resolve, users) {
    https.get('https://api.nftport.xyz/v0/transactions/stats/' + element["Contract Address"] + '?chain=ethereum', options, res => {
        res.on('data', elem => {
            try {
                resolve();
                const obj = JSON.parse(elem)
                // console.log(obj.statistics)
                const newobj = obj.statistics
                newobj.name = element.Brand
                users.push(newobj)
                // console.log(users)
                // users.push(elem.toString());
                // var path = './public/filterdata.json'
                // var data = fs.writeFileSync(path, JSON.stringify(users))
            } catch {
                console.log("error")
            }

        });
    }).on('error', err => {
        console.log('Error: ', err.message);
    });
}

async function getStatisticalDetail(array, result) {
    var users = []
    for (var i in array) {
        var data = array[i]
        // console.log(data["Contract Address"])
        // console.log("time")
        let promise = await new Promise(function (resolve, reject) {
            // the function is executed automatically when the promise is constructed
            // after 1 second signal that the job is done with the result "done"
            setTimeout(() => getStatisticalData(data, resolve, users), 300);
        });
    }
    console.log(users)
    result.send(users)
}

app.post('/statisticaldata', (req, res, next) => {
    console.log(req.body)
    var dataarray = req.body
    getStatisticalDetail(dataarray, res)
});

async function getViewData(element, result) {
    var users = []
    let promise = await new Promise(function (resolve, reject) {
        setTimeout(() => https.get('https://api.nftport.xyz/v0/transactions/stats/' + element["Contract Address"] + '?chain=ethereum', options, res => {
            res.on('data', elem => {
                resolve()
                const obj = JSON.parse(elem)
                // console.log(obj)
                const newobj = obj.statistics
                newobj.name = element.Brand
                newobj.image = element.logo
                users.push(newobj)
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        }), 1000);
    });
    console.log(users)
    result.send(users)
}

app.post('/view', (req, res, next) => {
    console.log(req.body)
    var viewdata = req.body
    getViewData(viewdata, res)
});

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
    var token_details, tx
    for (var i = 0; i < nfts.length; i++) {
        var add_ = address + "/" + nfts[i].token_id
        await getTokenDetails(address, nfts, i, token_details);
        await getTransactions(address, nfts, i, tx);
        var newData = { "contractAddress/token_id": add_, "token_details": token_details, "transaction": tx };
        // console.log(newData)
        array.push(newData)
        // console.log(array.length)
        // async function run() {
        //     try {
        //         await client.connect();
        //         const database = client.db('NFT_Contract' + "_" + address);
        //         const nftsDetails = database.collection('Details_of_Token');
        //         // insert the response.data into given db collection
        //         const query = newData
        //         const nft = await nftsDetails.insertOne(query);
        //         // console.log(nft);
        //     } finally {
        //         // Ensures that the client will close when you finish/error
        //         await client.close();
        //     }
        // }
        // run().catch(console.dir);

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

//Delay loop 200000 msec
async function loop(address, array, result) {
    for (const add of address) {
        console.log(add)
        let promise = await new Promise(function (resolve, reject) {
            setTimeout(() => getContractDetails(add, array, resolve), 2000);
            // getContractDetails(add, array, resolve)
        });
        // await getContractDetails(add, array);
        // await wait(200000);
        // console.log(array)
    }
    // console.log(array)
    getContractTypeandUrl(array, result)
}

app.post('/nftdetails', (req, res) => {
    // console.log(req.body)
    var detail = req.body
    var address = []
    detail.forEach((e) => {
        // console.log(e["Contract Address"])
        address.push(e["Contract Address"])
    })
    // address = address.slice(0, 1)
    // console.log(address)
    var array = []
    loop(address, array, res)
    // loop(array, res)
})

function getContractTypeandUrl(array) {
    // console.log(data)
    var type_array = [], formattype_array = []
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
    array.forEach(function (e) {
        var type = "t" + e.contract
        var formattype = "f" + e.nft
        var typevalue = e.contract.type
        var animationurl = e.nft.animation_url
        var fileurl = e.nft.file_url
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
    // result.send({ type_array, formattype_array })
}

var token_details
//Get details of particular token of the contract
async function getTokenDetail(address, nfts, i, token_array) {
    // console.log("token start",i)
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
            Authorization: 'a2194375-f545-4197-a3b5-5b4cb1ba26e7'
        }
    };
    var tokens = await axios.request(options).catch(function (error) {
        console.error(error);
    });
    token_details = tokens.data;
    token_array.push(token_details)
}

//Get the contract details 
async function getContractDetail(address, obj) {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
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
    var items = await axios.request(options).
        catch(function (error) {
            // console.error(error);
        });
    var total = items.data.total
    console.log(total)
    var nft_array = []
    for (var i = 1; i <= Math.ceil(total / 50); i++) {
        const options = {
            method: 'GET',
            url: 'https://api.nftport.xyz/v0/nfts/' + address,
            params: {
                chain: 'ethereum',
                include: 'all',
                refresh_metadata: 'true',
                page_number: i
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'a2194375-f545-4197-a3b5-5b4cb1ba26e7'
            }
        };
        var total_items = await axios.request(options).
            catch(function (error) {
                console.error(error);
            });
        nft_array.push(...total_items.data.nfts)
        // console.log(i)
        // await wait(300)
    }
    console.log(nft_array.length)
    var token_array = [], transaction_array = []
    for (let i = 0; i < nft_array.length; i++) {
        var add_ = address + "/" + nft_array[i].token_id
        await getTokenDetail(address, nft_array, i, token_array);
        // await getTransaction(address, nft_array, i, transaction_array);
        // var newData = { "contractAddress/token_id": add_, "token_details": token_details};
        obj.push(token_details)
    }
    console.log(token_array.length)
}

var address = new Array

//addresses with fewer nft items for quick compilation
// address = ["0x0e220A4F3957C17a2e780922DBC13Cb2C9aa4274","0x28472a58A490c5e09A238847F66A68a47cC76f0f","0x78d61C684A992b0289Bbfe58Aaa2659F667907f8","0xd71B53FE1Df51075c5a965956cdc87421C2fFeD7","0x2250D7c238392f4B575Bb26c672aFe45F0ADcb75"];

const ContractTypeandUrlloop = async () => {
    var final_array = []
    for (const add of address) {
        console.log(add)
        await getContractDetail(add, final_array);
    }
    // console.log(final_array)
    getContractTypeandUrl(final_array)
}

// ContractTypeandUrlloop()

var oldSearch_test_array = [
    {
        chain: 'ethereum',
        contract_address: '0x495f947276749ce646f68ac8c248420045cb7b5e',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/916b235b8ec87e100e28b0fa37194b95b43748a3efa242427fa38c140346b4db.png',
        name: 'Nike Air Max Day – March 26, 2021'
    },
    {
        chain: 'ethereum',
        contract_address: '0xf661d58cfe893993b11d53d11148c4650590c692',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/97f689bac762fe0d599fb1a63911d8f13d52792fc8952dba014daabb5788d7fb.png',
        name: 'RTFKT x Nike Dunk Genesis CRYPTOKICKS'
    },
    {
        chain: 'ethereum',
        contract_address: '0xa8ad67ad3084566762d1d5e65e539871803b0b03',
        cached_file_url: '',
        name: 'Nike SB Dunk Low Travis Scott'
    },
    {
        chain: 'ethereum',
        contract_address: '0xd07dc4262bcdbf85190c01c996b4c06a461d2430',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/c_0xd07dc4262bcdbf85190c01c996b4c06a461d2430_t_72336_raw_asset.gif',
        name: '[Nike] Have a Nike Day ! '
    },
    {
        chain: 'ethereum',
        contract_address: '0x67707f073a2c00d2533d7fa6bd79bbc3bb769974',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/f2f494a248e1febe1529777f1541422ee41d093e1c62d7df863ef80f550fba55.jpeg',
        name: 'Nike SB Low Doernbecher #1/5'
    },
    {
        chain: 'ethereum',
        contract_address: '0x3b3ee1931dc30c1957379fac9aba94d1c48a5405',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/055d0c2476238264adc3201c27556ff850e2fbf39f3149d09ec25706893e42ee.png',
        name: 'EYEKE7 2'
    },
    {
        chain: 'ethereum',
        contract_address: '0xfdb3475cd47f3d82d448a594cea6232410131d56',
        cached_file_url: '',
        name: 'Nike Air Force 1 Low Travis Scott Cactus Jack'
    },
    {
        chain: 'ethereum',
        contract_address: '0x60f80121c31a0d46b5279700f9df786054aa5ee5',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/c_0x60f80121c31a0d46b5279700f9df786054aa5ee5_t_555078_raw_asset.jpeg',
        name: 'Mac x Nike Cyph '
    },
    {
        chain: 'ethereum',
        contract_address: '0xfaafdc07907ff5120a76b34b731b278c38d6043c',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/a5a5de504cd1388fcc64a769701ba90a722e097d98d5f848fab88a9e9c08e75f.jpeg',
        name: '$20 Nike Gift Card'
    },
    {
        chain: 'ethereum',
        contract_address: '0x829870c1fae0d9e00a87ab3e10ac746b02ca1a79',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/8c17109021bf324dfc154cf8a4fe4601349fcb5dbdb42b1d3e72f34c54d88553.png',
        name: 'Nike'
    },
    {
        chain: 'ethereum',
        contract_address: '0x9212c3e33eafb390d0d215950bd8bea1fcc24324',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/6802509f94eba5470079c5645ba232d7a5df2937d7db6b1813871ece016dab61.jpeg',
        name: 'Nike Dunk Low Off-White Lot 50 (Vault NFT)'
    },
    {
        chain: 'ethereum',
        contract_address: '0x8853b05833029e3cf8d3cbb592f9784fa43d2a79',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/6cc2ccb4350bcba2cca381bdfe1db7f350f12225ca83d62c2f14e989f0f2cdca.jpeg',
        name: 'A beautiful Greek red-figure oinochoe depicting Nike'
    },
    {
        chain: 'ethereum',
        contract_address: '0x1bb6edf7b129967d512086fbdf489ed659580916',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/9147d879829e2c7c534dfcf9f0b8aa280fb2233f6a8c0972237bb1179adbe9e5.png',
        name: 'RTFKT x NIKE AR HOODIE  🕊✔️'
    },
    {
        chain: 'ethereum',
        contract_address: '0x029af5c555807c2b5d337478e5f895e8f3b557e2',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/4e25b812a6c989a8b36d5330a372ba927f5a28e0b590eab6503116bf954ff5ed.gif',
        name: 'RTFKT Space Drip x Nike Air Force 1 : CORY VAN LEW'
    },
    {
        chain: 'ethereum',
        contract_address: '0x6b1a68af1cbeca7d4abf27f1c606459548ae239f',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/115d656d79399983dbf8c91f91c7306674931bfc141f2273897c21bd84958c43.png',
        name: 'Nike Air Yeezy 2 - Red October #1/1'
    },
    {
        chain: 'ethereum',
        contract_address: '0x58298b78e26f15be20aa2e8b001112ea59e8b909',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/5a5971cfebc26ae974d0e306ce27dc6016e6567e31311fe8de454e0342de5298.png',
        name: 'CRYPTO-COMICS SNEAKER SERIES #5'
    },
    {
        chain: 'ethereum',
        contract_address: '0x9a41cd49126a53b796dbbdcf8ce163e989465111',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/c_0x9a41cd49126a53b796dbbdcf8ce163e989465111_t_24_raw_asset.gif',
        name: 'SNKR Cards / Nike SB Chunky Dunky 010-3 / Shiny Rainbow Rare'
    },
    {
        chain: 'ethereum',
        contract_address: '0x1d963688fe2209a98db35c67a041524822cf04ff',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/f7dfb5b7cb701e0a0cd8d7e706595bf05d21bc8f6024e28e3e9cd2e6a82b8e10.png',
        name: 'Nike (@Nike) | Twitter'
    },
    {
        chain: 'ethereum',
        contract_address: '0x23bccab1d4155989c72a4d0aa4ae0ccd474780c3',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/f1cb02821bcf084e69ff39d0567539c2f43b83a4f3ed4a0fe3bca307f76f27b1.png',
        name: '17841401380297400'
    },
    {
        chain: 'ethereum',
        contract_address: '0xf1052b3f54b9f3990f984bf472a91e3194055d4e',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/3049fab39378c897e3530ae356bc2eaf78f86a8545c6e1fda8c390be9d45ea69.jpeg',
        name: "Bruno's Nike SB Dunk High Premium Mork & Mindy"
    },
    {
        chain: 'ethereum',
        contract_address: '0xe1d928a203981307919dafc7c7e2a7332ebf2841',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/1aabdb70d8b08637e6f5e7806a82252b67af7fab53490710f5571d846bd4f63e.jpeg',
        name: 'Nike Air Force 1'
    },
    {
        chain: 'ethereum',
        contract_address: '0x3a18cff9067127fa444d5a15d6aec7a3066197a5',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/a0452cee86115ba96344652e1fdfd56a97a947a884da341a94e2fdcb82c62821.gif',
        name: 'NIKE AIR FLIGHT 89'
    },
    {
        chain: 'ethereum',
        contract_address: '0xb0e409b7b0313402a10caa00f53bcb6858552fda',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/f246aec33ce6fe574af0051933e857f6e4373e6a1cab8a976a002421aa6c4c15.png',
        name: '[1e] Nike'
    },
    {
        chain: 'ethereum',
        contract_address: '0x28d0a1d3125f9132efa6c1c09ab446b8c63f3ddf',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/dabef18f0148f71e068b45d937ddd0d519acc822640e28e5f14bde1fa6c11db0.gif',
        name: 'CryptoPhunks x Nike: Pirate Hoodie by TEJI 17/25'
    },
    {
        chain: 'ethereum',
        contract_address: '0xe4218895e979ca7db2624b74604509fdd60c8d75',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/c_0xe4218895e979ca7db2624b74604509fdd60c8d75_t_15_raw_asset.jpeg',
        name: 'Nike Airforce1 x Peace-1'
    },
    {
        chain: 'ethereum',
        contract_address: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
        cached_file_url: '',
        name: 'Nike'
    },
    {
        chain: 'ethereum',
        contract_address: '0xe23a1329bd77febca002b514a1eb7d85bf9e3b0d',
        cached_file_url: '',
        name: 'HEADLESS'
    },
    {
        chain: 'ethereum',
        contract_address: '0x3a921bf2c96cb60d49aff09110a9f836c295713a',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/49dcb9d01dd8f5c7e85b57b1ae570a218dae2c8abcc094780d0306b9562b744b.svg',
        name: "So I am always fake flexing huh? I just got one question for all my haters at home, where am I? and where are you? I'm on Rodeo Drive shopping for a Rolls Royce, with a $ 600beanie, $500 belt $200 Nike Air Max's. Don't let me remind u of my 14 bank accounts. Where am I? Where are you?"
    },
    {
        chain: 'ethereum',
        contract_address: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/bc6472d435156c118a1533da6c78d633a14ab9749c0e02e7f3b079b784bd78c4.svg',
        name: 'Uniswap - 0.01% - NIKE/WETH - 16667000<>50004000'
    },
    {
        chain: 'ethereum',
        contract_address: '0x8c5acf6dbd24c66e6fd44d4a4c3d7a2d955aaad2',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/ddbd54e005bcdbe4fb614a29868b2f33908f5e32d298b32ffd7c3bec1a4b4b6c.png',
        name: 'Winged Victory of Samothrace'
    },
    {
        chain: 'ethereum',
        contract_address: '0x39394bec951fa5b907313653571da5e0ee0cfc57',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/54e283d62286715d74eabdc71728f9fcfdbcc60eebcabd2e12fabd6bb42ee110.octet-stream',
        name: '“TO LIVE AND DIE IN LA”'
    },
    {
        chain: 'ethereum',
        contract_address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/15f65d8e37bcd50fad167936eee6d7a2dc9d5fe76d3b10e4618790e96c4a6770.svg+xml',
        name: 'nike‍.eth ⚠️'
    },
    {
        chain: 'ethereum',
        contract_address: '0xb66a603f4cfe17e3d27b87a8bfcad319856518b8',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/39334b72fb6d873cb65eeb44447d8ecdcfec589b2b4dfd9100bfb4ae55718868.jpeg',
        name: 'RTFKT x NIKE Playground #1'
    },
    {
        chain: 'ethereum',
        contract_address: '0x1ffbf0b26016684555eb7037f74505772200d6db',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/f46182d160e6763e0a3834bb00cbaa35eb3d37c41911d86ac03203d500dd9635.jpeg',
        name: '#1 Khaby'
    },
    {
        chain: 'ethereum',
        contract_address: '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0',
        cached_file_url: 'https://storage.googleapis.com/sentinel-nft/raw-assets/c_0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0_t_23185_raw_asset.gif',
        name: 'Winged Victory'
    }
]

const floorpriceloop = async (result) => {
    var array = []
    for (const elem of oldSearch_test_array) {
        await getFloorPriceDetail(elem, array)
    }
    console.log(array)
    result.send(array)
}

var floorprice_array = [
    {
        id: '4b7c65e4-1cae-52b6-ac32-6aea3ce2bfad',
        name: 'RTFKT X NIKE MONOLITH',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/4b7c65e4-1cae-52b6-ac32-6aea3ce2bfad/logo.jpeg',
        contracts: ['0x6d4bbC0387dD4759EEe30f6A482AC6dC2Df3Facf'],
        floor_price: 1.95
    },
    {
        id: '9f235949-5f9a-5448-b49f-1f6aee8dda44',
        name: 'nightkids',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/9f235949-5f9a-5448-b49f-1f6aee8dda44/logo.png',
        contracts: ['0x83b7261DB8c795701C6fc86D1fcd073ece940E10'],
        floor_price: 0.002
    },
    {
        id: '18ca4ebc-e826-50ec-bc38-dc98de9f9149',
        name: 'Niftydudes',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/18ca4ebc-e826-50ec-bc38-dc98de9f9149/logo.png',
        contracts: ['0x892555E75350E11f2058d086C72b9C94C9493d72'],
        floor_price: 0.125
    },
    {
        id: '7a0af26e-654a-5a73-b3fd-582758e44b58',
        name: 'Nice Drips',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/7a0af26e-654a-5a73-b3fd-582758e44b58/logo.png',
        contracts: ['0xFD0Af9Ddbd3fD21E3593428830fe47C4F749B1Fa'],
        floor_price: 0.0065
    },
    {
        id: '89be8836-0e6b-5b4a-9749-77f0d081f1af',
        name: 'Nickelodeon',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/89be8836-0e6b-5b4a-9749-77f0d081f1af/logo.gif',
        contracts: ['0x223E16c52436CAb2cA9FE37087C79986a288FFFA'],
        floor_price: 0.025
    },
    {
        id: '03394cd3-beb0-5ae4-846f-0d5694a8e766',
        name: 'RTFKT x Nike Dunk Genesis CRYPTOKICKS',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/03394cd3-beb0-5ae4-846f-0d5694a8e766/logo.jpeg',
        contracts: ['0xF661D58cfE893993b11D53d11148c4650590C692'],
        floor_price: 0.5
    },
    {
        id: 'a5b67773-bada-54b4-b117-16c9be70acd9',
        name: 'Space Drip Forging - RTFKT Space Drip x Nike Air Force 1',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/a5b67773-bada-54b4-b117-16c9be70acd9/logo.gif',
        contracts: ['0x029Af5c555807C2b5d337478e5F895E8F3B557e2'],
        floor_price: 1.45
    },
    {
        id: '0869811f-ec7d-5182-8bb5-0a41177f66e7',
        name: 'Tie Dye Ninjas',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/0869811f-ec7d-5182-8bb5-0a41177f66e7/logo.gif',
        contracts: ['0x5EC2642b5c9fB3c78fF39DcCA37E277Ed1695ff0'],
        floor_price: 0.0107
    },
    {
        id: '33366534-21b2-55d6-a1ed-82bff4abf31f',
        name: 'Crookz by NIXON',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/33366534-21b2-55d6-a1ed-82bff4abf31f/logo.gif',
        contracts: ['0x7dA30048214E112Dbc41A645e37f9640ac62799E'],
        floor_price: 0.0298
    },
    {
        id: '0c23e526-0b44-5bf7-a1df-511d5ea4a46f',
        name: 'Nouns',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/0c23e526-0b44-5bf7-a1df-511d5ea4a46f/logo.png',
        contracts: ['0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03'],
        floor_price: 78
    },
    {
        id: '08908c62-b6b5-5ba1-9eec-f628ee4869c4',
        name: 'The Nifty Portal',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/08908c62-b6b5-5ba1-9eec-f628ee4869c4/logo.png',
        contracts: ['0xD374410E9BB22f3771fFBd0b40A07c0Cf44a04FC'],
        floor_price: 0.2194
    },
    {
        id: '2401abab-fb6f-5a2d-9d20-c20617b39125',
        name: 'The Ninja Hideout',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/2401abab-fb6f-5a2d-9d20-c20617b39125/logo.png',
        contracts: ['0x97e41d5cE9C8cB1f83947ef82a86E345Aed673F3'],
        floor_price: 0.009
    },
    {
        id: '2f0af017-cad2-5c93-9acb-8d104df6875e',
        name: 'Rebels - Night Card',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/2f0af017-cad2-5c93-9acb-8d104df6875e/logo.png',
        contracts: ['0xE9FCa552b9eb110c2d170962aF740725F71F5644'],
        floor_price: 0.15
    },
    {
        id: '51e44866-5dfc-541a-b72a-1e27e1e65a9e',
        name: 'NFTheo',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/51e44866-5dfc-541a-b72a-1e27e1e65a9e/logo.png',
        contracts: ['0x9E02FFd6643f51aaAFa0f0E2a911Bf25EF2684Cb'],
        floor_price: 0.01
    },
    {
        id: 'c7d5fddf-aabe-552c-a5c2-5905c799240b',
        name: 'Nobody .',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/c7d5fddf-aabe-552c-a5c2-5905c799240b/logo.gif',
        contracts: ['0x219463D0675C3fa01C1edf537Ec5Dc693B6410AE'],
        floor_price: 0.017
    },
    {
        id: 'd3c06adb-10cf-5c36-9c1e-46e9935f42b7',
        name: "I Like You, You're Weird",
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/d3c06adb-10cf-5c36-9c1e-46e9935f42b7/logo.gif',
        contracts: ['0x3F93d710Ff8c449eA300AD69412E7B8F289a2954'],
        floor_price: 0.0348
    },
    {
        id: '4f4201dc-bd40-5fb6-a7c6-b50855543ded',
        name: 'Nyokies',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/4f4201dc-bd40-5fb6-a7c6-b50855543ded/logo.png',
        contracts: ['0xB318d1B6805D2F8Ec0e95e2600ad60b4725827C7'],
        floor_price: 0.005
    },
    {
        id: '6a577674-b144-5975-8a40-1b7fb62619a6',
        name: 'MetaTravelers: Nibiru',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/6a577674-b144-5975-8a40-1b7fb62619a6/logo.gif',
        contracts: ['0x5372f926b34Be60aC1436372107C3eE8c6e056E5'],
        floor_price: 0.017
    },
    {
        id: 'e43e4c81-dd69-5b16-bce0-b84b15d15fa1',
        name: 'POW NFT',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/e43e4c81-dd69-5b16-bce0-b84b15d15fa1/logo.png',
        contracts: ['0x9Abb7BdDc43FA67c76a62d8C016513827f59bE1b'],
        floor_price: 0.0348
    },
    {
        id: '5a0aafc2-2138-5a31-808e-b6ee5897ef6a',
        name: 'NFTrees',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/5a0aafc2-2138-5a31-808e-b6ee5897ef6a/logo.png',
        contracts: ['0xEAA4c58427C184413b04dB47889b28b5C98EBb7b'],
        floor_price: 12.4
    },
    {
        id: '3db2a9a1-e05b-5998-8616-0d8ad806de0a',
        name: 'Ninja mfers Official',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/3db2a9a1-e05b-5998-8616-0d8ad806de0a/logo.png',
        contracts: ['0xFB3cf61A46a565Fb1622Ec5f9D42D98ff7F762aA'],
        floor_price: 0.022
    },
    {
        id: '154ec40f-1033-5def-86a1-3992cddf0ed8',
        name: 'WWE NFT',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/154ec40f-1033-5def-86a1-3992cddf0ed8/logo.png',
        contracts: ['0xdd9DAE51ec0B2514b088BD8b0a53B466D5AE628c'],
        floor_price: 0.07
    },
    {
        id: '2c864ef4-626d-5ded-9313-f2c1230256d3',
        name: 'Ninja Squad Official',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/2c864ef4-626d-5ded-9313-f2c1230256d3/logo.jpeg',
        contracts: ['0x8C186802b1992f7650Ac865d4CA94D55fF3C0d17'],
        floor_price: 0.1348
    },
    {
        id: '3769f671-630c-5e95-aa73-37300a34dbda',
        name: 'HAKI NFT',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/3769f671-630c-5e95-aa73-37300a34dbda/logo.gif',
        contracts: ['0x7887f40763aCe5f0e8320181FD5B42776D35B1FF'],
        floor_price: 0.02
    },
    {
        id: 'b26f7213-6f68-5f5e-b335-d31166931c5f',
        name: 'NyanDogg',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/b26f7213-6f68-5f5e-b335-d31166931c5f/logo.png',
        contracts: ['0xfF6889ea7d06137edd949F8381a14F0fFC39bA80'],
        floor_price: 0.66
    },
    {
        id: 'd7e4b2b3-3319-5745-9986-dd0804a15266',
        name: 'A.N.I.M.O',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/d7e4b2b3-3319-5745-9986-dd0804a15266/logo.png',
        contracts: ['0x569F26145F0C2fCc3dA68395BE3639009C53B6d8'],
        floor_price: 0.0799
    },
    {
        id: 'c92c6365-8200-53ef-b8cd-8d1750217703',
        name: 'NFT Gurus',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/c92c6365-8200-53ef-b8cd-8d1750217703/logo.gif',
        contracts: ['0xAC3D871d3431847Bdff9eEBB42Eb51ae06e131C3'],
        floor_price: 0.035
    },
    {
        id: 'd251d7ba-7f70-5aa5-a907-7f0e69ac9064',
        name: 'Welly NFT',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/d251d7ba-7f70-5aa5-a907-7f0e69ac9064/logo.jpeg',
        contracts: ['0xEe31eA1F63cAb8387222551C469E31D189711Cf7'],
        floor_price: 0.24
    },
    {
        id: '27086545-6a78-5f4e-8258-6627007e6756',
        name: 'NeckVille',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/27086545-6a78-5f4e-8258-6627007e6756/logo.gif',
        contracts: ['0xfFD287647F3F5ac7e5d613911B75023311712F93'],
        floor_price: 0.005
    },
    {
        id: '867f3d07-e6da-5576-9d62-ab297193a0e8',
        name: 'Chads NFT',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/867f3d07-e6da-5576-9d62-ab297193a0e8/logo.png',
        contracts: ['0x9CF63EFbe189091b7e3d364c7F6cFbE06997872b'],
        floor_price: 0.01489
    },
    {
        id: '45782e2f-af0e-5cdf-847f-0b530bd02414',
        name: 'Nifty Island: Ultra Blades',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/45782e2f-af0e-5cdf-847f-0b530bd02414/logo.png',
        contracts: ['0x17e1Bd6009702a4c47309d6dc8aF0bc847327C46'],
        floor_price: 0.154
    },
    {
        id: '6cd48127-6d21-565c-8c8e-73430170034e',
        name: 'First First NFTs',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/6cd48127-6d21-565c-8c8e-73430170034e/logo.png',
        contracts: ['0xc9Cb0FEe73f060Db66D2693D92d75c825B1afdbF'],
        floor_price: 0.06
    },
    {
        id: '07a3d6b6-ac4e-5eb2-9151-7b0929654f62',
        name: 'Chains NFT',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/07a3d6b6-ac4e-5eb2-9151-7b0929654f62/logo.jpeg',
        contracts: ['0x9b293020D3802c80b023D4B6965AB5E59Bc971E2'],
        floor_price: 0.072
    },
    {
        id: '7fc8f6a9-b1d1-57d3-8c9d-ae0cd7ac3d28',
        name: 'Cheebs NFT',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/7fc8f6a9-b1d1-57d3-8c9d-ae0cd7ac3d28/logo.png',
        contracts: ['0x415F77738147a65A9d76BB0407AF206a921ceE0f'],
        floor_price: 0.004
    },
    {
        id: '93ecef02-06b0-5f9d-8052-fb432bab9f57',
        name: 'NoShitZone',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/93ecef02-06b0-5f9d-8052-fb432bab9f57/logo.png',
        contracts: ['0x7721E8dd956E07F7254385A7C039E9bdE92e425D'],
        floor_price: 0.088
    }
]

app.post('/search', (req, res) => {
    // console.log(req.body.text)
    var text = req.body.text
    // getoldSearchDetail(text,res)
    getSearchDetail(text, res)
    // floorpriceloop(res)
    // res.send(floorprice_array)
});

async function getoldSearchDetail(text_value, result) {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    var link = "https://svc.blockdaemon.com/nft/v1/ethereum/mainnet/collections/search?name=" + text_value + "&verified=true"
    var unique = [], updated_array = []
    // for (var i = 1; i <= 100; i++) {
    const options = {
        method: 'GET',
        url: link,
        params: {
            chain: 'ethereum',
            include: 'all',
            refresh_metadata: 'true',
            page_number: i
        },
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer ywwFnT2GMA4EKqN3edQWo3F-MbGyhKJafIFz7KcBqEd3WwBG"
        }
    };
    var search = await axios.request(options).catch(function (error) {
        console.error(error);
    });
    console.log(search.data.data)
    var search_array = search.data.search_results
    // console.log(search_array)
    console.log(i)
    search_array.forEach((elem) => {
        delete elem['token_id'];
        delete elem['description'];
        delete elem['mint_date'];
        if (!unique.includes(elem.contract_address)) {
            unique.push(elem.contract_address)
            updated_array.push(elem)
        }
    })
    // }
    console.log(search_array.length)
    console.log(unique.length)
    console.log(updated_array)
    var main_array = []
    for (const elem of updated_array) {
        // await getFloorPriceDetail(elem, main_array)
    }
    // console.log(main_array)
    console.log(main_array.length)
    function compare(a, b) {
        return b.floor_price - a.floor_price;
    }
    main_array.sort(compare)
    result.send(main_array)
}

async function getSearchDetail(text_value, result) {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    var link = "https://svc.blockdaemon.com/nft/v1/ethereum/mainnet/collections/search?name=" + text_value + "&verified=true"
    var unique = [], updated_array = []
    // for (var i = 1; i <= 100; i++) {
    const options = {
        method: 'GET',
        url: link,
        // params: {
        //     // chain: 'ethereum',
        //     include: 'all',
        //     refresh_metadata: 'true',
        //     // page_size: i,
        //     verified:true
        // },
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer ywwFnT2GMA4EKqN3edQWo3F-MbGyhKJafIFz7KcBqEd3WwBG"
        }
    };
    var search = await axios.request(options).catch(function (error) {
        console.error(error);
    });
    var search_array = search.data.data
    // console.log(search_array)
    // console.log(i)
    search_array.forEach((elem) => {
        delete elem['verified'];
        if (!unique.includes(elem)) {
            elem.contracts.forEach((e) => {
                unique.push(e)
                updated_array.push(elem)
            })
        }
    })
    // }
    console.log(search_array.length)
    console.log(unique.length)
    console.log(updated_array.length)
    var main_array = []
    for (const elem of updated_array) {
        await getFloorPriceDetail(elem, main_array)
    }
    console.log(main_array)
    console.log(main_array.length)
    function compare(a, b) {
        return b.floor_price - a.floor_price;
    }
    main_array.sort(compare)
    result.send(main_array)
    // var search_priority_array = [], rest_array = []
    // main_array.forEach((item) => {
    //     if (item.name.toUpperCase().includes(text_value.toUpperCase())) {
    //         // console.log(item)
    //         search_priority_array.push(item)
    //     }
    //     else {
    //         rest_array.push(item)
    //         function compare(a, b) {
    //             return b.floor_price - a.floor_price;
    //         }
    //         rest_array.sort(compare)
    //     }
    // })
    // var newarray
    // newarray = search_priority_array.concat(rest_array)
    // console.log(newarray)
    // newarray = newarray.slice(0, 10)
    // result.send(newarray)
}

let i = 1
async function getFloorPriceDetail(element, array) {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    var link = "https://api.nftport.xyz/v0/transactions/stats/" + element.contracts
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
            Authorization: 'a2194375-f545-4197-a3b5-5b4cb1ba26e7'
        }
    };
    var stats_response = await axios.request(options).catch(function (error) {
        console.error("apierror", i);
        // console.log(error)
        i++;
    });
    try {
        var stats = stats_response.data.statistics
        // stats_array.push(stats)
        if (stats.floor_price != null) {
            element.floor_price = stats.floor_price
            array.push(element)
        }
        else { console.log("null") }
    }
    catch {
        // console.log("error")
    }
    await wait(500)
}

async function getClientDetail(element, result) {
    var users = []
    const options = {
        method: 'GET',
        // url: link,
        params: {
            chain: 'ethereum',
            type: 'all'
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: '068da24a-741f-49da-bc13-477f53da2b61'
        }
    };
    let promise = await new Promise(function (resolve, reject) {
        setTimeout(() => https.get('https://api.nftport.xyz/v0/transactions/stats/' + element["Contract Address"] + '?chain=ethereum', options, res => {
            res.on('data', elem => {
                resolve()
                const obj = JSON.parse(elem)
                // console.log(obj)
                const newobj = obj.statistics
                newobj.name = element.Brand
                newobj.image = element.logo
                users.push(newobj)
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        }), 1000);
    });
    // console.log(users)
    var link = "https://api.nftport.xyz/v0/transactions/nfts/" + element["Contract Address"]
    const option = {
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
    var transaction = await axios.request(option).catch(function (error) {
        console.error(error);
    });
    // console.log(transaction.data)
    var tx = transaction.data.transactions
    result.send([{ "stats": users }, { "transactions": tx }])
}

var client_array = [
    {
        Brand: 'ClientA',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/4b7c65e4-1cae-52b6-ac32-6aea3ce2bfad/logo.jpeg',
        "Contract Address": '0x6d4bbC0387dD4759EEe30f6A482AC6dC2Df3Facf',
    },
    {
        id: '9f235949-5f9a-5448-b49f-1f6aee8dda44',
        Brand: 'ClientB',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/9f235949-5f9a-5448-b49f-1f6aee8dda44/logo.png',
        "Contract Address": '0x83b7261DB8c795701C6fc86D1fcd073ece940E10',
    },
    {
        id: '18ca4ebc-e826-50ec-bc38-dc98de9f9149',
        Brand: 'ClientC',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/18ca4ebc-e826-50ec-bc38-dc98de9f9149/logo.png',
        "Contract Address": '0x892555E75350E11f2058d086C72b9C94C9493d72',
    }, {
        id: '18ca4ebc-e826-50ec-bc38-dc98de9f9149',
        Brand: 'ClientD',
        logo: 'https://ubiquity.api.blockdaemon.com/nft/v1/ethereum/mainnet/media/collection/18ca4ebc-e826-50ec-bc38-dc98de9f9149/logo.png',
        "Contract Address": '0x892555E75350E11f2058d086C72b9C94C9493d72',
    }
]

var clients = []
client_array.forEach((elem) => {
    clients.push(elem.Brand)
})
clients.forEach((e) => {
    app.get("/" + e, (req, res) => {
        var filteredclient = client_array.filter(element => { return element.Brand == e })
        res.send(filteredclient)
        // console.log(filteredcategory[0]["Contract Address"])
        // getViewData(filteredcategory, res)
    })
})

app.post("/clientlogin", (req, res) => {
    console.log(req.body.text)
    var filteredclient = client_array.filter(element => { return element.Brand == req.body.text })
    res.send(filteredclient)
    console.log(filteredclient)
})

app.post("/clientdetail", (req, res) => {
    console.log(req.body)
    getClientDetail(req.body, res)
})

// var account_address = "0x4c907dE462CAC0b47eF31c4b1258389C96Cd2ecc"

async function getWalletNFT(address, result) {
    var link = "https://api.nftport.xyz/v0/accounts/" + address
    const options = {
        method: 'GET',
        url: link,
        params: {
            chain: 'ethereum',
            type: 'all',
            include: "contract_information"
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: '068da24a-741f-49da-bc13-477f53da2b61'
        }
    };
    var wallet = await axios.request(options).catch(function (error) {
        console.error(error);
    });
    // console.log(transaction.data)
    var wallet_total = wallet.data.total
    console.log(wallet_total)
    var wallet_nft_array = []
    for (var i = 1; i <= Math.ceil(wallet_total / 50); i++) {
        const options = {
            method: 'GET',
            url: "https://api.nftport.xyz/v0/accounts/" + address,
            params: {
                chain: 'ethereum',
                include: "contract_information",
                page_number: i
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: '068da24a-741f-49da-bc13-477f53da2b61'
            }
        };
        var total_wallet_items = await axios.request(options).
            catch(function (error) {
                console.error(error);
            });
        wallet_nft_array.push(...total_wallet_items.data.nfts)
    }
    console.log(wallet_nft_array.length)
    // wallet_nft_array.forEach((elem) => {
    //     // function url(){
    //     //     var fileurl = elem.file_url
    //     //     var animationurl = elem.animation_ur
    //     //     if (animationurl != null) {
    //     //         users.animation_url=elem.animation_url
    //     //         // users.push(animationurl)
    //     //     } else {
    //     //         users.file_url=elem.file_url
    //     //         // users.push(fileurl)
    //     //     }
    //     // }
    //     users.push({"contract_address":elem.contract_address,"collection_name":elem.name,"description":elem.description,"animation_url":elem.animation_url,"file_url":elem.file_url})
    // })
    // console.log(wallet_nft_array)
    result.send(wallet_nft_array)
}

app.post("/walletaddress", (req, res) => {
    console.log(req.body.address)
    var wallet_address = req.body.address
    getWalletNFT(wallet_address, res)
})

async function getmetadata(wallet_address, contract_address, result) {
    var link = "https://api.nftport.xyz/v0/accounts/" + wallet_address
    const options = {
        method: 'GET',
        url: link,
        params: {
            chain: 'ethereum',
            type: 'all',
            include: "metadata",
            contract_address: contract_address
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: '068da24a-741f-49da-bc13-477f53da2b61'
        }
    };
    var wallet = await axios.request(options).catch(function (error) {
        console.error(error);
    });
    var metadata_array = wallet.data.nfts
    console.log(metadata_array)
    result.send(metadata_array)
}

app.post("/searchwalletaddress", (req, res) => {
    var con_add = req.body.element
    var address = []
    con_add.forEach((e) => { address.push(e.contract_address) })
    var walletaddress = req.body.wallet_add
    for (const add of address) {
        console.log(add)
        getmetadata(walletaddress, add, res);
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
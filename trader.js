const readline = require('readline');
const fs = require('fs');

function trader_onData(contractDatas)
{
    //for (c in contractDatas){
        //var data = contractDatas[c]
        //trader_parseData(c, data)
    //}
    
    //var c = 'NI1605'
    //var data = contractDatas[c]
    //parseData(c, data)

    var path = 'c:\\datas'
    fs.readdir(path, function(err, files){
        files.map(function(file){
            trader_parseFile(path + '\\' + file)
        })
    })
}

function trader_parseFile(file)
{
    var hlocs = []
    const rl = readline.createInterface({
        input: fs.createReadStream(file)
    });

    rl.on('line', function(line) {
        var arr = line.split(',')
        var tmp = []
        tmp[0] = arr[0] + arr[1]
        tmp[0] = tmp[0].replace(/\//g, '')
        tmp[0] = tmp[0].replace(/:/g, '')
        tmp[0] += "00"
        tmp[2] = arr[2]
        tmp[3] = arr[5]
        tmp[4] = arr[3]
        tmp[5] = arr[4]
        tmp[6] = arr[6]
        hlocs.push(tmp)
    });   

    rl.on('close', function() {
        //console.log(hlocs)
        //console.log('file close!')
        trader_parseData(file, hlocs)
    })
}

function trader_parseData(c, data)
{
    var trades = showChart(data, c)

    var sum = 0
    for (var i = 0; i < trades.length; i++)
    {
        var t1 = trades[i - 1]
        var t2 = trades[i]
        var profit = 0
        if (!t1 || !t2)
        {
            continue
        }
        if (t1.type == 'sell')
        {
            profit = t1.price - t2.price
        }
        else
        {
            profit = -t1.price + t2.price
        }
        //console.log(t1)
        //console.log(t2)
        //console.log(profit)
        sum += profit
    }
    //console.log(trades)
    console.log(c, ' sum : ', sum)
}

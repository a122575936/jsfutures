function backtest_main()
{
    //var path = 'c:\\datas'
    //fs.readdir(path, function(err, files){
        //files.map(function(file){
            //backtest_parseFile(path + '\\' + file)
        //})
    //})

    backtest_parseFile('c:/datas/SQauMI.csv')
}

function backtest_parseFile(file)
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
        backtest_parseData(file, hlocs)
    })
}

function backtest_parseData(c, data)
{
    var trades = showChart(data.slice(0, 600), c)

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
    console.log(c, ' sum : ', sum, ' count : ', trades.length)
}

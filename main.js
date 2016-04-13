function parseData(contractDatas, quotelistDatas)
{
    var ret = []
    for (contract in contractDatas){
        var data = contractDatas[contract]
        var quote = quotelistDatas[contract]
        if (data && data.length && quote)
        {
            last = data[data.length - 1]

            var closelast = quote.Data[0][0][3]
            var closelastbutone = last[1]
            var closerate = null
            
            if (closelast && closelastbutone)
            {
                closerate = (closelast - closelastbutone) / closelastbutone
            }
            else
            {
                continue
            }
            
            ret.push({contract: contract, data: data, price: closelast, rate: closerate, absrate: Math.abs(closerate)})
        }
    }

    var div_futures = document.getElementById("div_futures")
    removeAllChildren(div_futures)

    ret = ret.sort(function(obj1, obj2){return obj2.absrate - obj1.absrate})
    ret.map(function(obj){
        var str = sprintf("%.3f, %s", obj.rate, obj.contract)
        //var traders = showChart(obj.data, str)
        //console.error(obj.contract, 'length of traders ', traders.length)

        if (obj.absrate > 0.004)
        {
            //console.warn(str)
        }
        else if (obj.absrate > 0.003)
        {
            //console.info(str)
        }
    })
}

function showChartByVolatility(contractDatas, contractDailyDatas, quotelistDatas)
{
    removeAllChildren($('#myTabContent #home')[0])
    removeAllChildren($('#myTabContent #profile')[0])
    var ret = []
    for (contract in contractDatas)
    {
        var quoteData = quotelistDatas[contract]
        var rate = quoteData.Data[0][0][11]
        ret.push({contract : contract, rate : rate})
    }
    ret = ret.sort(function(a,b){return Math.abs(b.rate) - Math.abs(a.rate)})
    for(var i = 0; i < ret.length; i++)
    {
        //console.log(ret[i].contract)
        var contract = ret[i].contract
        showChart(contractDatas[contract], contract, '#myTabContent #home')
        showChart(contractDailyDatas[contract], contract, '#myTabContent #profile')
    }
}


function onInterval()
{
    var contracts = getMainContracts()
    var contractDatas = {}
    var contractDailyDatas = {}
    var quotelistDatas = {}
    async.map(contracts, loadDataHexun, function(err, datas){
        console.log('loadDataHexun complete!')
        datas.map(function(data){contractDatas[data.contract] = data.data})
        async.map(contracts, loadDailyDataHexun, function(err, dailyDatas){
            dailyDatas.map(function(data){contractDailyDatas[data.contract] = data.data})
            async.map(contracts, loadQuotelistDataHexun, function(err, quotes){
                console.log('loadQuotelistDataHexun complete!')
                quotes.map(function(quote){quotelistDatas[quote.contract] = quote.data})
                parseData(contractDatas, quotelistDatas)
                showChartByVolatility(contractDatas, contractDailyDatas, quotelistDatas)
                trader_onData(contractDatas)
            })
        })
    })
}

function main()
{
    setInterval("onInterval()", 10000)
    onInterval()
    //backtest_main()
}

app = {}
main()

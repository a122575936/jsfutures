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
        showChart(obj.data, str)
        if (obj.absrate > 0.004)
        {
            console.warn(str)
        }
        else if (obj.absrate > 0.003)
        {
            console.info(str)
        }
    })
}

function onInterval()
{
    var contracts = getMainContracts()
    var contractDatas = {}
    var quotelistDatas = {}
    async.map(contracts, loadDataHexun, function(err, datas){
        console.log('loadDataHexun complete!')
        datas.map(function(data){contractDatas[data.contract] = data.data})
        async.map(contracts, loadQuotelistDataHexun, function(err, quotes){
            console.log('loadQuotelistDataHexun complete!')
            quotes.map(function(quote){quotelistDatas[quote.contract] = quote.data})
            parseData(contractDatas, quotelistDatas)
        })
    })
}

function main()
{
    //setInterval("onInterval()", 10000)
    onInterval()
}

app = {}
main()

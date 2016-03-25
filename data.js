function getMainContracts()
{
    var arr = cc.slice(0, cc.length - 1).map(function(c){return c.newContract})
    arr = arr.filter(function(contract){
        if (_.include(['BB', 'FB', 'RS', 'RI', 'OI', 'WH'], getCode(contract)))
        {
            return false
        }
        return true
    })
    return arr
}

function getExchangeHexun(contract)
{
    var c = getCode(contract)
    var e = getExchange(contract)
    //console.log('contract ', contract)
    //console.log('exchange ', e)
    var config = {}
    config[1] = "SHFE3"
    config[3] = "DCE"
    config[4] = "CZCE"
    config[5] = "CFFEX"
    if (e == 1)
    {
        var code = {}
        code['AG'] = "SHFE2"
        code['AL'] = "SHFE3"
        code['AU'] = "SHFE2"
        code['BU'] = "SHFE3"
        code['CU'] = "SHFE3"
        code['HC'] = "SHFE3"
        code['NI'] = "SHFE3"
        code['RB'] = "SHFE3"
        code['RU'] = "SHFE"
        code['ZN'] = "SHFE3"
        config[1] = code[c]
    }
    return config[e]
}

function getQuotelistUrlHexun(contract)
{
    var e = getExchangeHexun(contract)
    var url = sprintf("http://webftcn.hermes.hexun.com/shf/quotelist?code=%s%s&column=Code,Name,DateTime,Price,Amount,Volume,LastClose,Open,High,Low,UpDown,UpDownRate,Speed,PriceWeight,AveragePrice,OpenTime,CloseTime,EntrustRatio,EntrustDiff,OutVolume,InVolume,ExchangeRatio,TotalPrice,LastSettle,SettlePrice,BuyPrice,BuyVolume,SellPrice,SellVolume,VolumeRatio,PE,LastVolume,LastCount,LastInOut,VibrationRatio,Total,DealCount,OpenPosition,ClosePosition,PositionDiff,LastPositions,AddPosition,OpenInterest", e, contract)
    return url
}

function getUrlHexun(contract)
{
    var e = getExchangeHexun(contract)
    var dateformat = d3.time.format("%Y%m%d")
    var url = sprintf("http://webftcn.hermes.hexun.com/shf/kline?code=%s%s&start=20170308210000&number=-960&type=2&t=%f", e, contract.toLowerCase(), Math.random())
    return url
}

function loadQuotelistDataHexun(contract, oncomplete)
{
    var url = getQuotelistUrlHexun(contract)
    if (url)
    {
        $.get(url, function (body) {
            var data = eval(body)
            oncomplete && oncomplete(null, {contract: contract, data: data})
        })
    }
}

function loadDataHexun(contract, oncomplete)
{
    var url = getUrlHexun(contract)
    if (url)
    {
        $.get(url, function (body) {
            var hlocs = eval(body)
            oncomplete && oncomplete(null, {contract: contract, data: hlocs.Data[0]})
        })
    }
}

function getCode(contract)
{
    if (!contract)
    {
        return ""
    }
    var code = contract.match(/\D*/)[0]
    return code
}

function getExchange(contract)
{
    if (!contract)
    {
        return -1
    }
    var code = contract.match(/\D*/)[0]
    for (var i = 0; i < cv.length; i++)
    {
        var arr = cv[i].data
        for (var j = 0; j < arr.length; j++)
        {
            var obj = arr[j]
            if (obj[0].toLowerCase() == code.toLowerCase())
            {
                var config = []
                config[0] = 3
                config[1] = 1
                config[2] = 4
                config[3] = 5
                return config[i]
            }
        }
    }
    return -1
}

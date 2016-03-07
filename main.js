var request = require('request');
var sprintf = require("sprintf-js").sprintf
var _ = require("underscore")
var async = require('async')
var contractDatas = {}
var quotelistDatas = {}
var contracts = getMainContracts()

function getMainContracts()
{
    return cc.slice(0, cc.length - 1).map(function(c){return c.newContract})
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
        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var data = eval(body)
            quotelistDatas[contract] = data
            //console.log('quotelist ', data)
          }
          else
          {
            console.log('load data error ', contract)
          }
          oncomplete && oncomplete()
        })
    }
}

function loadDataHexun(contract, oncomplete)
{
    var url = getUrlHexun(contract)
    if (url)
    {
        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var hlocs = eval(body)
            contractDatas[contract] = hlocs.Data[0]
          }
          else
          {
            console.log('load data error ', contract)
          }
          oncomplete && oncomplete()
        })
    }
}

function last(arr)
{
    return arr[arr.length - 1]
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

function showChart(hlocs, str)
{
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d%H%M%S").parse;

    var x = techan.scale.financetime()
            .range([0, width]);

    var y = d3.scale.linear()
            .range([height, 0]);

    var candlestick = techan.plot.candlestick()
            .xScale(x)
            .yScale(y);

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

    var svg = d3.select("div").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var accessor = candlestick.accessor();

    data = hlocs.slice(0, 300).map(function(d) {
        return {
            date: parseDate(d[0].toString()),
            open: +d[2],
            high: +d[4],
            low: +d[5],
            close: +d[3],
            volume: +d[6]
        };
    }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

    x.domain(data.map(accessor.d));
    y.domain(techan.scale.plot.ohlc(data, accessor).domain());

    svg.append("g")
            .datum(data)
            .attr("class", "candlestick")
            .call(candlestick);

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", width - 70)
            .attr("y", -6)
            .text(str);

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");
}

function parseData(contract)
{
    console.log('-------------------------------------')
    contracts.map(function(contract){
        var data = contractDatas[contract]
        var quote = quotelistDatas[contract]
        if (data && data.length && quote)
        {
            //console.log(contract, ' quote price ', quote.Data[0][0][3])
            //console.log(contract, ' quote time ', quote.Data[0][0][2])
            last = data[data.length - 1]
            //console.log(last)
            //console.log(contract, ' last 15m price', last[1])
            //console.log(contract, ' last 15m time ', last[0])

            var closelast = quote.Data[0][0][3]
            var closelastbutone = last[1]
            var closerate = null
            
            if (closelast && closelastbutone)
            {
                closerate = (closelast - closelastbutone) / closelastbutone
                //console.log('closerate ', closerate)
            }
            else
            {
                return
            }
            
            var str = sprintf("%.3f, %s", closerate, contract)
            if (Math.abs(closerate) > 0.004)
            {
                showChart(data, str)
            }
            if (Math.abs(closerate) > 0.004)
            {
                console.error(str)
            }
            else if (Math.abs(closerate) > 0.003)
            {
                console.info(str)
            }
        }
    })
}

function onInterval()
{
    async.map(contracts, loadDataHexun, function(){
        console.log('loadDataHexun complete!')
        async.map(contracts, loadQuotelistDataHexun, function(){
            console.log('loadQuotelistDataHexun complete!')
            var div_futures = document.getElementById("div_futures")
            while (div_futures && div_futures.hasChildNodes())
            {
                div_futures.removeChild(div_futures.lastChild)
            }
            parseData()
        })
    })
}

setInterval("onInterval()", 60000)
onInterval()

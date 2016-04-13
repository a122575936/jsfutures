const readline = require('readline');
const fs = require('fs');

function trader_main()
{}

function trader_onData(contractDatas)
{
    //for (c in contractDatas){
        //var data = contractDatas[c]
        //trader_parseData(c, data)
    //}
    
    //['V1609', 'C1701', 'P1609', 'CS1609', 'I1609', 'NI1609', 'MA1609'].map(function(c){
        //var data = contractDatas[c]
        //trader_parseData(c, data)
    //})
}

function trader_parseData(c, data)
{
    var trades = showChart(data, c)
    var t = _.last(trades)
    if (t)
    {
        var transport = new Thrift.Transport('http://localhost:8000')
        var protocol = new Thrift.Protocol(transport)
        var client = new TraderClient(protocol)
        var ret = client.check(c, t.type, function(){console.log('check return !')})
        //console.log('check', t)
    }

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
            //console.log(profit)
        }
        else
        {
            //profit = -t1.price + t2.price
        }
        //console.log(t1)
        //console.log(t2)
        sum += profit
    }
    //console.log(trades)
    console.log(c, ' sum : ', sum, ' count : ', trades.length)
}

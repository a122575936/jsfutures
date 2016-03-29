function showChart(hlocs, str)
{
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 860 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d%H%M%S").parse;

    var x = techan.scale.financetime()
            .range([0, width]);

    var y = d3.scale.linear()
            .range([height, 0]);

    var candlestick = techan.plot.candlestick()
            .xScale(x)
            .yScale(y);

    var tradearrow = techan.plot.tradearrow()
            .xScale(x)
            .yScale(y)
            .orient(function(d) { return d.type.startsWith("buy") ? "up" : "down"; })

    var atrtrailingstop = techan.plot.atrtrailingstop()
            .xScale(x)
            .yScale(y);

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

    var accessor = candlestick.accessor();

    data = hlocs.map(function(d) {
        return {
            date: parseDate(d[0].toString()),
            open: +d[2],
            high: +d[4],
            low: +d[5],
            close: +d[3],
            volume: +d[6]
        };
    }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

    tmp = data.map(function(d){return d.close})
    //console.log(tmp)
    //var valley_pivots = peak_valley_pivots(data, 0.013, -0.013)
    //console.log()

    var atrtrailingstopData = techan.indicator.atrtrailingstop()(data);

    var trades = []
    var trade = null
    for (var i = 0; i < data.length; i++){
        var d = data[i]
        var atrd = atrtrailingstopData[-data.length + atrtrailingstopData.length + i - 1]
        //console.log('d', d)
        //console.log('atrd', atrd)
        if (d && atrd)
        {
            if (d.close && atrd.up && (d.close < atrd.up))
            {
                if (trade && trade.type == "buy")
                {

                }
                else
                {
                    trade = {date: data[i].date, type: "buy", price: data[i].close, quantity:1}
                    trades.push(trade)
                }
            }
            if (d.close && atrd.down && (d.close > atrd.down))
            {
                if (trade && trade.type == "sell")
                {

                }
                else
                {
                    trade = {date: data[i].date, type: "sell", price: data[i].close, quantity:1}
                    trades.push(trade)
                }
            }
        }
    }


    //return trades
    //var trades = []
    //for (var i = 0; i < valley_pivots.length; i++){
        //var vp = valley_pivots[i]
        //if (vp == 1)
        //{
            //trades.push({date: data[i].date, type: "buy", price: data[i].high, quantity:1})
        //}
        //else if (vp == -1)
        //{
            //trades.push({date: data[i].date, type: "sell", price: data[i].low, quantity:1})
        //}
    //}

    var svg = d3.select("#div_futures").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(accessor.d));
    y.domain(techan.scale.plot.ohlc(data, accessor).domain());

    svg.append("g")
            .datum(data)
            .attr("class", "candlestick")
            .call(candlestick);

    svg.append("g")
            .datum(trades)
            .attr("class", "tradearrow")
            .call(tradearrow);

    svg.append("g")
                .datum(atrtrailingstopData)
                .attr("class", "atrtrailingstop")
                .call(atrtrailingstop);

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

    return trades
}

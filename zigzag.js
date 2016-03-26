var PEAK = 1
var VALLEY = -1

function _identify_initial_pivot(X, up_thresh, down_thresh){
    x_0 = X[0]
    max_x = x_0.high
    max_t = 0
    min_x = x_0.low
    min_t = 0
    up_thresh += 1
    down_thresh += 1

    for (var t = 0; t < X.length; t++){
        x_t = X[t]

        if (x_t.low / min_x >= up_thresh){
            if (min_t == 0)
            {
                return VALLEY
            }
            else
            {
                return PEAK
            }
        }

        if (x_t.high / max_x <= down_thresh){
            if (max_t == 0)
            {
                return PEAK
            }
            else
            {
                return VALLEY
            }
        }

        if (x_t.high > max_x){
            max_x = x_t.high
            max_t = t
        }

        if (x_t.low < min_x){
            min_x = x_t.low
            min_t = t
        }
    }

    t_n = X.length-1
    if (x_0.low < X[t_n])
    {
        return VALLEY
    }
    else
    {
        return PEAK
    }
}

function peak_valley_pivots(X, up_thresh, down_thresh){
    if (down_thresh > 0){
        console.error('The down_thresh must be negative.')
    }

    initial_pivot = _identify_initial_pivot(X, up_thresh, down_thresh)

    t_n = X.length
    pivots = new Array(t_n)
    pivots[0] = initial_pivot

    up_thresh += 1
    down_thresh += 1

    trend = -initial_pivot
    last_pivot_t = 0
    last_pivot_x = X[0]
    for (t = 0; t < X.length; t++){
        x = X[t]

        if (trend == -1){
            r = x.low / last_pivot_x.low
            if (r >= up_thresh){
                pivots[last_pivot_t] = trend
                trend = 1
                last_pivot_x = x
                last_pivot_t = t
            }
            else if (x.low < last_pivot_x.low){
                last_pivot_x = x
                last_pivot_t = t
            }
        }
        else{
            r = x.high / last_pivot_x.high
            if (r <= down_thresh){
                pivots[last_pivot_t] = trend
                trend = -1
                last_pivot_x = x
                last_pivot_t = t
            }
            else if (x.high > last_pivot_x.high){
                last_pivot_x = x
                last_pivot_t = t
            }
        }
    }

    if (last_pivot_t == t_n-1){
        pivots[last_pivot_t] = trend
    }
    else if (pivots[t_n-1] == 0){
        pivots[t_n-1] = -trend
    }

    return pivots
}

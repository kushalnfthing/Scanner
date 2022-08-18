var chartselection = [
    {
        "Chart": "Bar",
        "id": "Chart1",
        "Xaxis": "name",
        "Yaxis": "total_sales",
        // "Maxis": "revenuesold",
        // "Naxis": "revenueunsold",
        // "sort": "revenueunsold",
        // "value": "200"
    },
    {
        "Chart": "StackedBar",
        "id": "Chart2",
        "Xaxis": "name",
        // "Yaxis": "unsold"
        "Maxis": "total_minted",
        "Naxis": "total_supply",
        "sort": "total_minted",
        "value": "10"
    },
    {
        "Chart": "Pie",
        "id": "Chart3",
        "Xaxis": "name",
        "Yaxis": "total_supply",
        "value": "10"
    },
    {
        "Chart": "Treemap",
        "id": "Chart4",
        "Xaxis": "name",
        "Yaxis": "num_owners",
        "value": "70"
    },
    {
        "Chart": "Info",
        "id": "Chart5",
        "type":"total",
        "title": "Total sales",
        "Xaxis": "name",
        "parameter": "total_sales",
    },
    {
        "Chart": "Info",
        "id": "Chart6",
        "type":"total",
        "title": "Total supply",
        "Xaxis": "name",
        "parameter": "total_supply",
    },
    {
        "Chart": "Info",
        "id": "Chart7",
        "type":"highest",
        "title": "Highest single day price",
        "Xaxis": "name",
        "parameter": "one_day_average_price",
    },
    {
        "Chart": "Info",
        "id": "Chart8",
        "type":"highest",
        "title": "Highest single day sales",
        "Xaxis": "name",
        "parameter": "one_day_sales",
    }
]

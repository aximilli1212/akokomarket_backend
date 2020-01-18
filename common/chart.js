const _ = require("lodash");
const moment = require("moment");
const utils = require("./utils");
const HttpStatus = require("http-status-codes");

exports.getChartRange = function (req) {

    let from;
    let to;
    let granularity = "ms";

    const range = req.query.range;
    if(typeof range === "string"){

        switch (range){

            case "today":{
                from = moment().startOf("day");
                to = moment().endOf("day");
                granularity = "day";
            }break;
            case "yesterday":{
                from = moment().startOf("day").subtract(1,"day");
                to = from.add(1,"day");
                granularity = "day";
            }
            break;
            case "week":{

                from = moment().startOf("week");
                to = moment().endOf("week");
                granularity = "day";

            }break;
            case "month":{
                from = moment().startOf("month");
                to = moment().endOf("month");
                granularity = "month";
            }
            break;
            case "year":{
                from = moment().startOf("year");
                to = moment().endOf("year");
                granularity = "year";
            }
            break;
        }
    }
    else{

        if(req.query.from && req.query.to) {
            from = moment(req.query.from);
            to = moment(req.query.to);
        }

    }

    if(!from || !to)
        throw new Error("Invalid chart range");

    return { from: from, to: to , granularity: granularity };
};

/**
 * Generate chart
 */
exports.generate = function (req, items, opts) {

    const chartData = {
        values: []
    };

    opts = opts || {};

    const sumKey = opts.sumKey;
    const cmpKey = opts.cmpKey || "date_created";
    const operation = opts.operation || "count";
    const range = opts.range || exports.getChartRange(req);

    let _filter = opts.filter || function (items,from,to,granularity){
        return items.filter(x => moment(x[cmpKey]).isBetween(from,to,"ms","(]") );
    };

    const interval = opts.interval || 1;
    const unit = opts.unit || "day";

    //
    chartData.startTime = range.from.toDate();
    chartData.endTime = range.to.toDate();

    let start = range.from;

    do{

        //
        let end = moment(start).add(interval , unit );
        let frame = _filter(items, start, end, range.granularity);

        switch (operation){
            case "count": {

                    chartData.values.push({
                        time: start.toDate(),
                        value: frame.length
                    });

                }
                break;
            case "sum":{

                    chartData.values.push({
                        time: start.toDate(),
                        value: utils.sumBy(frame,item => item[sumKey])
                    });

                }
                break;
        }

        //  increment
        start = end;

    }while ( start.isSameOrBefore(range.to) );

    return chartData;
};

/**
 * Generate and send chart
 * @param items
 * @param req
 * @param res
 * @param opts
 */
exports.sendChart = function (items , req, res,opts) {

    const interval = req.query.interval;
    const unit = req.query.incr_by;

    const chartData = exports.generate(req,items, _.extend(opts,{
        interval: interval,
        unit: unit
    }));

    return res.status(HttpStatus.OK).json( chartData );
};
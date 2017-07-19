var db = require("../core/db");
var util = require("util");

function REST_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

REST_ROUTER.prototype.handleRoutes = function (router) {
    router.post("/salesReport", function (req , resp) {
        var query = util.format("select tm.billno,p.prdctdesc,td.noofqty,td.taxvalue,td.cattaxvalue,td.totalamount,td.linediscount" + 
        " from Trn_PosTranMaster tm, Trn_PosTrnDetails td, Mst_Products p" +
        " where tm.PosTrnMstID = td.PosTrnMstID and td.ProductID = p.PrdctId and convert(date, tm.rundate, 102) between" +
        " convert(date, '%s', 102) and convert(date,'%s', 102)" +
        " and tm.TillID between '%s' and '%s'", req.body.dateFrom, req.body.dateTo, req.body.tillFrom, req.body.tillTo);
        db.executeSql(query, function (data, err) {
            if (err) {
                resp.json(err);
            } else {
                resp.json(data);
                console.log("Successful");
            }
            resp.end();
        });
    });
}

module.exports = REST_ROUTER;
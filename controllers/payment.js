var db = require("../core/db");

function REST_ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

REST_ROUTER.prototype.handleRoutes = function (router) {
    router.get("/", function (req, resp) {
        res.json({ "Message" : "Hello World !" });
    });
    //GET API
    router.get("/payments", function (req , resp) {
        db.executeSql("select * from Trn_PosMstPay", function (data, err) {
            if (err) {
                resp.json(err);
            } else {
                resp.json(data);
            }
            resp.end();
        });
    });
}

module.exports = REST_ROUTER;
var db = require("../core/db");

exports.getList = function (req, resp) {
    db.executeSql("select * from Trn_PosMstPay", function (data, err) {
        if (err) {
            resp.writeHead(200, { "Content-Type": "application/json" });
            resp.write(JSON.stringify(err));
        } else {
            resp.writeHead(200, { "Content-Type": "application/json" });
            resp.write(JSON.stringify(data));
        }
        resp.end();
    });
};
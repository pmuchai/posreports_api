var sqlDb = require("mssql");
var settings = require("../settings");

exports.executeSql = function (sql, callback){
    var conn = new sqlDb.Connection(settings.dbConfig);
    conn.connect()
    .then(function () {
        var req = new sqlDb.Request(conn);
        req.query(sql)
        .then(function (recordset){
            callback(recordset);
        })
        .catch(function (err) {
            console.log(err);
            callback(null, err);
        });
    })
    .catch(function (err) {
        console.log(err);
        callback(null, err);
    });
}

exports.executeQuery = function (res, query) {
    sqlDb.connect(settings.dbConfig, function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            //res.send(err);
            res.json(err);
        }
        else {
            // create Request object
            var request = new sqlDb.Request();
            // query to the database
            request.query(query, function (err, res) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.json(err);
                }
                else {
                    res.json(res);
                }
            });
        }
    });
}
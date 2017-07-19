var db = require("../core/db");
var util = require("util");

function REST_ROUTER(router, jwt, app) {
    var self = this;
    self.handleRoutes(router, jwt, app);
}

REST_ROUTER.prototype.handleRoutes = function (router, jwt, app) {
    router.post("/login", function (req , resp) {
        var query = util.format("select * from SecuritySystemUser" +
        " where username = '%s'", req.body.username);
        db.executeSql(query, function (data, err) {
            if (err) {
                resp.json(err);
            } else {
                if (!(data.length > 0)) {
                    resp.json({ success: false, message: 'Authentication failed. User not found.' });
                } else {
                    // check if password matches
                    /*if (data.password != req.body.password) {
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                    }*/
                    data = JSON.stringify(data);
                    // if user is found and password is right
                    // create a token 
                    //, { expiresInSeconds: 1 }
                    var token = jwt.sign(data, app.get('secretKey'));
                    
                    // return the information including token as JSON
                    resp.json({
                        success: true,
                        message: "Success",
                        token: token
                    });
                    //resp.json(data);
                    console.log("Successful");
                }
            }
            resp.end();
        });
    });
}

module.exports = REST_ROUTER;
//Initiallising node modules
var db = require("../core/db");
var util = require("util");
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var morgan = require("morgan");
var jwt = require('jsonwebtoken');
var settings = require("../settings");
var login = require("../controllers/login");
var payment = require("../controllers/payment");
var SalesReport = require("../controllers/SalesReport");
var app = express();
var router = express.Router();

app.set('secretKey', settings.secret); 
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});


router.post("/authenticate", function (req , resp) {
    var query = util.format("select * from SecuritySystemUser" +
        " where username = '%s'", req.body.username);
    db.executeSql(query, function (data, err) {
        if (err) {
            resp.json(err);
        } else {
            if (!(data.length > 0)) {
                resp.json({ success: false, message: 'Authentication failed. User not found.' });
            } else {
                    data = JSON.stringify(data);
                var token = jwt.sign(data, app.get('secretKey'));
                resp.json({
                    success: true,
                    message: "Success",
                    token: token
                });
            }
        }
        resp.end();
    });
});


// route middleware to verify a token
router.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token;
    
    // decode token
    if (token) {
        
        // verifies secret and checks exp
        jwt.verify(token, app.get('secretKey'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false, 
            message: 'No token provided.'
        });
    
    }
});

var login = new login(router, jwt, app);
var payment = new payment(router);
var SalesReport = new SalesReport(router);


// apply the routes to our application with the prefix /api
app.use('/api', router);


//Setting up server
var server = app.listen(settings.webPort, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});
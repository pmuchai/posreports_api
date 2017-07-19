var http = require("http");
var payment = require("../controllers/payment");
var settings = require("../settings");

http.createServer(function (req, resp){
    switch (req.method) {
        case "GET":
            if (req.url === "/") {
                resp.end();
            } else if (req.url === "/payments") {
                payment.getList(req, resp);
            }
            break;
        case "POST":
            break;
        case "PUT":
            break;
        case "DELETE":
            break;
        default:
            break;
    }

}).listen(settings.webPort, function (){
    console.log("Started listening at: " + settings.webPort);
})
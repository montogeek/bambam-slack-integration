var url = require("url"),
    http = require("http"),
    https = require('https');

http.createServer(function(request, response) {
    response.writeHeader(200, {"Content-Type": "text/plain"});
    if (request.method === 'POST') {
      request.on('data', function(data) {
        var encodedData = data.toString().split('=')[1];
        var toJSON = JSON.parse(decodeURIComponent(url.parse(encodedData, true).path.replace(/\+/g, ' ')));
        var payload = {
          text: toJSON.invoker +
                ' a' +
                ' actualizado ' +
                toJSON.taskTitle +
                ' ' +
                toJSON.taskURL
        }
        postToSlack(payload);
      });
    }
    response.end();
}).listen(process.env.PORT || 8081);

var postToSlack = payload => {
  var userString = JSON.stringify(payload);

  var options = {
    host: 'hooks.slack.com',
    path: process.env.API_CODE,
    method: 'POST',
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      var resultObject = responseString;
      console.log(resultObject);
    });
  });

  req.on('error', function(e) {
    // TODO: handle error.
  });
  req.write(userString);
  req.end();
}
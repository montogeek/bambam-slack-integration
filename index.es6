'use strict'

let url = require('url')
let http = require('http')
let https = require('https')

http.createServer(function(request, response) {
  response.writeHeader(200, {'Content-Type': 'text/plain'})
  if (request.method === 'POST') {
    request.on('data', function(data) {
        let encodedData = data.toString().split('=')[1]
        let toJSON = JSON.parse(decodeURIComponent(url.parse(encodedData, true).path.replace(/\+/g, ' ')))
        let payload = {
          text: toJSON.invoker +
                ' a' +
                ' actualizado ' +
                toJSON.taskTitle +
                ' ' +
                toJSON.taskURL
        }
        postToSlack(payload)
      })
  }

  response.end()
}).listen(process.env.PORT || 8081)

let postToSlack = payload => {
  let userString = JSON.stringify(payload)

  let options = {
    host: 'hooks.slack.com',
    path: process.env.API_CODE,
    method: 'POST'
  }

  let req = https.request(options, function(res) {
    res.setEncoding('utf-8')

    let responseString = ''

    res.on('data', function(data) {
      responseString += data
    })

    res.on('end', function() {
      let resultObject = responseString
      console.log(resultObject)
    })
  })

  req.on('error', function(e) {
    console.log(e);
  })

  req.write(userString)
  req.end()
}

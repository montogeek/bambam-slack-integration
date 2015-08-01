'use strict'

let url = require('url')
let http = require('http')
let https = require('https')
let Promise = require('promise')

let availableOptions = [
    'oldTaskAssignee',
    'oldTaskVisibility',
    'projectURL',
    'isEstimationUpdated',,
    'statusType',
    'isAttachmentsUpdated',
    'invokerProfileURL',
    'isDueDateUpdated',
    'isLabelsUpdated',
    'isAssignmentUpdated',
    'isNewTask',
    'isVisibilityUpdated',
    'oldTaskDueDate',
    'invokerSmallAvatarURL',
    'taskAuthor',
    'invokerId',
    'taskStatus',
    'isPriorityUpdated',
    'oldTaskLabels',
    'accountURL',
    'oldTaskPriority',
    'invokerEmail',
    'isTimeEntryAdded',
    'oldTaskMilestone',
    'taskEstimation',
    'taskVisibility',
    'isUpdatedTask',
    'taskPriority',
    'taskLabels',
    'isStatusUpdated',
    'invoker',
    'unsubscribeURL',
    'updateComment',
    'oldTaskStatus',
    'taskDueDate',
    'taskContent',
    'oldTaskEstimation',
    'taskURL',
    'domain',
    'taskMilestone',
    'subdomain',
    'taskAssignee',
    'taskTitle',
    'projectName',
    'isMilestoneUpdated',
    'projectId',
    'taskId'
]

let postToSlack = payload => {
  let promise = new Promise((resolve, reject) => {
    let userString = JSON.stringify(payload)

    let options = {
      host: 'hooks.slack.com',
      path: process.env.API_CODE,
      method: 'POST'
    }

    let req = https.request(options, (res) => {
      res.setEncoding('utf-8')

      let responseString = ''

      res.on('data', (data) => {
        responseString += data
      }

      res.on('end', () => {
        let resultObject = responseString
        resolve(resultObject)
      }
    }

    req.on('error', (err) => {
      reject(err)
    }

    req.write(userString)
    req.end()
  })

  return promise
}

let transformMessage = (data) => {
  return `${data.invoker} has updated ${data.taskTitle}. More info at ${data.taskURL}`
}

let createServer = (() => {
  http.createServer((request, response) => {
    response.writeHeader(200, {'Content-Type': 'text/plain'})
    if (request.method === 'POST') {
      request.on('data', (data) => {
        let encodedData = data.toString().split('=')[1]
        let toJSON = JSON.parse(decodeURIComponent(url.parse(encodedData, true).path.replace(/\+/g, ' ')))
        let payload = {
          text: transformMessage(toJSON)
        }

        postToSlack(payload).then(() => {
          console.log('Correct')
        }).then(() => {
          throw new Error('Incorrect')
        })
      })
    }
    response.end()

  }).listen(process.env.PORT || 8081)
})()

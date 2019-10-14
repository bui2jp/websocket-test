// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

var AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
var DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

exports.handler = function (event, context, callback) {
    console.log('    chikutaku log : ws_connect :' + event.requestContext.connectionId);
    console.log(event);
    console.log(context);
  var putParams = {
    //TableName: process.env.TABLE_NAME,
    TableName: 'ws_connection_tbl',
    Item: {
      id: { S: event.requestContext.connectionId }
    }
  };

  DDB.putItem(putParams, function (err) {
    
    console.log('    chikutaku log : ' + JSON.stringify(err) );
    
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? "Failed to connect: " + JSON.stringify(err) : "Connected."
    });
  });
};
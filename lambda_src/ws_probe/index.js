// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');
var uuid = require('uuid');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

//const { TABLE_NAME } = process.env;
const { TABLE_NAME } = 'ws_connection_tbl';

exports.handler = async (event, context) => {
  
  console.log( 'chikutaku log : ws_message start' );
  console.log( 'event  : ' + JSON.stringify(event) );
  console.log( 'context: ' + JSON.stringify(context) );
  
  
  let connectionData;
  
  try {
    connectionData = await ddb.scan({ TableName: 'ws_connection_tbl', ProjectionExpression: 'id' }).promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }
  console.log( 'connectionData (id list in ddb): ' + JSON.stringify(connectionData) );
  
  //api gw
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  
  const postData = JSON.parse(event.body).data;
  console.log( '### postData which has lat,lon from client: ' + postData );
  
  const postCalls = connectionData.Items.map(async ({ id }) => {
    try {
      console.log( 'apigwManagementApi.postToConnection start ' );  
      await apigwManagementApi.postToConnection({ ConnectionId: id, Data: postData }).promise();
    } catch (e) {
      console.log( '    chikutaku log apigwManagementApi.postToConnection exception ' );  
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${id}`);
        await ddb.delete({ TableName: TABLE_NAME, Key: { id } }).promise();
      } else {
        throw e;
      }
    }
  });
  
  console.log( '    chikutaku log start promise.all ' );  
  try {
    await Promise.all(postCalls);
  } catch (e) {
    console.log('chikutaku log Promise.all exception : ' + e.stack );
    return { statusCode: 500, body: e.stack };
  }

  /*
    evaluate and notification
  */
  evaluation01();
  evaluation02();
  evaluation03();

  
  /*
    add record to Dynamo db

  var putParams = {
    TableName: process.env.TABLE_NAME_LATLON_HIST,
    Item: {
      id:  { S : 'test1' },
//      lat: { S: postData.lat },
//      lon: { S: postData.lon },
      myTextobject: { S: JSON.stringify(postData) }
    }
  };

  console.log('DDB.putItem start');
  var DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
  await DDB.putItem(putParams).promise();
  console.log('DDB.putItem end');
  */

  console.log( 'ddb put ... start : ' + postData + ':' + new Date().getTime());
  var currentTime = new Date().getTime();
  var latlng = JSON.parse(postData);
  var params = {
    TableName: process.env.TABLE_NAME_LATLON_HIST,
    Item:{
      id : uuid.v1(),
      current_tm : currentTime,
      lat: latlng.lat,
      lon: latlng.lng,
      remark: 'a'
    }
  };
  await ddb.put(params).promise();

  
  console.log( '    chikutaku log : status 200 : ' );
  return { statusCode: 200, body: 'Data sent.' };
};

const evaluation01 = () => {
  console.log('evaluation01');
};

const evaluation02 = () => {
  console.log('evaluation02');
};

const evaluation03 = () => {
  console.log('evaluation03');
};

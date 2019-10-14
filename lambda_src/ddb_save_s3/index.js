var aws = require('aws-sdk');
var s3 = new aws.S3({ apiVersion: '2006-03-01' });
var uuid = require('uuid');

exports.handler = async (event, context) => {
    console.log('ws_save_latlon_s3 start ddb record will be in s3');
    
    console.log(JSON.stringify(event.Records[0].eventName));
    console.log(JSON.stringify(event.Records[0].dynamodb.NewImage));
    
    const inputedValue = JSON.stringify(event.Records[0].dynamodb.NewImage);
    
    console.log('start s3.putObject :' + inputedValue);
    //Key will be fileName in s3 bucket
    const myS3Key = uuid.v1();
    var params = {Bucket: 'ws-latlon-history', Key: myS3Key, Body: inputedValue};
    s3.putObject(params, function(err, data) {
        if (err){
            console.log("err:" + err)
        }
        console.log("context.done()")
        context.done();
    });
};

/*
{
    "eventID": "c2334baa262d34e2c9b7df1f8047c63a",
    "eventName": "INSERT",
    "eventVersion": "1.1",
    "eventSource": "aws:dynamodb",
    "awsRegion": "ap-northeast-1",
    "dynamodb": {
        "ApproximateCreationDateTime": 1569040658,
        "Keys": {
            "id": {
                "S": "8a52e8d0-dc29-11e9-b5f4-1fea2bbc8271"
            }
        },
        "NewImage": {
            "current_tm": {
                "N": "1569040658397"
            },
            "lon": {
                "N": "139.752616"
            },
            "id": {
                "S": "8a52e8d0-dc29-11e9-b5f4-1fea2bbc8271"
            },
            "lat": {
                "N": "35.685114"
            }
        },
        "SequenceNumber": "287200000000027534890315",
        "SizeBytes": 111,
        "StreamViewType": "NEW_AND_OLD_IMAGES"
    },
    "eventSourceARN": "arn:aws:dynamodb:ap-northeast-1:049777008631:table/ws_latlon_hist/stream/2019-09-21T03:57:07.209"
}
*/
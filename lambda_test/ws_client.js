console.log('ws_clinet.js start');

// WebSocket 接続を作成する
const socket = new WebSocket('wss://1frpd3s0zl.execute-api.ap-northeast-1.amazonaws.com/dev');

// 接続を開く
socket.addEventListener('open', function (event) {
    console.log("#connection opened and send probe");
    for (let i=0; i<10; i++){
        console.log("send...");
        let sendData = {action: "probe", data:"test"};
        let probe = {id:i,lat:111,lng:222};
        sendData.data = JSON.stringify(probe);
        //socket.send('{"action":"probe", "data":"{id:123,lat:222,lng:333}"}');
        let sendDataString = JSON.stringify(sendData);
        console.log(sendDataString);
        socket.send(sendDataString);
    }
});

// メッセージを待ち受ける
socket.addEventListener('message', function (event) {
    console.log('#Message from server ', event.data);
});
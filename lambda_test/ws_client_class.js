console.log('ws_clinet_class.js start');


class MyWebSocket {
    constructor() {

        // WebSocket 接続を作成する
        this.socket = new WebSocket('wss://1frpd3s0zl.execute-api.ap-northeast-1.amazonaws.com/dev');

        // 接続を開く
        this.socket.addEventListener('open', this.ws_open);

        // メッセージを待ち受ける
        this.socket.addEventListener('message', this.ws_receive_msg);

        this.count = 0;
    }

    //method
    ws_open(event) {
        console.log('ws_open : ' + event);
        //myWSObject.ws_send(probeData);
        setInterval(()=>{
            probeData.lng = probeData.lng + 0.0001;
            console.log('probeData.lng:' + probeData.lng);
            myWSObject.ws_send(probeData);
        },100)
    }

    ws_send(msg) {
        for(let i=0; i<1; i++ ){
            msg.time = new Date().getTime();
            if (myWSObject.count !== 0 && myWSObject.count%100===0) {
                msg.callback = true;
            }else{
                msg.callback = false;
            }
            let sendData = { action: "probe", data: JSON.stringify(msg) };
            let sendDataString = JSON.stringify(sendData);
            //console.log('ws_send : ' + sendDataString);
            console.log('ws_send');
            myWSObject.count++;
            myWSObject.socket.send(sendDataString);
        }
    }

    ws_receive_msg(msg) {
        let ct = new Date().getTime();
        //console.log('ws_receive_msg : ' + JSON.stringify(msg.data) + ':' +  ( ct - msg.data.time) );
        let sentData = JSON.parse(msg.data);
        console.log('ws_receive_msg : ' + (msg.data) + ':' +  ( ct - sentData.time) );
        //myWSObject.ws_send(probeData);
        //console.log('ws_receive_msg');
    }
}

const myWSObject = new MyWebSocket();

var probeData = {
    id: "testid2",
    //tokyo 皇居 139.754023, 35.684861
    lat: 35.684861,
    lng: 139.754023,
    time: null,
    callback:false
}

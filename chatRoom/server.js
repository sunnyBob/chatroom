var express = require('express')
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', function(req, res){
    res.send('<h1>Welcome Realtime Server</h1>')
});
app.use(express.static('./public'));

//在线用户
var onlineUsers = {}
//当前在线人数
var onlineCount = 0

io.on('connection', function(socket){
    console.log('a user connected')

    socket.on("chat",function(msg, username){
       socket.broadcast.emit('chat', msg,username)
    })
    socket.on('font_color', function(color) {
        socket.broadcast.emit('font_color', color)
    })
    socket.on('emoji', function (src, username) {
        socket.broadcast.emit('emoji', src, username)
    })
    socket.on('voiceMsg', function (src) {
        console.log(src)
        socket.broadcast.emit('voiceMsg', src)
    })
    socket.emit("message","欢迎加入聊天室")
  
    //监听新用户加入
    socket.on('login', function(obj){
        //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        socket.name = obj.id;
        var isNew = false
        //检查在线列表，如果不在里面就加入

         console.log(onlineUsers)
        if(!onlineUsers.hasOwnProperty(obj.id)) {
            isNew = true

            onlineUsers[obj.id] = obj.nickname;
            //在线人数+1
            onlineCount++;
        }
        socket.emit('confirm_nickname', {username: obj.nickname,isNew:isNew})
        //向所有客户端广播用户加入
        io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
        console.log(obj.nickname+'加入了聊天室');
    });

    //监听用户退出
    socket.on('disconnect', function(){
        //将退出的用户从在线列表中删除
        if(onlineUsers.hasOwnProperty(socket.name)) {
            //退出用户的信息
            var obj = {id:socket.name, nickname:onlineUsers[socket.name]};

            //删除
            delete onlineUsers[socket.name];
            //在线人数-1
            onlineCount--;

            //向所有客户端广播用户退出
            io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
            console.log(obj.nickname+'退出了聊天室');
        }
    });

});

http.listen(3000, function(){
    console.log('listening on 127.0.0.1:3000');
});


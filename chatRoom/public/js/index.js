var ws = io("ws://139.199.157.153:3000")
var username = ""

ws.on('message',function(data){
	$('.title').html(data)
})

//登陆
var index = 0
$('input[name=connect]').click( function(e) {
	var id=index++
	var nickname= $('input[name=nickname]').val()
	if(nickname!="") {
		var obj = {
			"id": nickname,
			"nickname": nickname
		}
		ws.emit('login', obj)
	} else {
		alert("请输入昵称")
	}
})


ws.on('login', function (obj) {
	console.log(obj)
	var template = $("#userlist").html()
	var data = []
	$("#onlinecount").html(obj.onlineCount)
	for(var user in obj.onlineUsers){
		data.push({
			nickname: user
		})
	}
	console.log(data)
	$('.speakPane').append('<li style="text-align:center;color:#0FF805;font-size:12px">'+obj.user.nickname+'加入聊天室</li>')
	$(".userlist").append(Mustache.render(template, data))

})
ws.on('logout', function(obj) {
	var template = $("#userlist").html()
	var data = []
	$("#onlinecount").html(obj.onlineCount)
	for(var user in obj.onlineUsers){
		data.push({
			nickname: user
		})
	}
	console.log(data)
	$('.speakPane').append('<li style="text-align:center;color:#FE10DA;font-size:12px">'+obj.user.nickname+'离开聊天室</li>')
	$(".userlist").append(Mustache.render(template, data))
})

ws.on('confirm_nickname', function (user) {
	console.log(user.isNew)
	if(user.isNew) {
		$(".loginForm").css("display","none")
		$(".container-fluid").css("display","block")
		username = user.username
	}
	else {
		alert("该昵称已经被占用")
	}
})

$('input[name=submit]').click(function(){
	var content = $('#speak').val()
	var color = $('input[name=color]').val()
	$('.speakPane').append('<li style="text-align: left"><span>'+username+"</span>说: "+content+'</li>')
	ws.emit('chat',content,username)
	ws.emit('font_color', color)
	$('#speak').val('')

})
$('.emoji').click( function (e) {
	var src = $(e.target).attr("src")
	$('.speakPane').append("<li style='text-align: left'><span>"+username+": "+"</span> <img src='"+src+"'></li>")
	ws.emit('emoji',src,username)
})
ws.on('emoji', function (src, name) {
	$('.speakPane').append("<li style='text-align: right'><span>"+name+": "+"</span> <img src='"+src+"'></li>")
})
ws.on('chat', function (content, name) {
	$('.speakPane').append('<li style="text-align: right"><span>'+name+"</span>说: "+content+'</li>')
})
ws.on('font_color', function (color) {
	$('.speakPane li').last().css('color', color);
})

//语音
function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
	    var recorder  
        var audio = document.querySelector('audio')  
          
        function startRecording() {  
            HZRecorder.get(function (rec) {  
                recorder = rec  
                recorder.start()  
            })  
        }  
          
          
        function sendVoice(){ 
        	var src = window.URL.createObjectURL(recorder.getBlob());  
            ws.emit('voiceMsg',src)
        }  
          
        function stopRecord(){  
            recorder.stop()  
        }  
          
        function playRecord(audio){  
            recorder.play(audio)  
        } 
} else {
  alert('getUserMedia() is not supported in your browser')
}
ws.on('voiceMsg', function (src) {
	document.querySelector('audio').src = src
})
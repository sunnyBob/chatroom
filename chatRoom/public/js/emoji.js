var list = []
for(var i = 1; i < 70; i++)
{
	list.push(i+".gif")
}
$("#emoji").click( function () {
	var html = ""
	for(var i = 0; i < list.length; i++) {
		html += "<img src='emoji/"+list[i]+"'/>"
	}
	if($(".emoji").html() == "") {
		$(".emoji").slideDown().html(html)
	}
	else {
		$(".emoji").slideUp().html('')
	}
})
$(".emoji").click( function() {
	$('.emoji').slideUp()
})
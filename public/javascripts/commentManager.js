function makeitgo(video) {
	$("#currentTime").click({param1: video}, setCurrentTime);
	$("#post").click(postComment);
	loadComments(video);
}

function setCurrentTime(event) {
	setDropdownTime(event.data.param1.currentTime);
}

function postComment() {
	alert("posting comment");
}

function setDropdownTime(timeInSecs) {
	var hrs = Math.floor(timeInSecs / 3600);
	var min = Math.floor((timeInSecs - (hrs * 3600)) / 60);
	var sec = Math.floor(timeInSecs - (hrs * 3600) - (min * 60)); 
	$("#hrs").val(hrs);
	$("#min").val(min);
	$("#sec").val(sec);
}

function setUpComments(video) {
	if(video.paused) {
		//alert("video paused");
		
	}
	else {
		//alert("video is playing");
	}
}

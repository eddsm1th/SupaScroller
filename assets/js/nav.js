$(document).ready(function(){

	$(window).scroll(function(){ nav_scroll(); })

	function nav_scroll(){
		$('.nav--scroll').css('transform','translateY(' + $(window).scrollTop() + 'px)');
	}

})
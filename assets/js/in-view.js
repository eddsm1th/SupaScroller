$(document).ready(function(){

	$(window).scroll(function(){ view_on_scroll(); })

	function view_on_scroll(){
		$('.js-view-on-scroll').each(function(){
			if ( ( ( $(this).offset().top - $(window).scrollTop() ) - window_height ) <= 0 ) {
				$(this).addClass('in-view');
			} else {
				$(this).removeClass('in-view');
			}
		})
	}

	function has_scroll_offset(e){
		return i = e == 0 ? 0 : -144;
	}

})
$(document).ready(function(){
	var supaScroll = false;
	var startingX;
	var currentIndex = 1;

	$(document).on('mousedown touchstart', '.can-transition', function(e){

		e.preventDefault();

		startingX = event.clientX;
		supaScroll = true;

	})

	$(document).on('mousemove touchmove', '.can-transition', function(e){

		e.preventDefault();
		
		if ( supaScroll ) {

			$(this).css('transform','translateX(' + ( ( event.clientX - startingX ) + ( ( $(window).width() * ( currentIndex - 1 ) ) * -1 ) ) + 'px)');	

		}

	})

	$(document).on('mouseup touchend', '.can-transition', function(e){

		e.preventDefault();

		if ( ( ( event.clientX - startingX ) * -1 ) > ( $(window).width() / 10 ) ) {

			$(this).removeClass('can-transition').addClass('transitioning');

			if ( currentIndex < $('.hero__slide').length ) {
				
				$('.hero').css('transform','translateX(-' + ( $(window).width() * currentIndex ) + 'px)');

				currentIndex++;

			} else {

				normalise_slider();

			}

		} else if ( ( ( event.clientX - startingX ) * -1 ) < ( ( $(window).width() / 10 ) * -1 ) ) {

			$(this).removeClass('can-transition').addClass('transitioning');

			if ( currentIndex > 1 ) {
				
				$('.hero').css('transform','translateX(-' + ( $(window).width() * ( currentIndex - 2) ) + 'px)');

				currentIndex--;

			} else {

				normalise_slider();

			}
			
		} else {

			$(this).removeClass('can-transition').addClass('transitioning');

			normalise_slider();

		}

		supaScroll = false;

		setTimeout(function(){
			$('.hero').addClass('can-transition').removeClass('transitioning');			
		}, 600)

	})

	function normalise_slider(){
		$('.hero').css('transform','translateX(-' + ( $(window).width() * ( currentIndex - 1) ) + 'px)');
	}

})

$(document).ready(function(){

	var win_width;
	var shiftValues = [0.7, 0.4, 0.1, -0.3, -0.6];
	var shiftValue_winRatio;
	var supaScroll = false;
	var startingX;
	var currentIndex = 1;
	var scrollAmount = 0;

	get_max_shift();

	$(window).resize(function(){ get_max_shift(); })

	function get_max_shift(){
		shift_browser_ratio();

		$('.background__segment').each(function(){
			var slide_index = $(this).parent().parent().index();
			var starting_shift = shiftValue_winRatio[ $(this).index() ] * slide_index;
			var max_shift = shiftValue_winRatio[ $(this).index() ];
			
			$(this).find('div').attr('data-max-shift', max_shift).css('left','' + starting_shift + 'px');
		})
	}

	function shift_browser_ratio(){
		win_width = $(window).width();
		shiftValue_winRatio = [];

		for (i = 0; i < shiftValues.length; ++i) {
    		shiftValue_winRatio.push( win_width * shiftValues[i] );
		}
	}

	$(document).on('mousedown touchstart', '.can-transition', function(e){

		e.preventDefault();

		startingX = event.clientX + ( win_width * ( currentIndex - 1 ) );
		supaScroll = true;

	})

	$(document).on('mousemove touchmove', '.can-transition', function(e){

		e.preventDefault();
		
		if ( supaScroll ) {
			background_shift( ( event.clientX + ( win_width * ( currentIndex - 1 ) ) ) - startingX );

			$(this).css('transform','translateX(' + ( ( ( event.clientX + ( win_width * ( currentIndex - 1 ) ) ) - startingX ) + ( ( win_width * ( currentIndex - 1 ) ) * -1 ) ) + 'px)');	
		}

	})

	$(document).on('mouseup touchend', '.can-transition', function(e){

		e.preventDefault();

		if ( ( ( ( event.clientX + ( win_width * ( currentIndex - 1 ) ) ) - startingX ) * -1 ) > ( win_width / 10 ) ) {
			if ( currentIndex < $('.hero__slide').length ) {
				currentIndex++;
			}
		} else if ( ( ( ( event.clientX + ( win_width * ( currentIndex - 1 ) ) ) - startingX ) * -1 ) < ( ( win_width / 10 ) * -1 ) ) {
			if ( currentIndex > 1 ) {
				currentIndex--;
			}
		}

		slider_classes($(this));
		normalise_slider();
		supaScroll = false;
	})

	function normalise_slider(){
		$('.hero').css('transform','translateX(-' + ( win_width * ( currentIndex - 1) ) + 'px)');

		$('.background__segment').each(function(){
			var slide_index = $(this).parent().parent().index();
			var multiplier = ( slide_index + 1 ) - currentIndex;
			var index = $(this).index();
			var segment_shift = ( $(this).find('div').attr('data-max-shift') * multiplier );

			$(this).find('div').addClass('transitioning').css('left', segment_shift + 'px' );

			setTimeout(function(){
				$('.background__segment > div').each(function(){ $(this).removeClass('transitioning'); })
			}, 1200)
		})
	}

	function slider_classes(e){
		e.removeClass('can-transition').addClass('transitioning');

		setTimeout(function(){
			e.addClass('can-transition').removeClass('transitioning');			
		}, 1200)
	}

	function background_shift(diffX){
		$('.background__segment').each(function(){
			var slide_index = $(this).parent().parent().index();
			var multiplier = ( slide_index + 1 ) - currentIndex;
			var index = $(this).index();
			var current_shift_val = $(this).find('div').attr('data-max-shift');

			$(this).find('div').css('left','' + ( ( shiftValue_winRatio[index] * ( diffX / win_width ) ) + ( current_shift_val * multiplier ) ) + 'px');
		})
	}

	document.addEventListener('wheel', function(e){
		var scrollCompare = scrollAmount;
		scrollAmount += e.deltaY;

		if ( $('.hero').hasClass('can-transition') ) {
			if ( scrollAmount > scrollCompare && currentIndex < $('.hero__slide').length ) {
				scroll_wheel_shift(1);
			} else if ( currentIndex > 1 ) {
				scroll_wheel_shift(-1)
			}
		}
	})

	function scroll_wheel_shift(e){
		currentIndex += e;
		normalise_slider();
		slider_classes($('.hero'));
	}
})

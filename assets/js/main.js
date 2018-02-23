$(document).ready(function(){

	var win_width = $(window).width();

	var shiftValues = [0.4, 0.2, 0.1, -0.24, -0.4];
	var shiftValue_winRatio = [];
	var supaScroll = false;
	var startingX;
	var currentIndex = 1;

	get_max_shift();

	function get_max_shift(){
		shift_browser_ratio();

		console.log(shiftValue_winRatio);

		$('.background__segment').each(function(){
			var slide_index = $(this).parent().parent().index();
			var max_shift = shiftValue_winRatio[ $(this).index() ] * slide_index;
			
			$(this).find('div').attr('data-max-shift', max_shift).css('left','' + max_shift + 'px');
		})
	}

	function shift_browser_ratio(){
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
			slider_classes($(this));

			if ( currentIndex < $('.hero__slide').length ) {
				currentIndex++;
				normalise_slider(1);
			} else {
				normalise_slider(1);
			}
		} else if ( ( ( ( event.clientX + ( win_width * ( currentIndex - 1 ) ) ) - startingX ) * -1 ) < ( ( win_width / 10 ) * -1 ) ) {
			slider_classes($(this));

			if ( currentIndex > 1 ) {
				currentIndex--;
				normalise_slider(1);
			} else {
				normalise_slider(1);
			}
		} else {
			slider_classes($(this));
			normalise_slider(1);
		}

		supaScroll = false;

		setTimeout(function(){
			$('.hero').addClass('can-transition').removeClass('transitioning');			
		}, 1200)

	})

	function normalise_slider(e){
		$('.hero').css('transform','translateX(-' + ( win_width * ( currentIndex - e) ) + 'px)');

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
	}

	function background_shift(diffX){
		$('.background__segment').each(function(){
			var index = $(this).index();
			var current_shift_val = $(this).find('div').attr('data-max-shift');
			var new_offset = ( shiftValue_winRatio[index] * ( diffX / win_width ) ) + ( shiftValue_winRatio[index] * ( currentIndex - 1 ) ) 

			$(this).find('div').css('left','' + ( current_shift_val - new_offset ) + 'px');
		})
	}

	function q(o){$(".js-typer").append(e[o]),o<e.length-1&&setTimeout(function(){q(o+1)},"."==e[o]?1e3:80)}e="Hey, It's me.".split(''),q(0)

})
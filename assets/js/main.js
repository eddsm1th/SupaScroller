$(document).ready(function(){

	var shiftValues = [0.20, 0.12, 0.01, -0.24, -0.34];

	var supaScroll = false;
	var startingX;
	var currentIndex = 1;

	get_max_shift();

	function get_max_shift(){
		$('.background__segment').each(function(){
			var slide_index = $(this).parent().parent().index();
			var max_shift = ( $(window).width() * shiftValues[$(this).index()] ) * slide_index;
			
			$(this).find('div').attr('data-max-shift', max_shift).css('left', max_shift + 'px');

			$(this).parent().attr('data-slide-offset', ( ( $(window).width() * 0.2 ) * slide_index )).css('transform','translateX(-' + ( ( $(window).width() * 0.2 ) * slide_index ) + 'px)')
		})
	}

	$(document).on('mousedown touchstart', '.can-transition', function(e){

		e.preventDefault();

		startingX = event.clientX;
		supaScroll = true;

	})

	$(document).on('mousemove touchmove', '.can-transition', function(e){

		e.preventDefault();
		
		if ( supaScroll ) {
			background_shift(event.clientX - startingX);

			$(this).css('transform','translateX(' + ( ( event.clientX - startingX ) + ( ( $(window).width() * ( currentIndex - 1 ) ) * -1 ) ) + 'px)');	
		}

	})

	$(document).on('mouseup touchend', '.can-transition', function(e){

		e.preventDefault();

		if ( ( ( event.clientX - startingX ) * -1 ) > ( $(window).width() / 10 ) ) {
			slider_classes($(this));

			if ( currentIndex < $('.hero__slide').length ) {
				normalise_slider(0);
				currentIndex++;
			} else {
				normalise_slider(1);
			}
		} else if ( ( ( event.clientX - startingX ) * -1 ) < ( ( $(window).width() / 10 ) * -1 ) ) {
			slider_classes($(this));

			if ( currentIndex > 1 ) {
				normalise_slider(2);
				currentIndex--;
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
		}, 600)

	})

	function normalise_slider(e){
		$('.hero').css('transform','translateX(-' + ( $(window).width() * ( currentIndex - e) ) + 'px)');

		$('.background__segment').each(function(){
			var slide_index = $(this).parent().parent().index();
			var multiplier = slide_index - currentIndex;
			var index = $(this).index();

			$(this).find('div').addClass('transitioning').css('left', ( $(this).find('div').attr('data-max-shift') * multiplier ) + 'px' );

			setTimeout(function(){
				$('.background__segment > div').each(function(){ $(this).removeClass('transitioning'); })
			}, 600)
		})

		$('.background').each(function(){
			if ( $(this).parent().index() != 0 ) {
				$(this).addClass('transitioning').css('transform','translateX(-' + ( $(this).attr('data-slide-offset') - ( ( $(window).width() * 0.2 ) * currentIndex ) ) + 'px)');
			}

			setTimeout(function(){
				$('.background').each(function(){ $(this).removeClass('transitioning'); })
			}, 600)
		})
	}

	function slider_classes(e){
		e.removeClass('can-transition').addClass('transitioning');
	}

	function background_shift(diffX){
		$('.background').each(function(){
			if ( $(this).parent().index() != 0 ) {
				$(this).css('transform','translateX(-' + ( $(this).attr('data-slide-offset') - ( ( diffX * 0.08) * -1 ) ) + 'px)');
			}
		})

		$('.background__segment').each(function(){
			var index = $(this).index();
			var current_shift_val = $(this).find('div').attr('data-max-shift');

			var new_offset = parseInt(current_shift_val) + ( diffX * shiftValues[index] );
			console.log(new_offset);

			$(this).find('div').css('left','' + new_offset + 'px');
		})

	}

})

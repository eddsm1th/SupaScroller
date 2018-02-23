$(document).ready(function(){

	var shiftValues = [0.4, 0.2, 0.1, -0.24, -0.4];

	var supaScroll = false;
	var startingX;
	var currentIndex = 1;

	get_max_shift();

	function get_max_shift(){
		$('.background__segment').each(function(){
			var slide_index = $(this).parent().parent().index();
			var max_shift = ( $(window).width() * shiftValues[$(this).index()] ) * slide_index;
			
			$(this).find('div').attr('data-max-shift', max_shift).css('left', max_shift + 'px');
		})
	}

	$(document).on('mousedown touchstart', '.can-transition', function(e){

		e.preventDefault();

		startingX = event.clientX + ( $(window).width() * ( currentIndex - 1 ) );
		supaScroll = true;

	})

	$(document).on('mousemove touchmove', '.can-transition', function(e){

		e.preventDefault();
		
		if ( supaScroll ) {
			background_shift( ( event.clientX + ( $(window).width() * ( currentIndex - 1 ) ) ) - startingX );

			$(this).css('transform','translateX(' + ( ( ( event.clientX + ( $(window).width() * ( currentIndex - 1 ) ) ) - startingX ) + ( ( $(window).width() * ( currentIndex - 1 ) ) * -1 ) ) + 'px)');	
		}

	})

	$(document).on('mouseup touchend', '.can-transition', function(e){

		e.preventDefault();

		if ( ( ( ( event.clientX + ( $(window).width() * ( currentIndex - 1 ) ) ) - startingX ) * -1 ) > ( $(window).width() / 10 ) ) {
			console.log('right');

			slider_classes($(this));

			if ( currentIndex < $('.hero__slide').length ) {
				normalise_slider(0);
				currentIndex++;
			} else {
				normalise_slider(1);
			}
		} else if ( ( ( ( event.clientX + ( $(window).width() * ( currentIndex - 1 ) ) ) - startingX ) * -1 ) < ( ( $(window).width() / 10 ) * -1 ) ) {

			console.log('left');
			slider_classes($(this));

			currentIndex--;
			normalise_slider(1);

		} else {
			console.log('normalise');
			slider_classes($(this));
			normalise_slider(1);
		}

		supaScroll = false;

		setTimeout(function(){
			$('.hero').addClass('can-transition').removeClass('transitioning');			
		}, 1200)

	})

	function normalise_slider(e){
		$('.hero').css('transform','translateX(-' + ( $(window).width() * ( currentIndex - e) ) + 'px)');

		$('.background__segment').each(function(){
			var slide_index = $(this).parent().parent().index();
			var multiplier = slide_index - currentIndex;
			var index = $(this).index();

			var segment_shift = ( $(this).find('div').attr('data-max-shift') * multiplier );
			segment_shift += $(this).find('div').attr('data-max-shift') * ( currentIndex - 1 );

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
		$('.background').each(function(){
			if ( $(this).parent().index() != 0 ) {
				var background_offset = ( $(this).attr('data-slide-offset') - ( ( diffX * 0.08) * -1 ) );
				background_offset -= $(this).attr('data-slide-offset') * ( currentIndex - 1 ); 

				$(this).css('transform','translateX(-' + background_offset + 'px)');
			}
		})

		$('.background__segment').each(function(){
			var index = $(this).index();
			var current_shift_val = $(this).find('div').attr('data-max-shift');

			var new_offset = ( parseInt(current_shift_val) + ( diffX * shiftValues[index] ) );

			$(this).find('div').css('left','' + ( new_offset - ( parseInt(current_shift_val) * ( currentIndex - 1 ) ) ) + 'px');
		})

	}

})

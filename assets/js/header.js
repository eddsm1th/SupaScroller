$(document).ready(function(){

	var 	winWidth,
			shiftValueWinRatio = [0, 0, 0, 0, 0],
			supaScroll = false,
			startingX,
			currentIndex = 1,
			scrollAmount = 0;

	const 	shiftValues = [0.7, 0.4, 0.1, -0.3, -0.6],
			normaliseTiming = 1200,
			$contentTitle = $('.content__title'),
			$backgroundSegment = $('.background__segment'),
			$hero = $('.hero');

	init();
	$(window).resize(function(){ init(); })

	setTimeout(function(){ $hero.addClass('can-transition'); }, 3000)

	function init(){
		shift_browser_ratio();
		get_max_shift();
		text_offsetting();
	}

	function shift_browser_ratio(){
		winWidth = $(window).width();

		shiftValueWinRatio[0] = winWidth * shiftValues[0];
		shiftValueWinRatio[1] = winWidth * shiftValues[1];
		shiftValueWinRatio[2] = winWidth * shiftValues[2];
		shiftValueWinRatio[3] = winWidth * shiftValues[3];
		shiftValueWinRatio[4] = winWidth * shiftValues[4];
	}

	function get_max_shift(){
		$backgroundSegment.each(function(){
			var slideIndex = $(this).closest('.hero__slide').index(),
				maxShift = shiftValueWinRatio[ $(this).index() ],
				startingShift = maxShift * slideIndex;
			
			$(this).find('div').data('max-shift', maxShift).css('left',startingShift + 'px');
		})
	}

	function text_offsetting(){
		var sideDiff = ( ( ( ( winWidth - 1200 ) / 2 ) + 32 ) + ( winWidth * 0.05 ) );

		$contentTitle.each(function(){
			var slideIndex = $(this).closest('.hero__slide').index(),
				maxOffset = sideDiff * slideIndex;

			$(this).data('max-shift', sideDiff).css('transform','translateX(' + ( maxOffset * -1 ) + 'px)');			
		})
	}

	$(document).on('mousedown touchstart', '.hero.can-transition', function(e){
		e.preventDefault();

		startingX = event.clientX + ( winWidth * ( currentIndex - 1 ) );
		supaScroll = true;
	})

	$(document).on('mousemove touchmove', '.hero.can-transition', function(e){
		e.preventDefault();
		
		if ( supaScroll ) {
			var offset = ( ( currentIndex == 1 && event.clientX > startingX ) || ( currentIndex == $('.hero__slide').length && ( event.clientX + ( winWidth * ( $('.hero__slide').length - 1 ) ) ) < startingX ) ) ? 0.15 : 1;
			$(this).css('transform','translateX(' + get_drag_transform(offset) + 'px)');
			background_shift( ( ( event.clientX + ( winWidth * ( currentIndex - 1 ) ) ) - startingX ) * offset );
		}
	})

	function get_drag_transform(e){
		return ( ( ( ( event.clientX + ( winWidth * ( currentIndex - 1 ) ) ) - startingX ) * e ) + ( ( winWidth * ( currentIndex - 1 ) ) * -1 ) );
	}

	$(document).on('mouseup touchend', '.hero.can-transition', function(e){
		e.preventDefault();

		if ( ( ( ( event.clientX + ( winWidth * ( currentIndex - 1 ) ) ) - startingX ) * -1 ) > ( winWidth / 10 ) ) {
			if ( currentIndex < $('.hero__slide').length ) { currentIndex++; }
		} else if ( ( ( ( event.clientX + ( winWidth * ( currentIndex - 1 ) ) ) - startingX ) * -1 ) < ( ( winWidth / 10 ) * -1 ) ) {
			if ( currentIndex > 1 ) { currentIndex--; }
		}

		slider_classes($(this));
		normalise_slider();
		supaScroll = false;
	})

	function slider_classes(e){
		e.removeClass('can-transition').addClass('transitioning');

		setTimeout(function(){ $('.hero-wrapper').hasClass('active') ? e.removeClass('transitioning') : e.addClass('can-transition').removeClass('transitioning'); }, normaliseTiming)
	}

	function normalise_slider(){
		$hero.css('transform','translateX(-' + ( winWidth * ( currentIndex - 1) ) + 'px)');

		$backgroundSegment.each(function(){
			get_transition_vars($(this));
			var segmentShift = ( $(this).find('div').data('max-shift') * multiplier );
			$(this).find('div').addClass('transitioning').css('left', segmentShift + 'px' );
			remove_normalise_class($(this).find('div'));
		})

		$contentTitle.each(function(){
			get_transition_vars($(this));
			var segmentShift = ( $(this).data('max-shift') * multiplier );
			$(this).addClass('transitioning').css('transform','translateX(' + ( segmentShift * -1 ) + 'px)')
			remove_normalise_class($(this));
		})
	}

	function background_shift(diffX){
		$backgroundSegment.each(function(){
			get_transition_vars($(this));
			var current_shift_val = $(this).find('div').data('max-shift');
			$(this).find('div').css('left','' + ( ( shiftValueWinRatio[index] * ( diffX / winWidth ) ) + ( current_shift_val * multiplier ) ) + 'px');
		})

		$contentTitle.each(function(){
			get_transition_vars($(this));
			var current_shift_val = $(this).data('max-shift');
			$(this).css('transform','translateX(' + ( ( ( current_shift_val * ( diffX / winWidth ) ) + ( current_shift_val * multiplier ) ) * -1 ) + 'px)')
		})
	}

	function get_transition_vars(e){
		return 	slideIndex = e.closest('.hero__slide').index(),
				multiplier = ( slideIndex + 1 ) - currentIndex,
				index = e.index();
	}

	function remove_normalise_class(e){
		setTimeout(function(){ e.removeClass('transitioning'); }, normaliseTiming)
	}

	document.addEventListener('wheel', function(e){
		if ( !$('body').hasClass('content-active') ) { e.preventDefault(); }
		
		var scrollCompare = scrollAmount;
		scrollAmount += e.deltaY;

		if ( $hero.hasClass('can-transition') ) {
			if ( scrollAmount > scrollCompare && currentIndex < $('.hero__slide').length ) {
				scroll_wheel_shift(1);
			} else if ( scrollAmount < scrollCompare && currentIndex > 1 ) {
				scroll_wheel_shift(-1)
			}
		}
	})

	function scroll_wheel_shift(e){
		currentIndex += e;
		normalise_slider();
		slider_classes($hero);
	}

	// $('.learn-more').click(function(e){
	// 	$('body').addClass('content-active');
	// 	$('.hero-wrapper').toggleClass('active');
	// 	$('.hero').removeClass('can-transition');
	// 	$('.content__section:nth-child(' + ( currentIndex ) + ')').addClass('active');
	// })

	// $('.back').click(function(){
	// 	$('html, body').animate({
	//         scrollTop: $(".hero").offset().top
	//     }, 600);
	//     $('body').removeClass('content-active');
	// 	$('.hero-wrapper').toggleClass('active');

	// 	setTimeout(function(){
	// 		$('.content__section').removeClass('active');
	// 		$('.hero').addClass('can-transition');
	// 		$('.hero__slide').removeClass('hidden');
	// 	}, 600)
	// })
	
})

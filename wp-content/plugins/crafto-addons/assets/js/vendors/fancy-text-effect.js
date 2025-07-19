( function( $ ) {

	"use strict";

	function craftoAnimeAnimation( target, options ) {

		let child           = target;
		let staggerValue    = options.staggervalue || 0;
		let delay           = options.delay || 0;
		let anime_animation = anime.timeline();

		function applyTransitionStyles( elements ) {
			for ( let i = 0; i < elements.length; i++ ) {
				const element = elements[i];
				element.style.transition = 'none';
				if (options.willchange) {
					element.style.willChange = 'transform';
				}
			}
		}

		if ( 'childs' === options.el ) {
			child = target.children;
			applyTransitionStyles( target.children );
		}

		if ( options.perspective ) {
			target.style.perspective = `${options.perspective}px`;
		}

		if ( options.willchange ) {
			target.style.willChange = options.willchange;
		}

		anime_animation.add({
			targets: child,
			...options,
			delay: anime.stagger( staggerValue, { start: delay } ),
			complete: function () {
				if ( options.el ) {
					target.classList.add('anime-child');
					target.classList.add('anime-complete');

					for ( let i = 0; i < target.children.length; i++ ) {
						const element = target.children[i];
						element.style.removeProperty('opacity');
						element.style.removeProperty('transform');
						element.style.removeProperty('transition');

						if (target.classList.contains('grid')) {
							element.style.transition = 'none';
						}
					}

					if ( "lines" === options.el ) {
						for ( let i = 0; i < target.children.length; i++ ) {
							const element = target.children[i];
							element.classList.remove('d-inline-flex');
							element.classList.add('d-inline');
							element.style.willChange = "inherit";
						}
					}
				} else {
					target.classList.add('anime-complete');
					target.style.removeProperty('opacity');
					target.style.removeProperty('transform');
					target.style.removeProperty('transition');
				}
			}
		});
	}

	// curved text effect
	const curvedTextAnimation = (target, options) => {
		let duration = options.duration ? (options.duration <= 2000 ? 2000 : options.duration) : 2000,
				content = options.string,
				curveText = anime.timeline();

		const lineEq = (y2, y1, x2, x1, currentVal) => {
			var m = (y2 - y1) / (x2 - x1),
				b = y1 - m * x1;
			return m * currentVal + b;
		}

		curveText.add({
			targets: target.querySelectorAll( '.anime-text > .word > .char' ),
			duration: 800,
			easing: 'easeOutElastic',
			opacity: 1,
			translateY: function (el, index) {
				var p = el.parentNode,
						lastElOffW = p.lastElementChild.offsetWidth,
						firstElOffL = p.firstElementChild.offsetLeft,
						w = p.offsetWidth - lastElOffW - firstElOffL - (p.offsetWidth - lastElOffW - p.lastElementChild.offsetLeft),
						tyVal = lineEq(0, 100, firstElOffL + w / 2, firstElOffL, el.offsetLeft);
				return [Math.abs(tyVal) + '%', '0%'];
			},
			rotateZ: function (el, index) {
				var p = el.parentNode,
						lastElOffW = p.lastElementChild.offsetWidth,
						firstElOffL = p.firstElementChild.offsetLeft,
						w = p.offsetWidth - lastElOffW - p.firstElementChild.offsetLeft - (p.offsetWidth - lastElOffW - p.lastElementChild.offsetLeft),
						rz = lineEq(90, -90, firstElOffL + w, firstElOffL, el.offsetLeft);
				return [rz, 0];
			}
		}).add({
			targets: target.querySelectorAll( '.anime-text > .word > .char' ),
			duration: 1000,
			easing: 'easeInExpo',
			opacity: content.length > 1 ? 0 : 1,
			translateY: function (el, index) {
				var p = el.parentNode,
						lastElOffW = p.lastElementChild.offsetWidth,
						firstElOffL = p.firstElementChild.offsetLeft,
						w = p.offsetWidth - lastElOffW - firstElOffL - (p.offsetWidth - lastElOffW - p.lastElementChild.offsetLeft),
						tyVal = lineEq(0, 100, firstElOffL + w / 2, firstElOffL, el.offsetLeft);
				return content.length > 1 ? [-Math.abs(tyVal) + '%'] : [Math.abs(tyVal) + '%', '0%'];
			},
			rotateZ: function (el, index) {
				var p = el.parentNode,
						lastElOffW = p.lastElementChild.offsetWidth,
						firstElOffL = p.firstElementChild.offsetLeft,
						w = p.offsetWidth - lastElOffW - p.firstElementChild.offsetLeft - (p.offsetWidth - lastElOffW - p.lastElementChild.offsetLeft),
						rz = lineEq(-90, 90, firstElOffL + w, firstElOffL, el.offsetLeft);
				return content.length > 1 ? [rz] : [rz, 0];
			}
		}, duration - 1500);
	}

	// slide text effect
	const slideTextAnimation = (target, options) => {
		let current_anime_text = target.querySelectorAll('.anime-text')[0],
			speed = options.speed ? options.speed : 100;

		current_anime_text.style.position = 'relative';

		// Create slide panel div
		let tmp = document.createElement('div');
		tmp.style.width = tmp.style.height = '100%';
		tmp.style.top = tmp.style.left = 0;
		tmp.style.background = options.color ? options.color : '#fff';
		tmp.style.position = 'absolute';
		tmp.style.WebkitTransform = tmp.style.transform = 'scaleX(0)';
		tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '0% 50%';

		if ( 'left' === options.direction ) {
			tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '100% 50%';
		}
		current_anime_text.appendChild(tmp);

		// init Anime js.
		let slide_anime = anime.timeline();
		slide_anime.add({
			targets: current_anime_text.querySelectorAll('div'),
			scaleX: [0, 1],
			duration: speed + 500,
			easing: 'easeInOutCubic',
			complete: function () {
				if ( 'left' === options.direction ) {
					tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '0% 50%';
				} else {
					tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '100% 50%';
				}

				anime({
					targets: tmp,
					duration: speed + 500,
					easing: 'easeInOutCubic',
					scaleX: [1, 0],
					complete: function () {
						current_anime_text.removeChild(tmp);
						if (typeof callback === 'function') {
							callback();
						}
					}
				});
			}
		}).add({
			targets: target.querySelectorAll('.anime-text > .word > .char'),
			easing: 'easeOutQuint',
			delay: options.direction === 'left' ? anime.stagger(speed, {start: 1000}) : anime.stagger(-speed, {start: 1000}),
			opacity: [0, 1],
			translateX: options.direction === 'left' ? [100, 0] : [-100, 0]
		}, "-=600");
	}

	// wave text effect
	const waveTextAnimation = (target, options) => {
		let duration = options.duration ? options.duration : 3000,
				direction = options.direction,
				content = options.string,
				speed = options.speed,
				waveText = anime.timeline();

		waveText.add({
			targets: target.querySelectorAll('.anime-text > .word > .char'),
			opacity: [0, 1],
			translateY: direction === 'down' ? [-20, 0] : [20, 0],
			delay: anime.stagger(speed ? speed : 50)
		}).add({
			targets: target.querySelectorAll('.anime-text .word .char'),
			opacity: content.length > 1 ? [1, 0] : [1, 1],
			translateY: content.length > 1 ? (direction === 'down' ? [0, 20] : [0, -20]) : [0, 0],
			delay: anime.stagger(speed ? speed : 50, {start: duration - 1500})
		});
	}

	// smooth wave text effect
	const smoothWaveTextAnimation = (target, options) => {
		let duration = options.duration ? options.duration : 3000,
				direction = options.direction,
				content = options.string,
				speed = options.speed,
				smoothWaveText = anime.timeline();

		smoothWaveText.add({
			targets: target.querySelectorAll('.anime-text > .word > .char'),
			opacity: [0, 1],
			translateY: direction === 'down' ? [-50, 0] : [50, 0],
			duration: 500,
			easing: 'easeOutQuad',
			delay: anime.stagger(speed ? speed : 40, {direction: 'reverse'}),
		}).add({
			targets: target.querySelectorAll('.anime-text .word .char'),
			opacity: content.length > 1 ? [1, 0] : [1, 1],
			translateY: content.length > 1 ? (direction === 'down' ? 50 : -50) : 0,
			duration: 500,
			easing: 'easeOutQuad',
			delay: anime.stagger(speed ? speed : 40, {start: duration - 1000, direction: 'reverse'})
		});
	}

	// rotate text effect
	const rotateTextAnimation = (target, options) => {
		let duration = options.duration ? options.duration : 3000,
				content = options.string,
				speed = options.speed,
				rotateText = anime.timeline();

		rotateText.add({
			targets: target.querySelectorAll('.anime-text > .word > .char'),
			opacity: [0, 1],
			rotateX: [-70, 0],
			duration: 150,
			delay: anime.stagger(speed ? speed : 50),
			easing: 'linear'
		}).add({
			targets: target.querySelectorAll('.anime-text > .word > .char'),
			opacity: content.length > 1 ? 0 : 1,
			rotateX: content.length > 1 ? [0, 70] : [0, 0],
			duration: 150,
			delay: anime.stagger(speed ? speed : 50, {start: duration - 1500}),
			easing: 'linear'
		});
	}

	// jump text effect
	const jumpTextAnimation = (target, options) => {
		let duration = options.duration ? options.duration : 3000,
				content = options.string,
				speed = options.speed,
				delay = options.delay,
				movingLetter9 = anime.timeline();

		movingLetter9.add({
			targets: target.querySelectorAll('.anime-text > .word > .char'),
			scale: [0, 1],
			duration: 1500,
			elasticity: 600,
			transformOrigin: '50% 100%',
			delay: anime.stagger(speed ? speed : 45, {start: delay})
		}).add({
			targets: target.querySelectorAll('.anime-text > .word > .char'),
			opacity: content.length > 1 ? 0 : 1,
			scale: content.length > 1 ? 0 : 1,
			duration: 500,
			easing: "easeOutExpo",
			delay: anime.stagger(speed ? speed : 45)
		}, `+=${duration - 2300}`);
	}

	// zoom text effect
	const zoomTextAnimation = (target, options) => {
		let duration = options.duration ? options.duration : 3000,
				content = options.string,
				speed = options.speed,
				movingLetter2 = anime.timeline();

		movingLetter2.add({
			targets: target.querySelectorAll('.anime-text > .word > .char'),
			scale: [4, 1],
			opacity: [0, 1],
			translateZ: 0,
			easing: "easeOutExpo",
			duration: 950,
			delay: anime.stagger(speed ? speed : 70)
		}).add({
			targets: target.querySelectorAll('.anime-text > .word'),
			opacity: content.length > 1 ? 0 : 1,
			duration: 1000,
			easing: "easeOutExpo",
			delay: 1000
		}, `+=${duration - 2500}`);
	}

	// Rubber band text effect
	const rubberbandTextAnimation = (target, options) => {
		let duration   = options.duration ? options.duration : 3000,
			content    = options.string,
			speed      = options.speed,
			direction  = options.direction,
			rubberband = anime.timeline();

		rubberband.add({
			targets: target.querySelectorAll( '.anime-text > .word > .char' ),
			translateX: direction === "right" ? [-40, 0] : [40, 0],
			translateZ: 0,
			opacity: [0, 1],
			easing: 'easeOutExpo',
			duration: 1200,
			delay: anime.stagger(speed ? speed : 75, {direction: direction === "right" ? 'reverse' : 'normal'})
		}).add({
			targets: target.querySelectorAll( '.anime-text > .word > .char' ),
			translateX: content.length > 1 ? (direction === "left" ? -40 : 40) : 0,
			opacity: content.length > 1 ? 0 : 1,
			easing: 'easeInExpo',
			duration: 500,
			delay: anime.stagger(speed ? speed : 75, {start: duration - 2500, direction: direction === 'right' ? 'reverse' : 'normal'})
		});
	}

	// fade text effect
	const fadeTextAnimation = (target, options) => {
		let duration = options.duration ? options.duration : 3000,
			content  = options.string,
			speed    = options.speed,
			fade     = anime.timeline();

		fade.add({
			targets: target.querySelectorAll( '.anime-text > .word > .char' ),
			translateY: [100, 0],
			translateZ: 0,
			opacity: [0, 1],
			easing: 'easeOutExpo',
			delay: anime.stagger(speed ? speed : 30)
		}).add({
			targets: target.querySelectorAll( '.anime-text > .word > .char' ),
			translateY: content.length > 1 ? [0, -100] : [0, 0],
			opacity: content.length > 1 ? [1, 0] : [1, 1],
			easing: 'easeInExpo',
			delay: anime.stagger(speed ? speed : 40, {start: duration - 3000})
		});
	}

	/****** start fancy text  ******/
	function CraftoFancyTextDefault( item, ftOptions ) {

		let text_effect = ftOptions.effect,
			duration    = ftOptions.duration ? ftOptions.duration : 3000,
			content     = ftOptions.string,
			speed       = ftOptions.speed,
			delay       = ftOptions.delay;

		if ( content ) {
			item.innerHTML = `<span class="anime-text">${content[0]}</span>`;
			item.querySelector( '.anime-text' ).setAttribute( 'data-splitting', true );
			Splitting();

			switch ( text_effect ) {
				case 'wave':
					waveTextAnimation(item, ftOptions);
					break;
				case 'smooth-wave':
					smoothWaveTextAnimation(item, ftOptions);
					break;
				case 'curve':
					curvedTextAnimation(item, ftOptions);
					break;
				case 'rotate':
					rotateTextAnimation(item, ftOptions);
					break;
				case 'slide':
					slideTextAnimation(item, ftOptions);
					break;
				case 'jump':
					jumpTextAnimation(item, ftOptions);
					break;
				case 'zoom':
					zoomTextAnimation(item, ftOptions);
					break;
				case 'rubber-band':
					rubberbandTextAnimation(item, ftOptions);
					break;
				case 'fade':
					fadeTextAnimation(item, ftOptions);
					break;
			}

			if ( text_effect === undefined ) {
				anime({
					targets: item.querySelectorAll( '.anime-text > .word > .char' ),
					...ftOptions,
					delay: anime.stagger(speed ? speed : 0, {start: delay ? delay : 0})
				})
			}

			if ( content.length > 1 ) {
				let counter = 1;
				setInterval(function () {
					let new_el = document.createElement( 'span' );
					new_el.classList.add ('anime-text' );
					new_el.innerHTML = content[counter];
					new_el.setAttribute( 'data-splitting', true );

					item.querySelector( '.anime-text' ).replaceWith( new_el );
					Splitting();
					counter++;

					if ( counter === content.length ) {
						counter = 0;
					}

					switch ( text_effect ) {
						case 'wave':
							waveTextAnimation(item, ftOptions);
							break;
						case 'smooth-wave':
							smoothWaveTextAnimation(item, ftOptions);
							break;
						case 'curve':
							curvedTextAnimation(item, ftOptions);
							break;
						case 'rotate':
							rotateTextAnimation(item, ftOptions);
							break;
						case 'slide':
							slideTextAnimation(item, ftOptions);
							break;
						case 'jump':
							jumpTextAnimation(item, ftOptions);
							break;
						case 'zoom':
							zoomTextAnimation(item, ftOptions);
							break;
						case 'rubber-band':
							rubberbandTextAnimation(item, ftOptions);
							break;
						case 'fade':
							fadeTextAnimation(item, ftOptions);
							break;
					}

					if ( text_effect === undefined ) {
						anime({
							targets: item.querySelectorAll( '.anime-text > .word > .char' ),
							...ftOptions,
							delay: anime.stagger( speed ? speed : 0, {start: delay ? delay : 0 })
						});
					}
				}, duration );
			}
		}
	}

	$.fn.fancyTextEffectSlide = function( current_slide ) {
		let fancy_el = current_slide.querySelectorAll( '.slide-text-rotator' );
		if ( fancy_el.length > 0 ) {
			fancy_el.forEach( element => {
				let fancy_options = element.getAttribute( 'data-fancy-text' );
				if ( current_slide ) {
					$( '.swiper-slide-active .slider-title' ).removeClass( 'appear' );
				}

				if ( typeof ( fancy_options ) !== 'undefined' && fancy_options !== null ) {
					fancy_options = $.parseJSON( fancy_options );
					let child = element;
					CraftoFancyTextDefault( child, fancy_options );
					$( element ).addClass( 'appear' );
				}
			});
		}

		return this;
	}

	$.fn.animeTextEffectSlide = function( current_slide ) {
		let counter;
		let anime_el = current_slide.querySelectorAll( '.has-anime-effect' );

		if ( anime_el.length > 0 ) {
			anime_el.forEach( element => {
				let options = element.getAttribute( 'data-anime' );
				
				if ( 'undefined' !== typeof ( options ) && null !== options ) {
					options = $.parseJSON( options );

					element.classList.add( 'appear' );
					element.style.transition = 'none';

					if ( options.el ) {
						for ( counter = 0; counter < element.children.length; counter++ ) {
							element.children[counter].style.transition = 'none';
							element.children[counter].classList.add( 'appear' );
						}
					}

					craftoAnimeAnimation( element, options );
					element.classList.remove( 'appear' );
				}
			});
		}

		return this;
	}

	// Reusable function to handle applying the fancy text effect
	function applyFancyTextEffect( element, ftOptions ) {
		if ( typeof ftOptions !== 'undefined' && ftOptions !== null ) {
			ftOptions = $.parseJSON( ftOptions );
			if ( ! $( element ).hasClass( 'appear' ) ) {
				CraftoFancyTextDefault( element, ftOptions );
				$( element ).addClass( 'appear' );
			}
		}
	}

	$.fn.fancyTextEffect = function() {
		let fancy_text_rotator = $( this ).find( '.fancy-text-rotator' );
		let text_rotator       = $( this ).find( '.text-rotator' );

		if ( $( text_rotator ).length > 0 ) {
			$( text_rotator ).each( function() {
				let _this     = $( this ),
				    ftOptions = _this.attr( 'data-fancy-text' );
				if ( $( '.elementor-widget-crafto-text-rotator' ).length > 0 ) {
					applyFancyTextEffect( this, ftOptions );
				}
			});
		}
		
		if ( $( fancy_text_rotator ).length > 0 ) {
			$( fancy_text_rotator ).each( function() {
				let _this     = $( this ),
				    ftOptions = _this.attr( 'data-fancy-text' );
				_this.appear();
				if ( _this.is( ':appeared' ) ) {
					applyFancyTextEffect( this, ftOptions );
				} else {
					_this.on( 'appear', function() {
						applyFancyTextEffect( this, ftOptions );
					});
				}
			});
		}

		return this;
	};
} )( jQuery );

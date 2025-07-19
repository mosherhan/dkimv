( function ( $ ) {

	"use strict";

	var animeBreakPoint = 1199;

	/****** Get window width ******/
	function getWindowWidth() {
		return window.innerWidth;
	}

	$( document ).ready( function() {
		let $entranceElements    = $( '.entrance-animation' ),
			el_preloader_overlay = $( '.preloader-overlay' );
		if ( el_preloader_overlay.length > 0 ) {
			let checkPreloader = setInterval( function() {
				if ( el_preloader_overlay.css( 'display' ) === 'none' ) {
					clearInterval( checkPreloader );
					if ( $entranceElements.length > 0 ) {
						animeEffect( $entranceElements );
					}
				}
			}, 100);
		} else if ( $( '.grid-loading' ).length > 0 ) {
			let checkGridPreloader = setInterval( function() {
				if ( $( '.grid-loading' ).length === 0 ) {
					clearInterval( checkGridPreloader );
					if ( $entranceElements.length > 0 ) {
						animeEffect( $entranceElements );
					}
				}
			}, 100);
		} else {
			if ( $entranceElements.length > 0 ) {
				animeEffect( $entranceElements );
			}
		}

		function animeAnimation( target, options ) {
			let child           = target;
			let staggerValue    = options.staggervalue || 0;
			let delay           = options.delay || 0;
			let anime_animation = anime.timeline();
	
			function applyTransitionStyles( elements ) {
				for ( let i = 0; i < elements.length; i++ ) {
					const element = elements[i];
					element.style.transition = 'none';
					if ( options.willchange ) {
						element.style.willChange = 'transform';
					}
				}
			}

			if ( ( options.targets === undefined || options.targets === '' ) ) {
				if ( 'childs' === options.el ) {
					child = target.children;
					applyTransitionStyles( target.children );
				}
			}

			if ( 'lines' === options.el ) {
				function lineSplitting() {
					const linesData = Splitting( { target: target, by: 'lines' } );
			
					// Extract lines while preserving spaces
					const line = linesData[0].lines.map( line => 
						line.map( word => word.innerHTML ).join( " " )
					);
			
					// Set target innerHTML while preserving spaces
					target.innerHTML = line.map( item => `<span class="d-inline-flex">${item}</span>` ).join( ' ' );
			
					return target.querySelectorAll( '.d-inline-flex' );
				}
			
				child = lineSplitting();
			}

			if ( 'words' === options.el ) {
				function wordSplitting() {
					const words = Splitting( { target: target, by: 'words' } );
					return words[0].words; // Return words directly
				}
				child = wordSplitting();
			}
			
			if ( 'chars' === options.el ) {
				function charSplitting() {
					const chars = Splitting( { target: target, by: 'chars' } );
					return chars[0].chars; // Return characters directly
				}
				child = charSplitting();
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
				complete: function() {

					if ( options.el ) {
						target.classList.add( 'anime-child' );
						target.classList.add( 'anime-complete' );
						
						for ( let i = 0; i < target.children.length; i++ ) {
							const element = target.children[i];
							element.style.removeProperty( 'opacity' );
							element.style.removeProperty( 'transform' );
							element.style.removeProperty( 'transition' );
	
							if ( target.classList.contains( 'grid' ) ) {
								element.style.transition = 'none';
							}
						}

						if ( 'lines' === options.el ) {
							for ( let i = 0; i < target.children.length; i++ ) {
								const element = target.children[i];
								element.classList.remove( 'd-inline-flex' );
								element.classList.add( 'd-inline' );
								element.style.willChange = "inherit";
							}
						}
					} else if ( options.targets ) {
						target.classList.add( 'anime-complete' );
						const element = options.targets;
						$( element ).removeAttr( 'style' );
					} else {
						target.classList.add( 'anime-complete' );
						target.style.removeProperty( 'opacity' );
						target.style.removeProperty( 'transform' );
						target.style.removeProperty( 'transition' );
					}
				}
			});
		}

		// Anime text revealer js
		function slideAnimation( target, options ) {
			let duration  = options.speed ? options.speed : 100,
				direction = options.direction ? options.direction : "lr",
				delay     = options.delay ? options.delay : 0;
	
			target.style.position = 'relative';
	
			// Create slide panel div
			let tmp                  = document.createElement( 'div' );
				tmp.style.width      = tmp.style.height = '100%';
				tmp.style.top        = tmp.style.left   = 0;
				tmp.style.background = options.color ? options.color : '#fff';
				tmp.style.position   = 'absolute';
	
			if ( direction === 'lr' ) {
				tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '0% 50%';
				tmp.style.WebkitTransform = tmp.style.transform = 'scaleX(0)';
			} else if ( direction === 'tb' ) {
				tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '50% 0%';
				tmp.style.WebkitTransform = tmp.style.transform = 'scaleY(0)';
			} else if ( direction === 'bt' ) {
				tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '100% 100%';
				tmp.style.WebkitTransform = tmp.style.transform = 'scaleY(0)';
			} else {
				tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '100% 50%';
				tmp.style.WebkitTransform = tmp.style.transform = 'scaleX(0)';
			}
			target.appendChild( tmp );
	
			// init Anime js.
			let slide_anime = anime.timeline();
			slide_anime.add({
				targets: tmp,
				scaleX: ( direction === 'lr' || direction === 'rl' ) ? [0, 1] : [1, 1],
				scaleY: ( direction === 'tb' || direction === 'bt' ) ? [0, 1] : [1, 1],
				duration: duration + 500,
				easing: 'easeInOutCubic',
				delay: delay,
				complete: function() {
					if ( direction === 'lr' ) {
						tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '100% 50%';
					} else if ( direction === 'tb' ) {
						tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '50% 100%';
					} else if ( direction === 'bt' ) {
						tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '0% 0%';
					} else {
						tmp.style.WebkitTransformOrigin = tmp.style.transformOrigin = '0% 50%';
					}
	
					anime({
						targets: tmp,
						duration: duration + 500,
						easing: 'easeInOutCubic',
						scaleX: ( direction === 'lr' || direction === 'rl' ) ? [1, 0] : [1, 1],
						scaleY: ( direction === 'tb' || direction === 'bt' ) ? [1, 0] : [1, 1],
						complete: function() {
							target.removeChild( tmp );
							if ( typeof callback === 'function' ) {
								callback();
							}
						}
					});
				}
			}).add( {
				targets: target.querySelector( '*' ),
				easing: 'easeOutQuint',
				delay: direction === 'lr' ? anime.stagger( duration, { start: 1000 } ) : anime.stagger( -duration, { start: 1000 } ),
				opacity: [ 0, 1 ]
			}, "-=900" );
		}

		function animeEffect( entrance_anime_element ) {
			entrance_anime_element.each( function() {
				let _self        = $( this );
				let animeOptions = _self.attr( 'data-anime' );

				_self.appear().trigger( 'resize' );
				
				if ( animeOptions && getWindowWidth() > animeBreakPoint ) {
					animeOptions = $.parseJSON( animeOptions );
					const effect = animeOptions.effect && animeOptions.effect.toLowerCase();					
					setTimeout( () => {
						try {
							if ( _self.is( ':appeared' ) ) {
								_self.addClass( 'appear' );
								if ( 'slide' === effect ) {
									slideAnimation( this, animeOptions );
								} else {
									if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable ) {
										animeAnimation( this, animeOptions );
									}
								}
							} else {
								_self.on( 'appear', function() {
									if ( ! _self.hasClass( 'appear' ) ) {
										_self.addClass( 'appear' );
										if ( 'slide' === effect ) {
											slideAnimation( this, animeOptions );
										} else {
											if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable ) {
												animeAnimation( this, animeOptions );
											}
										}
									}

									if ( _self.hasClass( 'grid' ) ) {
										_self.find( '.grid-sizer' ).removeAttr( 'style' );
									}
								});
							}
						} catch ( error ) {
							console.error( 'Error parsing anime options:', error );
						}
					}, 100 );
				} else {
					if ( 'undefined' != typeof CraftoFrontend && '1' === CraftoFrontend.mobile_animation_disable ) {
						_self.removeAttr( 'data-anime' );
					} else {
						animeOptions = $.parseJSON( animeOptions );
						const effect = animeOptions.effect && animeOptions.effect.toLowerCase();
						setTimeout( () => {
							try {
								_self.appear();
								if ( _self.is( ':appeared' ) ) {
									_self.addClass( 'appear' );
									if ( 'slide' === effect ) {
										slideAnimation( this, animeOptions );
									} else {
										if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable ) {
											animeAnimation( this, animeOptions );
										}
									}
								} else {
									_self.on( 'appear', function() {
										if ( ! _self.hasClass( 'appear' ) ) {
											_self.addClass( 'appear' );
											if ( 'slide' === effect ) {
												slideAnimation( this, animeOptions );
											} else {
												if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable ) {
													animeAnimation( this, animeOptions );
												}
											}
										}
		
										if ( _self.hasClass( 'grid' ) ) {
											_self.find( '.grid-sizer' ).removeAttr( 'style' );
										}
									});
								}
							} catch ( error ) {
								console.error( 'Error parsing anime options:', error );
							}
						}, 100 );
					}
				}
			});
		}
	});

})( jQuery );

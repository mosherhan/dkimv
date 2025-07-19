( function( $ ) {

	"use strict";

	const $window = $( window );

	let CraftoAddonsInit = {
		init: function init() {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/crafto-post-layout.default', CraftoAddonsInit.postLayoutInit );
		},
		postLayoutInit: function( $scope ) {
			
			const animeBreakPoint   = 1199;
			const $fancyTextRotator = $( '.fancy-text-rotator' );
			const getWindowWidth    = () => window.innerWidth;

			$fancyTextRotator.each( function() {

				var $elThis = $( this );

				const el_preloader_overlay = $( '.preloader-overlay' );

				function postCheckPreloader() {
					if ( el_preloader_overlay.length > 0 ) {
						let checkPreloader = setInterval( function() {
							if ( el_preloader_overlay.css( 'display' ) === 'none' ) {
								clearInterval( checkPreloader );
								$scope.fancyTextEffect();
							}
						}, 10 );
					} else {
						$scope.fancyTextEffect();
					}
				}

				if ( $elThis.length > 0  && 'undefined' != typeof CraftoFrontend && 'undefined' != typeof CraftoMain && $.inArray( 'appear', CraftoMain.disable_scripts ) < 0  && $.inArray( 'anime', CraftoMain.disable_scripts ) < 0 ) {
					if ( getWindowWidth() > animeBreakPoint ) {
						if ( '0' === CraftoFrontend.all_animations_disable ) {
							postCheckPreloader();
						}
					} else {
						if ( '1' === CraftoFrontend.mobile_animation_disable ) {
							if ( el_preloader_overlay.length > 0 ) {
								let checkPreloader = setInterval( function() {
									if ( el_preloader_overlay.css( 'display' ) === 'none' ) {
										clearInterval( checkPreloader );
										$elThis.removeAttr( 'data-fancy-text' );
									}
								}, 10 );
							} else {
								$elThis.removeAttr( 'data-fancy-text' );
							}
						} else {
							postCheckPreloader();
						}
					}
				}
			});
				
			// Parallax background and layout
			const $elParallaxBackground = $( '.has-parallax-background' );
			const $elParallaxLayout     = $( '.has-parallax-layout' );
			if ( 'undefined' != typeof CraftoMain && $.inArray( 'custom-parallax', CraftoMain.disable_scripts ) < 0 && $.fn.parallax ) {
				if ( $elParallaxBackground.length > 0 ) {
					$elParallaxBackground.each( function() {
						const ratio = parseFloat( $( this ).attr( 'data-parallax-background-ratio' ) || 0.5 );
						$( this ).parallax( '50%', ratio );
					});
				}

				if ( $elParallaxLayout.length > 0 ) {
					$elParallaxLayout.each( function() {
						const ratio = parseFloat( $( this ).attr( 'data-parallax-layout-ratio' ) || 1 );
						$( this ).parallaxImg( '50%', ratio );
					});
				}
			}
		},
	}

	$window.on( 'elementor/frontend/init', CraftoAddonsInit.init );

})(	jQuery );

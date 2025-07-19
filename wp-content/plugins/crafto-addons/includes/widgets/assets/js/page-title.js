( function( $ ) {

	"use strict";

	let CraftoAddonsInit = {
		init: function init() {
			elementorFrontend.hooks.addAction( 'frontend/element_ready/crafto-page-title.default', CraftoAddonsInit.pageTitleInit );
		},
		pageTitleInit: function( $scope ) {
			const $fancyTextRotator = $( '.fancy-text-rotator' );
			const getWindowWidth    = () => window.innerWidth;
			const animeBreakPoint   = 1199;

			$fancyTextRotator.each( function() {
				var $elThis = $( this );

				const el_preloader_overlay = $( '.preloader-overlay' );

				function pagetitleCheckPreloader() {
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

				if (  'undefined' != typeof CraftoFrontend && $elThis.length > 0  && 'undefined' != typeof CraftoMain && $.inArray( 'appear', CraftoMain.disable_scripts ) < 0  && $.inArray( 'anime', CraftoMain.disable_scripts ) < 0 ) {
					if ( getWindowWidth() > animeBreakPoint ) {
						if ( '0' === CraftoFrontend.all_animations_disable ) {
							pagetitleCheckPreloader();
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
							pagetitleCheckPreloader();
						}
					}
				}
			});

			const $target = $( '.crafto-main-title-wrap', $scope ).first();

			if ( 0 === $target.length ) {
				return;
			}

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

			const $elPageTitleSlider = $( '.page-title-slider' );
			if ( $elPageTitleSlider.length > 0  && 'undefined' != typeof CraftoMain && $.inArray( 'swiper', CraftoMain.disable_scripts ) < 0 ) {
				let sliderAutoFade = new Swiper( '.page-title-slider', {
					loop: true,
					slidesPerView: 1,
					effect: 'fade',
					navigation: {
						nextEl: '.swiper-auto-next',
						prevEl: '.swiper-auto-prev'
					},
					keyboard: {
						enabled: true,
						onlyInViewport: true
					},
					autoplay: {
						delay: 3000,
						disableOnInteraction: false
					},
					fadeEffect: {
						crossFade: true
					},
					on: {
						resize: function() {
							this.update();
						}
					}
				});
			}
		},
	}

	// If Elementor is already initialized, manually trigger
	$( window ).on( 'elementor/frontend/init', CraftoAddonsInit.init );

})(	jQuery );

( function ( $ ) {

	"use strict";

	var elementType;
	var editorElements;
	var sectionData = '';
	var get_entrance_anime = '';
	var tabletBreakPoint = 991;
	var timer;

	if ( checkUndefinedVal( elementorFrontendConfig ) ) {
		if ( checkUndefinedVal( elementorFrontendConfig.breakpoints ) ) {
			if ( checkUndefinedVal( elementorFrontendConfig.breakpoints.lg ) ) {
				tabletBreakPoint = elementorFrontendConfig.breakpoints.lg - 1;
			}
		}
	}

	function checkOptionVal( $Optval, $comparedVal ) {
		if ( checkUndefinedVal( $Optval ) && '' !== $Optval && $Optval !== $comparedVal ) {
			return true;
		}
		return false;
	};

	function checkUndefinedVal( $Optval ) {
		if ( 'undefined' != typeof $Optval ) {
			return true;
		}
		return false;
	};

	// Get window width
	function getWindowWidth() {
		return window.innerWidth;
	}

	var skroller;
	function initSkrollr() {
		if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable && 'undefined' != typeof CraftoMain && $.inArray( 'skrollr', CraftoMain.disable_scripts ) < 0 ) {
			if ( typeof skrollr !== 'undefined' && typeof skrollr !== null ) {
				skroller = skrollr.init( {
					'forceHeight': false,
					'smoothScrollingDuration': 1000,
					'mobileCheck': function () {
						return false;
					}
				});
			}
		}
	}

	let timerreSkrollr;
	function reInitSkrollr() {
		if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable && 'undefined' != typeof CraftoMain && $.inArray( 'skrollr', CraftoMain.disable_scripts ) < 0 ) {
			destroySkrollr();
			if ( getWindowWidth() >= 1200 ) {
				clearTimeout( timerreSkrollr );
				timerreSkrollr = setTimeout( function() {
					initSkrollr();
				}, 1000 );
			}
		}
	}

	function destroySkrollr() {
		if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable && 'undefined' != typeof CraftoMain && $.inArray( 'skrollr', CraftoMain.disable_scripts ) < 0 ) {
			if ( typeof skroller !== typeof undefined && skroller != 'undefined' ) {
				skroller.destroy();
			}
		}
	}

	if ( getWindowWidth() >= 1200 ) {
		if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable && 'undefined' != typeof CraftoMain && $.inArray( 'skrollr', CraftoMain.disable_scripts ) < 0 ) {
			initSkrollr();
		}
	}

	$( window ).on( 'resize', function () {
		if ( getWindowWidth() <= 1199 ) {
			destroySkrollr();
		} else {
			initSkrollr();
		}
	});

	let CraftoAddonsInit = {
		init: function init() {
			elementorFrontend.hooks.addAction('frontend/element_ready/container', CraftoAddonsInit.elementorSection);
			elementorFrontend.hooks.addAction('frontend/element_ready/widget', CraftoAddonsInit.elementorWidget);

			if ( $( 'body' ).hasClass( 'adaptive-bg-color-enabled' ) ) {
				$( '[data-elementor-type="wp-page"]' ).before( '<div class="adaptive-wrapper"><div class="custom-adaptive-background"></div></div>' );

				function applyBackgroundColor() {
				    var $elPageMainSection = $( '.crafto-page-main-section .e-parent' );

					if ( $elPageMainSection.length > 0 ) {

						$elPageMainSection.each(function () {
							var _this = this;
							requestAnimationFrame( function () {
								var bgColor = $( _this ).css( 'background-color' );

								if ( bgColor === 'rgba(0, 0, 0, 0)' ) {
									return;
								}

								if ( bgColor.startsWith('rgba') && window.elementorFrontend.isEditMode() ) {
									bgColor = removeAlphaFromRgba(bgColor);
								}

								$( _this ).attr( 'adaptive-bg', bgColor );
							});
						});
					}
				}

				const removeAlphaFromRgba = ( rgba ) => {
					const rgbaParts = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
					if ( rgbaParts ) {
						return `rgb(${rgbaParts[1]}, ${rgbaParts[2]}, ${rgbaParts[3]})`;
					}
					return rgba;
				};

				function runAdaptiveBG() {
					function checkAndRun() {
						var adaptiveEls = $('[adaptive-bg]');
						if ( adaptiveEls.length === 0 ) {
							// Wait and try again
							setTimeout( checkAndRun, 100 );
							return;
						}
						CraftoAddonsInit.globalInit(); // Now safe to run
					}

					applyBackgroundColor();
					setTimeout( checkAndRun, 150 ); // let requestAnimationFrame apply attributes
				}

				if ( window.elementorFrontend && window.elementorFrontend.isEditMode() ) {
					elementorFrontend.hooks.addAction( 'frontend/element_ready/global', runAdaptiveBG() );
				} else {
					$( window ).on( 'load', runAdaptiveBG() ); // ← use full window load for best timing
				}
			}
		},

		globalInit: function() {
			if ( ! $( 'body' ).hasClass( 'adaptive-bg-color-enabled' ) ) {
				return;
			}

			window.sections = [...document.querySelectorAll('[adaptive-bg]')];
			if ( window.sections.length === 0 ) {
				return;
			}

			window.lastScrollTop = window.pageYOffset;
			let activeSection;

			onScroll();
			window.addEventListener( 'scroll', onScroll );

			function onScroll() {
				if ( window.sections.length === 0 ) {
					return;
				}

				const section = window.sections
					.map( section => {
						const rect = section.getBoundingClientRect();
						return { el: section, rect };
					})
					.find( section => section.rect.bottom >= ( window.innerHeight * 0.5 ) );

				if ( section && section.el !== activeSection ) {
					activeSection   = section.el;
					const sectionBg       = activeSection.getAttribute( 'adaptive-bg' );
					const parentContainer = document.querySelector( '.custom-adaptive-background' );
					document.querySelectorAll( '[adaptive-bg]' ).forEach( item => item.classList.remove( 'adaptive-active' ) );
					activeSection.classList.add( 'adaptive-active' );

					if ( sectionBg && parentContainer ) {
						anime({
							targets: parentContainer,
							backgroundColor: sectionBg,
							duration: 1000,
							easing: 'easeInOutQuad'
						});
					}
				}
			}
		},
		commonDataCollect: function ( commonId, elementType ) {
			if ( ! window.elementor.hasOwnProperty( 'elements' ) ) {
				return false;
			}
			editorElements = window.elementor.elements;

			if ( ! editorElements.models ) {
				return false;
			}

			var sectionData = '';
			function get_sectionData( index, obj ) {
				if ( 0 < Object.keys( sectionData ).length ) {
					return;
				} else if ( commonId == obj.id ) {
					sectionData = obj.attributes.settings.attributes;
				} else if ( obj.attributes && obj.attributes.elements && obj.attributes.elements.models ) {
					$.each( obj.attributes.elements.models, get_sectionData );
				}
			}
			$.each( editorElements.models, get_sectionData );
			return sectionData;
		},
		commonAnimationScope( $scope ) {
			var commonId    = $scope.data( 'id' );
			var elementType = $scope.attr( 'data-element_type' );
			var editMode    = Boolean( elementorFrontend.isEditMode() );
			if ( editMode ) {
				var scrollingUp       = CraftoAddonsInit.renderScrollingUp( commonId, elementType );
				var scrollingDown     = CraftoAddonsInit.renderScrollingDown( commonId, elementType );
				var widthExpand       = CraftoAddonsInit.renderWidth( commonId, elementType );
				var widthExpandCenter = CraftoAddonsInit.renderWidthCenter( commonId, elementType );
				var entranceAnimation = CraftoAddonsInit.renderEntranceAnimation( commonId, elementType );
				
				if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.editor_scrollable_disable ) {
					if ( 'undefined' !== typeof scrollingUp && '' !== scrollingUp ) {
						$scope.removeAttr( 'data-bottom-top data-center-top' );
						$scope.attr( 'data-bottom-top', scrollingUp );
					} else if ( checkOptionVal( widthExpand ) ) {
						$scope.attr( 'data-bottom-top', widthExpand );
					} else {
						$scope.removeAttr( 'data-bottom-top data-center-top' );
					}

					if ( 'undefined' !== typeof scrollingDown && '' !== scrollingDown ) {
						$scope.removeAttr( 'data-top-bottom' );
						$scope.attr( 'data-top-bottom', scrollingDown );
					} else {
						$scope.removeAttr( 'data-top-bottom' );
					}

					if ( 'undefined' !== typeof widthExpandCenter && '' !== widthExpandCenter ) {
						$scope.removeAttr( 'data-center-top data-top-bottom' );
						$scope.attr( 'data-center-top', widthExpandCenter );
						$scope.addClass( 'mx-auto' );
					} else {
						$scope.removeClass( 'mx-auto' );
						$scope.removeAttr( 'data-center-top' );
					}
				}
				if ( 'undefined' != typeof CraftoFrontend && '1' === CraftoFrontend.editor_entrance_disable || 'undefined' === entranceAnimation ) {
					var entranceEditor = $( '.entrance-animation' );
					entranceEditor.each( function () {
						$( this ).removeAttr( 'data-anime' );
					});
				} else {
					if ( 'undefined' !== typeof entranceAnimation && '' !== entranceAnimation ) {
						$scope.attr( 'data-anime', '{' + entranceAnimation + '}');
						$scope.addClass( 'entrance-animation' );
					} 
					if ( 'undefined' === typeof entranceAnimation ) {
						var scope_anime = $scope.hasClass('entrance-animation');
						if ( scope_anime ) {
							$scope.removeAttr( 'data-anime' );
							$scope.removeClass( 'appear anime-complete entrance-animation' );
						}
					}
				}
				if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable ) {
					CraftoAddonsInit.renderFloatEffect( commonId, elementType, $scope );
				}
			}
		},
		renderEntranceAnimation: function ( commonId, elementType ) {
			if ( 'undefined' === typeof window.elementor ) {
				return;
			}

			sectionData = CraftoAddonsInit.commonDataCollect( commonId, elementType );
			if ( 'yes' === sectionData['crafto_ent_settings'] ) {

				var el_entrance_anime_collect = '';
				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_ease' ], 'none' ) ) {
					el_entrance_anime_collect += '"easing": "' + sectionData['crafto_ent_anim_opt_ease'] + '"' + ',';
				}
				
				var target_id = '.elementor-element-' + commonId + '.entrance-animation';
				if ( 'yes' === sectionData['crafto_ent_anim_item_by_item'] && elementType === 'widget' ) {
					$( '.elementor-element-' + commonId + '.elementor-widget' ).each(function() {
						var widgetName = $( this ).attr( 'class' ).match(/elementor-widget-(\S+)/);
						if ( widgetName ) {
							widgetName = widgetName[1];
							if ( widgetName === 'crafto-accordion' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .elementor-accordion > .elementor-accordion-item"' + ',';
							}
							if ( widgetName === 'crafto-icon-box' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .crafto-icon-box-wrapper"' + ',';
							}
							if ( widgetName === 'crafto-media-gallery' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > ul > li"' + ',';
							}
							if ( widgetName === 'crafto-lists' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > ul > li"' + ',';
							}
							if ( widgetName === 'crafto-sliding-box' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .sliding-box > .sliding-box-main"' + ',';
							}
							if ( widgetName === 'crafto-process-step' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .process-step-box > .process-step-item"' + ',';
							}
							if ( widgetName === 'crafto-blog-list' || widgetName === 'crafto-archive-blog' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > ul > .grid-item > .blog-post"' + ',';
							}
							if ( widgetName === 'crafto-video-button' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .video-button-wrap"' + ',';
							}
							if ( widgetName === 'crafto-tabs' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .crafto-tabs > ul > li, ' + target_id +' > .elementor-widget-container > .crafto-tabs > .crafto-container-wrap > ul > li "' + ',';
							}
							if ( widgetName === 'crafto-timeline' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .timeline-box > .timeline-item"' + ',';
							}
							if ( widgetName === 'crafto-property' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .property-wrapper > ul > li > .property-details-content-wrap"' + ',';
							}
							if ( widgetName === 'crafto-portfolio' || widgetName === 'crafto-archive-portfolio' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .filter-content > ul > li > .portfolio-box-warp, ' + target_id +' > .elementor-widget-container > .filter-content > .portfolio-justified-gallery > .grid-item > .anime-wrap"' + ',';
							}
							if ( widgetName === 'crafto-tours' || widgetName === 'crafto-archive-tours' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .tours-packages-wrapper > ul > li > .tours-box-content-wrap"' + ',';
							}
							if ( widgetName === 'crafto-social-icons' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .social-icons-wrapper > ul > li"' + ',';
							}
							if ( widgetName === 'crafto-product-taxonomy' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > ul > li > .categories-box"' + ',';
							}
							if ( widgetName === 'crafto-post-taxonomy' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .post-taxonomy-list > ul > li"' + ',';
							}
							if ( widgetName === 'crafto-product-list' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > ul > li > .shop-box"' + ',';
							}
							if ( widgetName === 'crafto-image-gallery' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > ul > li > .gallery-box"' + ',';
							}
							if ( widgetName === 'crafto-text-rotator' ) {
								el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget-container > .crafto-text-rotator > .text-rotate-title,' + target_id +' > .elementor-widget-container > .crafto-text-rotator > .text-rotator"' + ',';
							}
							if ( widgetName === 'crafto-content-slider' ) {
								el_entrance_anime_collect += '"targets": "' + target_id + '.el-content-carousel-style-7 > .elementor-widget-container > .content-carousel-content-box > .carousel-content > .content-box > .heading,' + target_id + '.el-content-carousel-style-7 > .elementor-widget-container > .content-carousel-content-box > .carousel-content > .content-box > .content,' + target_id + '.el-content-carousel-style-7 > .elementor-widget-container > .content-carousel-content-box > .carousel-content > .content-box > .crafto-button-wrapper"' + ',';
							}
						}
					});
				}

				if ( 'yes' === sectionData['crafto_ent_anim_item_by_item'] && elementType === 'container' ) {
					el_entrance_anime_collect += '"targets": "' + target_id +' > .elementor-widget, ' + target_id +' > .e-con-inner > .elementor-widget, ' + target_id +' > .e-child, ' + target_id +' > .e-con-inner > .e-con-full.e-child"' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_duration' ]['size'] ) ) {
					el_entrance_anime_collect += '"duration": ' + sectionData['crafto_ent_anim_opt_duration']['size'] + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_stagger' ]['size'] ) ) {
					el_entrance_anime_collect += '"staggervalue": ' + sectionData['crafto_ent_anim_opt_stagger']['size'] + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_start_delay' ]['size'] ) ) {
					el_entrance_anime_collect += '"delay": ' + sectionData['crafto_ent_anim_opt_start_delay']['size'] + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_translate_x']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_translate_y']['size'], 0 ) ) {
					el_entrance_anime_collect += '"translate": [' + sectionData['crafto_ent_anim_opt_translate_x']['size'] + ',' + sectionData['crafto_ent_anim_opt_translate_y']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_translate_xx']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_translate_xy']['size'], 0 ) ) {
					el_entrance_anime_collect += '"translateX": [' + sectionData['crafto_ent_anim_opt_translate_xx']['size'] + ',' + sectionData['crafto_ent_anim_opt_translate_xy']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_translate_yx']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_translate_yy']['size'], 0 ) ) {
					el_entrance_anime_collect += '"translateY": [' + sectionData['crafto_ent_anim_opt_translate_yx']['size'] + ',' + sectionData['crafto_ent_anim_opt_translate_yy']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_translate_zx']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_translate_zy']['size'], 0 ) ) {
					el_entrance_anime_collect += '"translateZ": [' + sectionData['crafto_ent_anim_opt_translate_zx']['size'] + ',' + sectionData['crafto_ent_anim_opt_translate_zy']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_x_opacity']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_y_opacity']['size'], 1 ) ) {
					el_entrance_anime_collect += '"opacity": [' + sectionData['crafto_ent_anim_opt_x_opacity']['size'] + ',' + sectionData['crafto_ent_anim_opt_y_opacity']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_x_zoom']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_y_zoom']['size'], 0 ) ) {
					el_entrance_anime_collect += '"zoom": [' + sectionData['crafto_ent_anim_opt_x_zoom']['size'] + ',' + sectionData['crafto_ent_anim_opt_y_zoom']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_rotation_xx']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_rotation_xy']['size'], 0 ) ) {
					el_entrance_anime_collect += '"rotateX": [' + sectionData['crafto_ent_anim_opt_rotation_xx']['size'] + ',' + sectionData['crafto_ent_anim_opt_rotation_xy']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_rotation_yx']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_rotation_yy']['size'], 0 ) ) {
					el_entrance_anime_collect += '"rotateY": [' + sectionData['crafto_ent_anim_opt_rotation_yx']['size'] + ',' + sectionData['crafto_ent_anim_opt_rotation_yy']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_rotation_zx']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_rotation_zy']['size'], 0 ) ) {
					el_entrance_anime_collect += '"rotateZ": [' + sectionData['crafto_ent_anim_opt_rotation_zx']['size'] + ',' + sectionData['crafto_ent_anim_opt_rotation_zy']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_perspective_x']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_perspective_y']['size'], 0 ) ) {
					el_entrance_anime_collect += '"perspective": [' + sectionData['crafto_ent_anim_opt_perspective_x']['size'] + ',' + sectionData['crafto_ent_anim_opt_perspective_y']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_scale_x']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_scale_y']['size'], 0 ) ) {
					el_entrance_anime_collect += '"scale": [' + sectionData['crafto_ent_anim_opt_scale_x']['size'] + ',' + sectionData['crafto_ent_anim_opt_scale_y']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_scale_y_start']['size'], 0 ) || checkOptionVal( sectionData['crafto_ent_anim_opt_scale_y_end']['size'], 0 ) ) {
					el_entrance_anime_collect += '"scaleY": [' + sectionData['crafto_ent_anim_opt_scale_y_start']['size'] + ',' + sectionData['crafto_ent_anim_opt_scale_y_end']['size'] + ']' + ',';
				}

				if ( checkOptionVal( sectionData['crafto_ent_anim_opt_clippath_x']['top'] ) || checkOptionVal( sectionData['crafto_ent_anim_opt_clippath_x']['right'] ) || checkOptionVal( sectionData['crafto_ent_anim_opt_clippath_x']['bottom'] ) || checkOptionVal( sectionData['crafto_ent_anim_opt_clippath_x']['left'] ) || checkOptionVal( sectionData['crafto_ent_anim_opt_clippath_y']['top'] ) || checkOptionVal( sectionData['crafto_ent_anim_opt_clippath_y']['right'] ) || checkOptionVal( sectionData['crafto_ent_anim_opt_clippath_y']['bottom'] ) || checkOptionVal( sectionData['crafto_ent_anim_opt_clippath_y']['left'] ) ) {
					el_entrance_anime_collect += '"clipPath": ["inset(' + sectionData['crafto_ent_anim_opt_clippath_x']['top'] + 'px ' + sectionData['crafto_ent_anim_opt_clippath_x']['right'] + 'px ' + sectionData['crafto_ent_anim_opt_clippath_x']['bottom'] + 'px ' + sectionData['crafto_ent_anim_opt_clippath_x']['left'] + 'px' + ')",' + '"inset(' + sectionData['crafto_ent_anim_opt_clippath_y']['top'] + 'px ' + sectionData['crafto_ent_anim_opt_clippath_y']['right'] + 'px ' + sectionData['crafto_ent_anim_opt_clippath_y']['bottom'] + 'px ' + sectionData['crafto_ent_anim_opt_clippath_y']['left'] + 'px' + ')"' + ']' + ',';
				}

				get_entrance_anime = el_entrance_anime_collect.replace( /,\s*$/, "" );

				if ( '' !== get_entrance_anime ) {
					return get_entrance_anime;
				}
			}
		},
		renderScrollingUp: function( commonId, elementType ) {
			if ( 'undefined' === typeof window.elementor ) {
				return;
			}
			
			var sectionData = CraftoAddonsInit.commonDataCollect( commonId, elementType );
			if ( 'yes' === sectionData['crafto_animation_settings'] ) {
				var crafto_scrollup_translate_collect   = '';
				var crafto_scrollup_filter_collect      = '';
				var crafto_scrollup_translate_attr      = '';
				var crafto_scrollup_filter_attr         = '';
				var crafto_scrollup_blur_filter_collect = '';
				var crafto_scrollup_blur_filter_attr    = '';
				
				if ( 'undefined' != typeof sectionData['crafto_scrolling_up_translate_x']['size'] && '' !== sectionData['crafto_scrolling_up_translate_x']['size'] &&
					'undefined' != typeof sectionData['crafto_scrolling_down_translate_x']['size'] && '' !== sectionData['crafto_scrolling_down_translate_x']['size'] &&
					sectionData['crafto_scrolling_up_translate_x']['size'] !== sectionData['crafto_scrolling_down_translate_x']['size']
				) {
					crafto_scrollup_translate_collect += 'translateX(' + sectionData['crafto_scrolling_up_translate_x']['size'] + sectionData['crafto_scrolling_up_translate_x']['unit'] + ')';
				}

				if ( 'undefined' != typeof sectionData['crafto_scrolling_up_translate_y']['size'] && '' !== sectionData['crafto_scrolling_up_translate_y']['size'] &&
					'undefined' != typeof sectionData['crafto_scrolling_down_translate_y']['size'] && '' !== sectionData['crafto_scrolling_down_translate_y']['size'] &&
					sectionData['crafto_scrolling_up_translate_y']['size'] !== sectionData['crafto_scrolling_down_translate_y']['size']
				) {
					crafto_scrollup_translate_collect += ' translateY(' + sectionData['crafto_scrolling_up_translate_y']['size'] + sectionData['crafto_scrolling_up_translate_y']['unit'] + ')';
				}

				if ( 'undefined' != typeof sectionData['crafto_scrolling_up_translate_z']['size'] && '' !== sectionData['crafto_scrolling_up_translate_z']['size'] &&
					'undefined' != typeof sectionData['crafto_scrolling_down_translate_z']['size'] && '' !== sectionData['crafto_scrolling_down_translate_z']['size'] &&
					sectionData['crafto_scrolling_up_translate_z']['size'] !== sectionData['crafto_scrolling_down_translate_z']['size']
				) {
					crafto_scrollup_translate_collect += ' translateZ(' + sectionData['crafto_scrolling_up_translate_z']['size'] + sectionData['crafto_scrolling_up_translate_z']['unit'] + ')';
				}

				if ( 'undefined' != typeof sectionData['crafto_scrolling_up_rotation']['size'] && '' !== sectionData['crafto_scrolling_up_rotation']['size'] &&
					'undefined' != typeof sectionData['crafto_scrolling_down_rotation']['size'] && '' !== sectionData['crafto_scrolling_down_rotation']['size'] &&
					sectionData['crafto_scrolling_up_rotation']['size'] !== sectionData['crafto_scrolling_down_rotation']['size']
				) {
					crafto_scrollup_translate_collect += ' rotate(' + sectionData['crafto_scrolling_up_rotation']['size'] + sectionData['crafto_scrolling_up_rotation']['unit'] + ')';
				}

				if ( ( '' != sectionData['crafto_scrolling_up_scale_x']['size'] ) || ( sectionData['crafto_scrolling_down_scale_x']['size'] != sectionData['crafto_scrolling_up_scale_x']['size'] ) ) {
					crafto_scrollup_translate_collect += ' scale(' + sectionData['crafto_scrolling_up_scale_x']['size'] + ')';
				}

				if ( 'undefined' != typeof sectionData['crafto_scrolling_up_translate3d_tx']['size'] && '' !== sectionData['crafto_scrolling_up_translate3d_tx']['size'] &&
				'undefined' != typeof sectionData['crafto_scrolling_up_translate3d_ty']['size'] && '' !== sectionData['crafto_scrolling_up_translate3d_ty']['size'] &&
				'undefined' != typeof sectionData['crafto_scrolling_up_translate3d_tz']['size'] && '' !== sectionData['crafto_scrolling_up_translate3d_tz']['size'] &&
				'undefined' != typeof sectionData['crafto_scrolling_down_translate3d_tx']['size'] && '' !== sectionData['crafto_scrolling_down_translate3d_tx']['size'] &&
				'undefined' != typeof sectionData['crafto_scrolling_down_translate3d_ty']['size'] && '' !== sectionData['crafto_scrolling_down_translate3d_ty']['size'] &&
				'undefined' != typeof sectionData['crafto_scrolling_down_translate3d_tz']['size'] && '' !== sectionData['crafto_scrolling_down_translate3d_tz']['size'] &&
				sectionData['crafto_scrolling_up_translate3d_tx']['size'] !== sectionData['crafto_scrolling_down_translate3d_tx']['size'] ||
				sectionData['crafto_scrolling_up_translate3d_ty']['size'] !== sectionData['crafto_scrolling_down_translate3d_ty']['size'] ||
				sectionData['crafto_scrolling_up_translate3d_tz']['size'] !== sectionData['crafto_scrolling_down_translate3d_tz']['size']
				) {	
					crafto_scrollup_translate_collect += ' translate3d(' + sectionData['crafto_scrolling_up_translate3d_tx']['size'] + sectionData['crafto_scrolling_up_translate3d_tx']['unit'] + ',' + sectionData['crafto_scrolling_up_translate3d_ty']['size'] + sectionData['crafto_scrolling_up_translate3d_ty']['unit'] + ',' + sectionData['crafto_scrolling_up_translate3d_tz']['size'] + sectionData['crafto_scrolling_up_translate3d_tz']['unit'] + ')';
				}

				var scroll_up_filter_opacity = sectionData['crafto_scrolling_up_filter_opacity']['size'].toString();
				if ( scroll_up_filter_opacity != '' ) {
					crafto_scrollup_filter_collect += ' opacity(' + sectionData['crafto_scrolling_up_filter_opacity']['size'] + ')';
				}

				var scroll_up_filter_blur = sectionData['crafto_scrolling_up_filter_blur']['size'].toString();
				if ( '' != scroll_up_filter_blur ) {
					crafto_scrollup_blur_filter_collect += ' blur(' + sectionData['crafto_scrolling_up_filter_blur']['size'] + sectionData['crafto_scrolling_up_filter_blur']['unit'] + ')';
				}

				if ( 'undefined' != crafto_scrollup_blur_filter_collect && '' != crafto_scrollup_blur_filter_collect ) {
					crafto_scrollup_blur_filter_attr = "filter:" + crafto_scrollup_blur_filter_collect;
				}

				if ( '' !== crafto_scrollup_translate_collect ) {
					crafto_scrollup_translate_attr = "transform:" + crafto_scrollup_translate_collect;
				}

				if ( '' != crafto_scrollup_filter_collect ) {
					crafto_scrollup_filter_attr = "filter:" + crafto_scrollup_filter_collect;
				}

				if ( crafto_scrollup_blur_filter_collect ) {
					return crafto_scrollup_blur_filter_attr + ( crafto_scrollup_blur_filter_attr ? '; ' : '' ) + crafto_scrollup_translate_attr;
				} else {
					return crafto_scrollup_filter_attr + ( crafto_scrollup_filter_attr ? ';' : '' ) + crafto_scrollup_translate_attr;
				}
			}
		},
		renderScrollingDown: function( commonId, elementType ) {
			if ( 'undefined' === typeof window.elementor ) {
				return;
			}

			var sectionData = CraftoAddonsInit.commonDataCollect( commonId, elementType );
			if ( 'yes' === sectionData['crafto_animation_settings'] ) {
				var crafto_scrolldown_translate_collect   = '';
				var crafto_scrolldown_filter_collect      = '';
				var crafto_scrolldown_blur_filter_collect = '';
				var crafto_scrolldown_translate_attr      = '';
				var crafto_scrolldown_filter_attr         = '';
				var crafto_scrolldown_blur_filter_attr    = '';

				if ( 'undefined' != typeof sectionData['crafto_scrolling_down_translate_x']['size'] && '' !== sectionData['crafto_scrolling_down_translate_x']['size'] &&
					sectionData['crafto_scrolling_up_translate_x']['size'] !== sectionData['crafto_scrolling_down_translate_x']['size']
				) {
					crafto_scrolldown_translate_collect += 'translateX(' + sectionData['crafto_scrolling_down_translate_x']['size'] + sectionData['crafto_scrolling_down_translate_x']['unit'] + ')';
				}

				if ( 'undefined' != typeof sectionData['crafto_scrolling_up_translate_y']['size'] && '' !== sectionData['crafto_scrolling_up_translate_y']['size'] &&
					'undefined' != typeof sectionData['crafto_scrolling_down_translate_y']['size'] && '' !== sectionData['crafto_scrolling_down_translate_y']['size'] &&
					sectionData['crafto_scrolling_up_translate_y']['size'] !== sectionData['crafto_scrolling_down_translate_y']['size']
				) {
					crafto_scrolldown_translate_collect += ' translateY(' + sectionData['crafto_scrolling_down_translate_y']['size'] + sectionData['crafto_scrolling_down_translate_y']['unit'] + ')';
				}

				if ( 'undefined' != typeof sectionData['crafto_scrolling_up_translate_z']['size'] && '' !== sectionData['crafto_scrolling_up_translate_z']['size'] &&
					'undefined' != typeof sectionData['crafto_scrolling_down_translate_z']['size'] && '' !== sectionData['crafto_scrolling_down_translate_z']['size'] &&
					sectionData['crafto_scrolling_up_translate_z']['size'] !== sectionData['crafto_scrolling_down_translate_z']['size']
				) {
					crafto_scrolldown_translate_collect += ' translateZ(' + sectionData['crafto_scrolling_down_translate_z']['size'] + sectionData['crafto_scrolling_down_translate_z']['unit'] + ')';
				}

				if ( 'undefined' != typeof sectionData['crafto_scrolling_up_rotation']['size'] && '' !== sectionData['crafto_scrolling_up_rotation']['size'] &&
					'undefined' != typeof sectionData['crafto_scrolling_down_rotation']['size'] && '' !== sectionData['crafto_scrolling_down_rotation']['size'] &&
					sectionData['crafto_scrolling_up_rotation']['size'] !== sectionData['crafto_scrolling_down_rotation']['size']
				) {
					crafto_scrolldown_translate_collect += ' rotate(' + sectionData['crafto_scrolling_down_rotation']['size'] + sectionData['crafto_scrolling_down_rotation']['unit'] + ')';
				}

				if ( ( '' != sectionData['crafto_scrolling_down_scale_x']['size'] ) || ( sectionData['crafto_scrolling_down_scale_x']['size'] != sectionData['crafto_scrolling_up_scale_x']['size'] ) ) {
					crafto_scrolldown_translate_collect += ' scale(' + sectionData['crafto_scrolling_down_scale_x']['size'] + ')';
				}

				if ( 'undefined' != typeof sectionData['crafto_scrolling_up_translate3d_tx']['size'] && '' !== sectionData['crafto_scrolling_up_translate3d_tx']['size'] &&
				'undefined' != typeof sectionData['crafto_scrolling_up_translate3d_ty']['size'] && '' !== sectionData['crafto_scrolling_up_translate3d_ty']['size'] &&
				'undefined' != typeof sectionData['crafto_scrolling_up_translate3d_tz']['size'] && '' !== sectionData['crafto_scrolling_up_translate3d_tz']['size'] &&
				'undefined' != typeof sectionData['crafto_scrolling_down_translate3d_tx']['size'] && '' !== sectionData['crafto_scrolling_down_translate3d_tx']['size'] &&
				'undefined' != typeof sectionData['crafto_scrolling_down_translate3d_ty']['size'] && '' !== sectionData['crafto_scrolling_down_translate3d_ty']['size'] &&
				'undefined' != typeof sectionData['crafto_scrolling_down_translate3d_tz']['size'] && '' !== sectionData['crafto_scrolling_down_translate3d_tz']['size'] &&
				sectionData['crafto_scrolling_up_translate3d_tx']['size'] !== sectionData['crafto_scrolling_down_translate3d_tx']['size'] ||
				sectionData['crafto_scrolling_up_translate3d_ty']['size'] !== sectionData['crafto_scrolling_down_translate3d_ty']['size'] ||
				sectionData['crafto_scrolling_up_translate3d_tz']['size'] !== sectionData['crafto_scrolling_down_translate3d_tz']['size']
				) {	
					crafto_scrolldown_translate_collect += ' translate3d(' + sectionData['crafto_scrolling_down_translate3d_tx']['size'] + sectionData['crafto_scrolling_down_translate3d_tx']['unit'] + ',' + sectionData['crafto_scrolling_down_translate3d_ty']['size'] + sectionData['crafto_scrolling_down_translate3d_ty']['unit'] + ',' + sectionData['crafto_scrolling_down_translate3d_tz']['size'] + sectionData['crafto_scrolling_down_translate3d_tz']['unit'] + ')';
				}

				var scroll_down_filter_opacity = sectionData['crafto_scrolling_down_filter_opacity']['size'].toString();
				if ( '' != scroll_down_filter_opacity ) {
					crafto_scrolldown_filter_collect += ' opacity(' + sectionData['crafto_scrolling_down_filter_opacity']['size'] + ')';
				}

				var scroll_down_filter_blur = sectionData['crafto_scrolling_down_filter_blur']['size'].toString();
				if ( '' != scroll_down_filter_blur ) {
					crafto_scrolldown_blur_filter_collect += ' blur(' + sectionData['crafto_scrolling_down_filter_blur']['size'] + sectionData['crafto_scrolling_down_filter_blur']['unit'] + ')';
				}
		
				if ( '' !== crafto_scrolldown_translate_collect ) {
					crafto_scrolldown_translate_attr = "transform:" + crafto_scrolldown_translate_collect;
				}

				if ( 'undefined' != crafto_scrolldown_filter_collect && '' != crafto_scrolldown_filter_collect ) {
					crafto_scrolldown_filter_attr = "filter:" + crafto_scrolldown_filter_collect;
				}

				if ( 'undefined' != crafto_scrolldown_blur_filter_collect && '' != crafto_scrolldown_blur_filter_collect ) {
					crafto_scrolldown_blur_filter_attr = "filter:" + crafto_scrolldown_blur_filter_collect;
				}

				if ( crafto_scrolldown_blur_filter_collect ) {
					return crafto_scrolldown_blur_filter_attr + ( crafto_scrolldown_blur_filter_attr ? '; ' : '' ) + crafto_scrolldown_translate_attr;
				} else {
					return crafto_scrolldown_filter_attr + ( crafto_scrolldown_filter_attr ? ';' : '' ) + crafto_scrolldown_translate_attr;
				}
			}
		},
		renderWidth: function( commonId, elementType ) {
			if ( 'undefined' === typeof window.elementor ) {
				return;
			}

			var sectionData = CraftoAddonsInit.commonDataCollect( commonId, elementType );
			if ( 'yes' === sectionData['crafto_expand_animation_settings'] ) {
				var section_crafto_bottomtop_translate_width = '';
		
				if ( 'undefined' != typeof sectionData['crafto_bottomtop_width' ] && '' !== sectionData['crafto_bottomtop_width']['size'] && 0 !== sectionData['crafto_bottomtop_width']['size'] ) {
					section_crafto_bottomtop_translate_width += 'width: ' + sectionData['crafto_bottomtop_width']['size'] + sectionData['crafto_bottomtop_width']['unit'];
				}
				if ( '' !== section_crafto_bottomtop_translate_width ) {
					return section_crafto_bottomtop_translate_width;
				}
			}
		},
		renderWidthCenter: function ( commonId, elementType ) {
			if ( 'undefined' === typeof window.elementor ) {
				return;
			}
			var sectionData = CraftoAddonsInit.commonDataCollect( commonId, elementType );
			if ( 'yes' === sectionData['crafto_expand_animation_settings'] ) {
				var crafto_centertop = '';

				if ( 'undefined' != typeof sectionData['crafto_center_top_width'] && '' !== sectionData['crafto_center_top_width']['size'] ) {
					crafto_centertop += 'width: ' + sectionData['crafto_center_top_width']['size'] + sectionData['crafto_center_top_width']['unit'];
				}

				if ( '' !== crafto_centertop ) {
					return crafto_centertop;
				}
			}
		},
		renderFloatEffect: function ( commonId, elementType, $scope ) {
			var sectionData = CraftoAddonsInit.commonDataCollect( commonId, elementType );
			$scope.removeClass( 'animation-float has-float' );

			if ( 'yes' === sectionData['crafto_floating_effects_show'] ) {
				var float_animation = '';
				if ( checkUndefinedVal( sectionData['crafto_float_animation'] ) ) {
					var float_animation = sectionData['crafto_float_animation'];
					$scope.addClass( 'animation-' + float_animation );
				}

				var infinite_rotate = '';
				if ( checkUndefinedVal( sectionData['crafto_floating_infinite'] ) ) {
					var infinite_rotate = sectionData['crafto_floating_infinite'];
				}
				if ( 'float' === float_animation ) {
					$scope.removeClass( 'animation-rotate' );
					$scope.addClass( 'has-float' );
				} else {
					clearTimeout( timer );
					timer = setTimeout( function() {
						$scope.removeClass( 'has-float' );
					}, 1000 );
				}
				if ( 'rotate' === float_animation ) {
					$scope.removeClass( 'animation-float' );
					$scope.addClass( 'animation-' + float_animation );
					if ( 'yes' === infinite_rotate ) {
						$scope.addClass( 'crafto-floating-effect-infinite' + infinite_rotate );
					}
					$scope.removeClass( 'crafto-floating-effect-infinite' + infinite_rotate );
				}
			} else {
				$scope.removeClass( 'has-float' );
			}
		},
		sectionSettings: function( sectionId ) {
			if ( ! window.elementor.hasOwnProperty( 'elements' ) ) {
				return false;
			}

			editorElements = window.elementor.elements;
			if ( ! editorElements.models ) {
				return false;
			}

			$.each( editorElements.models, function( index, obj ) {
				if ( sectionId == obj.id ) {
					sectionData = obj.attributes.settings.attributes;
				}
			});

			var crafto_scroll_to_down,
				crafto_scroll_to_down_style_types,
				crafto_target_id,
				crafto_scroll_text_separator_after,
				crafto_scroll_to_down_text,
				crafto_selected_icon;
			
			if ( 'undefined' != typeof sectionData['crafto_scroll_to_down'] ) {
				crafto_scroll_to_down = sectionData['crafto_scroll_to_down'];
			}

			if ( 'undefined' != typeof sectionData['crafto_scroll_to_down_style_types'] ) {
				crafto_scroll_to_down_style_types = sectionData['crafto_scroll_to_down_style_types'];
			}

			if ( 'undefined' != typeof sectionData['crafto_target_id'] ) {
				crafto_target_id = sectionData['crafto_target_id'];
			}

			if ( 'undefined' != typeof sectionData['crafto_scroll_text_separator_after'] ) {
				crafto_scroll_text_separator_after = sectionData['crafto_scroll_text_separator_after'];
			}

			if ( 'undefined' != typeof sectionData['crafto_scroll_to_down_text'] ) {
				crafto_scroll_to_down_text = sectionData['crafto_scroll_to_down_text'];
			}

			if ( 'undefined' != typeof sectionData['crafto_selected_icon'] && '' !== sectionData['crafto_selected_icon']['value'] ) {
				crafto_selected_icon = '<i class="';
				crafto_selected_icon += sectionData['crafto_selected_icon']['value'];
				crafto_selected_icon += '" aria-hidden="true"></i>';
			}

			return{
				'scroll_to_down': crafto_scroll_to_down,
				'scroll_style_types': crafto_scroll_to_down_style_types,
				'scroll_target_id': crafto_target_id,
				'scroll_text_separator': crafto_scroll_text_separator_after,
				'scroll_text': crafto_scroll_to_down_text,
				'scroll_icon': crafto_selected_icon,
			}
		},
		elementorSection: function( $scope ) {
			if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable ) {
				CraftoAddonsInit.commonAnimationScope( $scope );
				if ( 'undefined' != typeof CraftoMain && $.inArray( 'skrollr', CraftoMain.disable_scripts ) < 0 ) {
					reInitSkrollr();
				}
			}
			var sectionId = $scope.data( 'id' ),
				editMode  = Boolean( elementorFrontend.isEditMode() );

			if ( editMode ) {
				var scrollTodownSettings = CraftoAddonsInit.sectionSettings( sectionId );
				get_scroll_to_down( scrollTodownSettings );

			} else {
				var scrollTodownSettings = $scope.data( 'scroll-to-down-settings' );
				get_scroll_to_down( scrollTodownSettings );
			}
			function get_scroll_to_down( settings ) {
				if ( 'undefined' !== typeof settings ) {
					var enable_text_separator = '';
					var content               = null;
					var scroll_to_down        = ( 'undefined' !== typeof settings['scroll_to_down'] ) ? settings['scroll_to_down'] : '',
						scroll_style_types    = ( 'undefined' !== typeof settings['scroll_style_types'] ) ? settings['scroll_style_types'] : '',
						scroll_target_id      = ( 'undefined' !== typeof settings['scroll_target_id'] ) ? settings['scroll_target_id'] : '',
						scroll_text_separator = ( 'undefined' !== typeof settings['scroll_text_separator'] ) ? settings['scroll_text_separator'] : '',
						scroll_text           = ( 'undefined' !== typeof settings['scroll_text'] ) ? settings['scroll_text'] : '',
						scroll_icon           = ( 'undefined' !== typeof settings['scroll_icon'] ) ? settings['scroll_icon'] : '',
						wrapper               = wp.template( 'element-section' );
					
					if ( 'yes' !== scroll_to_down ) {
						return;
					}	

					if ( 'yes' === scroll_text_separator ) {
						enable_text_separator = ' after-text';
					}

					if ( 'undefined' !== typeof scroll_target_id ) {
						scroll_target_id = scroll_target_id.replace( /^#/, '' );
					}

					content = wrapper( {
						scroll_style_types: scroll_style_types,
						scroll_target_id: scroll_target_id,
						scroll_text: scroll_text,
						enable_text_separator: enable_text_separator,
						scroll_icon: scroll_icon,
					});

					var element = $( '[data-id="' + sectionId + '"]' ).find( '.e-con-inner' ).first();

					if ( 'undefined' == typeof element || '' == element ) {
						return;
					}

					$( content ).insertBefore( element );
				} else {
					return;	
				}
			}
		},
		elementorWidget: function( $scope ) {
			if ( 'undefined' != typeof CraftoFrontend && '0' === CraftoFrontend.all_animations_disable ) {
				CraftoAddonsInit.commonAnimationScope( $scope );
				if ( 'undefined' != typeof CraftoMain && $.inArray( 'skrollr', CraftoMain.disable_scripts ) < 0 ) {
					reInitSkrollr();
				}
			}
		},
	}

	$( window ).on( 'elementor/frontend/init', CraftoAddonsInit.init );

})( jQuery );

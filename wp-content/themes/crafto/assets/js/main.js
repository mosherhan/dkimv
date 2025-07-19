( function( $ ) {

	"use strict";

	const $window   = $( window );
	const $document = $( document );

	$( '.default-blog-grid .grid-sizer' ).removeClass( 'd-none' );

	$window.on( 'load', function( e ) {
		$( 'body' ).addClass( 'crafto-theme-ready' );
	});

	$document.ready( function() {

		const el_body   = $( 'body' );
		const el_html   = $( 'html' );

		// Define varibale.
		let lastScroll = 0;

		// Get window WIDTH.
		function getWindowWidth() {
			return window.innerWidth;
		}

		// Get window HEIGHT
		function getWindowHeight() {
			return $window.height();
		}

		// Get top space header height
		function getHeaderHeight() {
			let headerHeight = 0;

			// Select all relevant elements once
			const elements = [
				'#wpadminbar',
				'.mini-header-main-wrapper',
				'.header nav.navbar'
			];

			// Calculate total header height
			elements.forEach( selector => {
				const el = $( selector );
				if ( el.length > 0 ) {
					headerHeight += Math.round( el.outerHeight() );
				}
			});

			return headerHeight;
		}

		function getTopSpaceHeaderHeight() {
			let ts_height = 0;
			// Select all relevant elements once
			const elements = [
				'#wpadminbar',
				'.mini-header-main-wrapper',
				'.header-common-wrapper.standard'
			];

			// Calculate total header height
			elements.forEach( selector => {
				const el = $( selector );
				if ( el.length > 0 ) {
					ts_height += Math.round( el.outerHeight() );
				}
			});

			return ts_height;
		}

		let tabletBreakPoint = 991;
		if ( 'undefined' != typeof elementorFrontendConfig ) {
			if ( 'undefined' != typeof elementorFrontendConfig.breakpoints ) {
				if ( 'undefined' != typeof elementorFrontendConfig.breakpoints.lg ) {
					tabletBreakPoint = elementorFrontendConfig.breakpoints.lg - 1;
				}
			}
		}

		el_body.addClass( 'crafto-theme-ready' );

		var el_header_nav            = $( 'header nav' ),
			el_close_menu            = $( '.close-menu' ),
			el_sub_menu_item         = $( '.sub-menu-item' ),
			el_dropdown              = $( '.dropdown' ),
			el_navbar_collapse       = $( '.navbar-collapse' ),
			el_header_standard       = $( '.header-common-wrapper.standard' ),
			el_mini_header_wrapper   = $( '.mini-header-main-wrapper' );

		var scrollTop = document.documentElement.scrollTop;

		if ( 10 === scrollTop ) {
			const firstmenuLinks   = $( '.navbar-nav li:first-child a' );
			let firstmenuLinkshref = firstmenuLinks.attr( 'href' );

			if ( firstmenuLinkshref && firstmenuLinkshref.indexOf( '#' ) > -1 ) {
				firstmenuLinks.addClass( 'active' );
			}
		}

		// Window orientationchange
		$window.on( 'orientationchange', function( e ) {
			// Close side menu
			if ( $( '.navbar-collapse.collapse' ).length > 0 ) {
				$( '.navbar-collapse.collapse' ).collapse( 'hide' );
			}
			el_body.removeClass( 'show-menu' );
			el_html.removeClass( 'overflow-hidden' );
		});

		let timerCollapse;
		let timerPosition;
		$window.on( 'closemenu', function( e ) {
			// Close all dropdown
			if ( el_dropdown.length > 0 ) {
				el_dropdown.each( function() {
					$( this ).trigger( 'mouseleave' ).removeClass( 'show' ).children( '.dropdown-menu' ).removeClass( 'show' );
				});
			}

			// Close all menu
			if ( el_navbar_collapse.hasClass( 'show' ) ) {
				el_navbar_collapse.collapse( 'hide' ).removeClass( 'show' );
			}

			// Hide navbar on body
			if ( el_body.hasClass( 'navbar-collapse-show' ) ) {
				el_body.removeClass( 'navbar-collapse-show' );
			}

			// Remove 'navbar-collapse-show-after' after 500ms
			clearTimeout( timerCollapse );
			timerCollapse = setTimeout(() => {
				el_body.removeClass( 'navbar-collapse-show-after' );
			}, 500 );

			// Reset navbar position after 400ms
			clearTimeout( timerPosition );
			timerPosition = setTimeout(() => {
				el_navbar_collapse.css( 'left', '' );
			}, 400 );
		});

		// Hide collaps on outside click.
		let timerCollapseHide;
		$document.on( 'touchstart click', 'body', function( e ) {
			if ( ! ( $( e.target ).closest( '.navbar-nav' ).length || $( e.target ).closest( '.navbar-full-screen-menu-inner' ).length ) && ! $( '.crafto-left-menu-wrap' ).length ) {
				clearTimeout( timerCollapseHide );
				timerCollapseHide = setTimeout(() => {
					$( '.navbar-collapse.collapse' ).collapse( 'hide' );
				}, 100 );
			}

			if ( ! $( e.target ).parents( 'nav' ).hasClass( 'standard' ) && getWindowWidth() >= tabletBreakPoint ) {
				if ( el_dropdown.length > 0 ) {
					el_dropdown.each( function() {
						if ( $( this ).hasClass( 'open' ) ) {
							$( this ).removeClass( 'open show' );
						}
					});
				}
			}

			if ( ( ! ( $( e.target ).hasClass( 'push-button' ) ||
				$( e.target ).closest( '.push-button' ).length ||
				$( e.target ).closest( '.push-menu' ).length ||
				$( e.target ).closest( '.hamburger-menu' ).length ) ) &&
				getWindowWidth() >= tabletBreakPoint ) {

				el_body.removeClass( 'show-menu' );
				$( '.navbar-collapse.collapse' ).collapse( 'hide' );
				el_html.removeClass( 'overflow-hidden' );
			}

			if ( ! el_navbar_collapse.has( e.target ).is( '.navbar-collapse' ) &&
				el_navbar_collapse.hasClass( 'show' ) &&
				! $( e.target ).hasClass( 'navbar-toggle' ) &&
				! $( e.target ).hasClass( 'navbar-collapse-clone' ) &&
				! el_navbar_collapse.hasClass( 'crafto-left-menu-wrapper' ) ) {

				el_navbar_collapse.collapse( 'hide' );
			}
		});

		var navbarWidgetNavbar       = $( '.header-common-wrapper.standard .elementor-widget-crafto-mega-menu .navbar-collapse' );
		var navbarWidgetNavbarToggle = $( '.header-common-wrapper.standard .elementor-widget-crafto-mega-menu .navbar-toggler' );
		var mobileNavStyle           = el_body.data( 'mobile-nav-style' );

		// Mobile Navigation - modern/full-screen style
		mobileModernFullscreenNavigation();
		function mobileModernFullscreenNavigation() {
			var layout_class = '.page-layout';
			if ( $( '.box-layout' ).length > 0 ) {
				layout_class = '.box-layout';
			}

			if ( getWindowWidth() <= tabletBreakPoint ) {
				if ( ( mobileNavStyle == 'modern' || mobileNavStyle == 'full-screen-menu' ) && navbarWidgetNavbar.length > 1 && ! $( '.navbar-nav-clone' ).length ) {
					navbarWidgetNavbar.first().find( '.navbar-nav' ).clone( false ).addClass( 'navbar-nav-clone' ).insertBefore( navbarWidgetNavbar.last().find( '.navbar-nav' ) );
					navbarWidgetNavbar.last().addClass( 'navbar-collapse-final' );
					navbarWidgetNavbarToggle.last().addClass( 'navbar-toggler-final' );
				}
			} else {
				if ( ( mobileNavStyle == 'modern' || mobileNavStyle == 'full-screen-menu' ) && navbarWidgetNavbar.length > 1 && $( '.navbar-nav-clone' ).length > 0 ) {
					navbarWidgetNavbar.last().removeClass( 'navbar-collapse-final' );
					navbarWidgetNavbarToggle.last().removeClass( 'navbar-toggler-final' );
					navbarWidgetNavbar.last().find( '.navbar-nav-clone' ).remove();
				}
			}

			if ( getWindowWidth() <= tabletBreakPoint ) {
				if ( ( mobileNavStyle == 'modern' || mobileNavStyle == 'full-screen-menu' ) && ! $( '.navbar-' + mobileNavStyle + '-inner' ).length ) {
					if ( navbarWidgetNavbar.length > 1 ) {
						var targetButtonClone   = $( '.header-common-wrapper.standard .navbar-toggler-final' ).clone( false ).addClass( 'navbar-toggler-clone' ).insertAfter( layout_class ),
							targetNavClone      = $( '.header-common-wrapper.standard .navbar-collapse-final' ).clone( false ).addClass( 'navbar-collapse-clone' ).attr( 'id', 'navbarNav-clone' ).insertAfter( layout_class );

						var mobileNavInnerHTML	= '';
							mobileNavInnerHTML += '<div class="navbar-';
							mobileNavInnerHTML += mobileNavStyle;
							mobileNavInnerHTML += '-inner"></div>';
						$( '.navbar-toggler-clone, .navbar-collapse-clone' ).wrapAll( mobileNavInnerHTML );
						$( '.navbar-toggler' ).attr( 'data-bs-target', '#navbarNav-clone' ).attr( 'aria-controls', '#navbarNav-clone' );
					} else {
						var targetButtonClone   = $( '.header-common-wrapper.standard .navbar-toggler' ).clone( false ).addClass( 'navbar-toggler-clone' ).insertAfter( layout_class ),
							targetNavClone      = $( '.header-common-wrapper.standard .navbar-collapse' ).clone( false ).addClass( 'navbar-collapse-clone' ).attr( 'id', 'navbarNav-clone' ).insertAfter( layout_class );

						var mobileNavInnerHTML	= '';
							mobileNavInnerHTML += '<div class="navbar-';
							mobileNavInnerHTML += mobileNavStyle;
							mobileNavInnerHTML += '-inner"></div>';
						$( '.navbar-toggler-clone, .navbar-collapse-clone' ).wrapAll( mobileNavInnerHTML );
						$( '.navbar-toggler' ).attr( 'data-bs-target', '#navbarNav-clone' ).attr( 'aria-controls', '#navbarNav-clone' );
					}

					$( '.navbar-' + mobileNavStyle + '-inner' ).find( '.dropdown-toggle' ).addClass( 'dropdown-toggle-clone' );

					let timernNavbarCollapseClone;
					if ( $( '.navbar-collapse-clone' ).length > 0 && 'undefined' != typeof CraftoMain && $.inArray( 'mCustomScrollbar', CraftoMain.disable_scripts ) < 0 ) {
						clearTimeout( timernNavbarCollapseClone );
						timernNavbarCollapseClone = setTimeout(() => {
							$( '.navbar-collapse-clone' ).mCustomScrollbar();
						}, 400 );
					}

					if ( mobileNavStyle == 'modern' && ! $( '.navbar-show-modern-bg' ).length ) {
						$( '<div class="navbar-show-modern-bg"></div>' ).insertAfter( layout_class );
					}
				}
			}
		}

		// Navbar collapse modern & full screen menu event
		navbarCollapseToggle();
		function navbarCollapseToggle() {
			$( '.navbar-collapse-clone.collapse' ).on( 'show.bs.collapse', function() {
				let $navFullscreenInner = $( '.navbar-full-screen-menu-inner' );
				let $navModernInner     = $( '.navbar-modern-inner' );

				if ( ! el_body.hasClass( 'navbar-collapse-show' ) ) {
					el_body.addClass( 'navbar-collapse-show' );
					el_html.addClass( 'overflow-hidden' );

					let $navMobileBGColor = el_body.attr( 'data-mobile-nav-bg-color' );
					let $navMobileImg     = el_body.attr( 'data-mobile-nav-bg-image' );

					if ( $navMobileBGColor && $navModernInner.length > 0 ) {
						$( '.navbar-show-modern-bg' ).css( 'background', $navMobileBGColor );
					}

					if ( $navFullscreenInner.length > 0 ) {
						if ( $navMobileBGColor ) {
							$navFullscreenInner.css( 'background', $navMobileBGColor );
						}
						if ( $navMobileImg ) {
							$navFullscreenInner.css( 'background-image', 'url(' + $navMobileImg + ')' );
						}
					}
				}

				if ( $navModernInner.length > 0 || $navFullscreenInner.length > 0 ) {
					$( this ).css( 'max-height', getWindowHeight() );
				} else {
					$( this ).css( 'max-height', ( getWindowHeight() - getTopSpaceHeaderHeight() ) );
				}
			}).on( 'hide.bs.collapse', function() {
				if ( el_body.hasClass( 'navbar-collapse-show' ) ) {
					el_body.removeClass( 'navbar-collapse-show' );
					el_html.removeClass( 'overflow-hidden' );
				}
			});

			let $modernmenu_el = $( '.navbar-modern-inner .megamenu' );
			if ( $modernmenu_el.length > 0 ) {
				$modernmenu_el.each( function() {
					let activeMenuLength = $( this ).find( '.megamenu-content .current-menu-item' ).length;
					if ( activeMenuLength ) {
						if ( ! $( this ).hasClass( 'current-menu-ancestor' ) ) {
							$( this ).addClass( 'current-menu-ancestor' );
						}
					}
				});
			}
		}

		// START window scroll event
		let pageScroll = 0;
		$window.on( 'scroll', function() {
			scrollTop = $( this ).scrollTop();

			if ( pageScroll > 0 || scrollTop > pageScroll ) {
				headerWrapper( scrollTop );
			}
			pageScroll++;

			/****** One page navigation ******/
			const menuLinks = $( '.navbar-nav li a' );
			let scrollPos = scrollTop + 60;
			if ( menuLinks.length > 0 ) {
				menuLinks.each( function() {
					const $elThis = $( this );
					if( $elThis.attr( 'href' ) != '' && $elThis.attr( 'href' ) != undefined ) {
						let $anchorHref = $elThis.attr( 'href' );
						let hasPos      = $anchorHref.indexOf( '#' );

						if ( hasPos > -1 ) {
							let res           = $anchorHref.substring( hasPos );
							let hashID        = res.replace( '#', '' );
							let elementExists = document.getElementById( hashID );

							if ( res != '' && res != '#' && elementExists != '' && elementExists != null ) {
								let refElement = $( res );
								if ( refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos ) {
									menuLinks.removeClass( 'active' );
									$elThis.addClass( 'active' );
									if ( $elThis.hasClass( 'active' ) ) {
										$window.trigger( 'closemenu' );
									}
								}
								if ( scrollTop < 1 ) {
									$elThis.removeClass( 'active' );
								}
							}
						}
					}
				});
			}
		});
		// END window scroll event

		// START window resize event
		let timerHeaderTopSpace;
		let timerDefaultGrid;
		$window.on( 'resize', function() {
			mobileModernFullscreenNavigation();
			navbarCollapseToggle();
			fullScreenHeight();
			headerWrapper( scrollTop );

			// Reinitialize masonry on resize
			if ( ! el_body.hasClass( 'elementor-editor-active' ) ) {
				if ( 'undefined' != typeof CraftoMain &&
					$.inArray( 'imagesloaded', CraftoMain.disable_scripts ) < 0 &&
					$.inArray( 'isotope', CraftoMain.disable_scripts ) < 0 ) {
					clearTimeout( timerDefaultGrid );
					timerDefaultGrid = setTimeout(() => {
						// List of selectors for grids
						const gridSelectors = [
							'.default-blog-grid',
							'.default-portfolio-grid',
							'.default-property-grid',
							'.default-tours-grid'
						];

						gridSelectors.forEach( selector => {
							let $grid = $( selector );
							if ( $grid.length > 0 ) {
								$grid.imagesLoaded(() => {
									$grid.isotope();
								});
							}
						});
					}, 500 );
				}
			}

			clearTimeout( timerHeaderTopSpace );
			timerHeaderTopSpace = setTimeout(() => {
				setHeaderTopSpace();
			}, 400 );
		});
		// END window resize event

		// Close side menu on outside area
		$document.on( 'touchstart click', '.show-menu', function( e ) {
			const $target = $( e.target );

			const isMenuInteraction = $target.hasClass( 'push-button' ) ||
									  $target.closest( '.push-button' ).length ||
									  $target.closest( '.push-menu' ).length ||
									  $target.closest( '.hamburger-menu' ).length ||
									  $target.closest( 'div.elementor-no-template-message' ).length;

			if ( ! isMenuInteraction ) {
				el_close_menu.trigger( 'click' );
			}
		});

		// Hamburger / side menu close
		let closeFlag = false;
		let timerCloseMenu;
		$document.on( 'click', '.close-menu', function( event ) {
			event.preventDefault();

			if ( ! closeFlag ) {
				closeFlag = true;

				// Reset flag after a delay
				clearTimeout( timerCloseMenu );
				timerCloseMenu = setTimeout(() => {
					closeFlag = false;
				}, 500 );

				el_body.removeClass( 'show-menu' );
				el_sub_menu_item.collapse( 'hide' );
				$( '.menu-item.open' ).removeClass( 'show' );
				el_html.removeClass( 'overflow-hidden' );
			}
		} );

		// Close on escape key
		$document.on( 'keydown', function( e ) {
			if ( 27 === e.keyCode ) {
				// Close side menu
				el_close_menu.trigger( 'click' );
				$window.trigger( 'closemenu' );
			}
		});

		headerWrapper( scrollTop );
		function headerWrapper( scrollTop ) {
			var el_wpadminbar            = $( '#wpadminbar' ),
				el_header_standard       = $( '.header-common-wrapper.standard' ),
				el_mini_header_wrapper   = $( '.mini-header-main-wrapper' ),
				el_header_common_wrapper = $( '.header-common-wrapper' ),
				mini_header_object       = $( '.mini-header-main-wrapper' );

			var mini_header_height = 0,
				main_header_height = 0,
				wpadminbarHeight   = 0,
				ts_height          = 0,
				aboveHeaderHeight  = 0;

			if ( el_wpadminbar.length > 0 ) {
				wpadminbarHeight = el_wpadminbar.outerHeight();
				wpadminbarHeight = Math.round( wpadminbarHeight );
			}

			if ( el_mini_header_wrapper.length > 0 ) {
				var mini_header_object = el_mini_header_wrapper;
					mini_header_height = mini_header_object.outerHeight();
					ts_height          = ts_height + mini_header_height;
			}

			if ( el_header_standard.length > 0 ) {
				var main_header_object = el_header_standard;
					main_header_height = main_header_object.outerHeight();
					main_header_object.css( 'margin-top', ts_height );
					ts_height = ts_height + main_header_height;
			}

			var headerAppearFlag = false;
			if ( scrollTop > ts_height ) { // Scroll position is greater than header height
				headerAppearFlag = true;
			}

			if ( el_mini_header_wrapper.length > 0 ) {
				var mini_header_object = el_mini_header_wrapper;
					mini_header_object.css( 'margin-top', '0px' );

				if ( mini_header_object.hasClass( 'header-reverse' ) ) {
					if ( scrollTop > lastScroll ) {
						scrollTop = scrollTop - 1;

						if ( headerAppearFlag ) {
							mini_header_object.css( 'top', '-' + ( ts_height ) + 'px' );
						}
						mini_header_object.removeClass( 'header-appear' );
					} else {
						if ( headerAppearFlag ) {
							aboveHeaderHeight = aboveHeaderHeight + mini_header_height;
						}
						mini_header_object.addClass( 'header-appear' );
						mini_header_object.css( 'top', wpadminbarHeight + 'px' );
					}
				} else if ( mini_header_object.hasClass( 'always-fixed' ) || mini_header_object.hasClass( 'responsive-sticky' ) ) {

					if ( headerAppearFlag && ! el_header_standard.hasClass( 'disable-fixed' ) ) {
						aboveHeaderHeight = aboveHeaderHeight + mini_header_height;

					} else if ( scrollTop > aboveHeaderHeight && el_header_standard.hasClass( 'disable-fixed' ) ) {
						mini_header_object.css( 'margin-top',  aboveHeaderHeight + 'px' );
					}
				}
			}

			if ( el_header_standard.length > 0 ) {
				var main_header_object = el_header_common_wrapper;
					main_header_height = main_header_object.outerHeight();

				if ( ! main_header_object.hasClass( 'disable-fixed' ) ) {
					if ( headerAppearFlag && scrollTop > 0 ) {
						if ( el_mini_header_wrapper.hasClass( 'always-fixed' ) ){
							mini_header_height = mini_header_object.outerHeight();
							main_header_object.css( 'margin-top', mini_header_height );
						} else {
							main_header_object.css( 'margin-top', aboveHeaderHeight + 'px' );
							if ( main_header_object.hasClass( 'responsive-sticky' ) && mini_header_object.hasClass( 'disable-fixed' ) ) {
								mini_header_object.css( 'margin-top', '-' + mini_header_height + 'px' );
							}
						}

					}
				}

				if ( main_header_object.hasClass( 'header-reverse' ) || main_header_object.hasClass( 'reverse-back-scroll' ) ) {
					if ( scrollTop > lastScroll ) {
						scrollTop = scrollTop - 1;
						main_header_object.removeClass( 'header-appear' );
					} else {
						main_header_object.addClass( 'header-appear' );
					}
				}
			}

			const el_site_header = $( 'header.site-header' );
			if ( scrollTop > ts_height ) {
				el_site_header.addClass( 'sticky' );
			} else {
				el_site_header.removeClass( 'sticky' );
				$( '.mini-header-main-wrapper, .header-common-wrapper' ).removeClass( 'header-appear' );
			}

			lastScroll = scrollTop;
		}

		// Header top space + title space + first section of content.
		setHeaderTopSpace();
		function setHeaderTopSpace() {
			var mini_header_height = 0,
				main_header_height = 0,
				ts_height          = 0;

			if ( $( el_mini_header_wrapper ).length > 0 ) {
				var mini_header_object = $( el_mini_header_wrapper );
					mini_header_height = mini_header_object.outerHeight();
					ts_height          = ts_height + mini_header_height;
			}

			if ( $( el_header_standard ).length > 0 ) {
				var main_header_object = $( el_header_standard );
					main_header_height = main_header_object.outerHeight();
					ts_height = ts_height + main_header_height;
			}

			// for  Left Menu Classic mobile menu
			var el_left_menu_classic = $( '.header-common-wrapper.left-menu-classic, .header-common-wrapper.left-menu-modern' );
			if ( el_left_menu_classic.length > 0 ) {
				var main_header_object = el_left_menu_classic.find( '.e-con' ).first();
					main_header_height = main_header_object.outerHeight();
					ts_height          = ts_height + main_header_height;
			}

			// for page content first section ( elementor )
			var pageContent  = $( '.crafto-main-content-wrap' ).find( '.entry-content-inner' ),
				sectionFirst = pageContent.find( '.elementor .e-con' ).first();

			// for page title first section
			var pageTitle        = $( '.crafto-main-title-wrapper' ),
				pageTitlesection = pageTitle.find( '.e-con' ).first();

			if ( pageTitle.length > 0 && pageTitlesection.hasClass( 'top-space' ) || $( '.default-main-title-wrapper' ).length > 0 ) {
				var padding_top = pageTitle.attr( 'data-padding-top' );

				if ( '' == padding_top || undefined == padding_top ) {
					padding_top = pageTitle.css( 'padding-top' );
					pageTitle.attr( 'data-padding-top', padding_top );
				}

				ts_height = parseInt( ts_height ) + parseInt( padding_top );

				pageTitle.find( '.top-space' ).css( 'padding-top', ts_height + 'px' );

			} else if ( $( '.crafto-main-inner-content-wrap' ).hasClass( 'top-space' ) && 0 === pageTitle.length ) {
				// single post
				$( '.crafto-main-inner-content-wrap.top-space' ).parents( '.crafto-main-content-wrap' ).css( 'margin-top', ts_height + 'px' );

			} else if ( ( sectionFirst.hasClass( 'top-space' ) || $( '.error-404' ).hasClass( 'top-space' ) ) && 0 === pageTitle.length ) {
				// First section of page content header top space
				$( '.crafto-main-content-wrap .top-space, .error-404.top-space' ).parents( '.crafto-main-content-wrap' ).css( 'margin-top', ts_height + 'px' );

			} else if ( $( '.crafto-single-product-main-wrap' ).hasClass( 'top-space' ) ) {
				// Single Product Top Space
				$( '.crafto-single-product-main-wrap.top-space' ).css( 'margin-top', ts_height + 'px' );

			} else if ( $( '.crafto-main-content-wrap' ).hasClass( 'top-space' ) ) {
				// Archive Product Top Space
				$( '.crafto-main-content-wrap.top-space' ).css( 'margin-top', ts_height + 'px' );

			} else {

				if ( 'undefined' != typeof CraftoMain && '1' == CraftoMain.mobile_header_top_space ) {
					// For Mobile Menu Top Space
					if ( getWindowWidth() <= tabletBreakPoint ) {
						el_header_nav.addClass( 'mobile-top-space' );

						if ( el_header_nav.hasClass( 'mobile-top-space' ) ) {
							el_body.css( 'padding-top', ts_height + 'px' );
						}
					} else {
						el_header_nav.removeClass( 'mobile-top-space' );
						el_body.css( 'padding-top', '' );
						if ( ( ! el_header_nav.hasClass( 'disable-fixed' ) && el_header_nav.hasClass( 'mobile-top-space' ) ) || el_left_menu_classic.hasClass( 'mobile-top-space' ) ) {
							el_body.css( 'padding-top', ts_height + 'px' );
						} else {
							el_body.css( 'padding-top', '' );
						}
					}
				}
			}

			const $elPageTitleWrap = $( '.crafto-main-title-wrap' );
			if ( $elPageTitleWrap.length > 0 && $( '.top-space-padding' ).length > 0 ) {

				let padding_top = $elPageTitleWrap.attr( 'data-padding-top' );
				if (  '' === padding_top || 'undefined' != typeof padding_top ) {
					padding_top = $elPageTitleWrap.css( 'padding-top' );
					$elPageTitleWrap.attr( 'data-padding-top', padding_top );
				}

				ts_height =  parseInt( ts_height ) + parseInt( padding_top );

				$( '.top-space-padding' ).css( 'padding-top', ts_height + 'px' );
			}
		}

		$window.on( 'scroll', initScrollNavigate );

		// Window scroll Function
		let timerStickyHeader;
		function initScrollNavigate() {
			const headerTransition = 300;
			const $header          = $( 'header' );
			let scrollPos          = $window.scrollTop();
			let lastScroll         = 0;

			// Sticky nav Start
			let navHeight        = 0,
				miniHeaderHeight = 0;
			if ( $( 'header nav.navbar' ).length > 0 ) {
				navHeight = $( 'header nav.navbar' ).outerHeight();
			}

			if ( $( '.mini-header-main-wrapper' ).length > 0 ) {
				miniHeaderHeight = $( '.mini-header-main-wrapper' ).outerHeight();
			}

			let headerHeight = navHeight + miniHeaderHeight;

			// Header sticky
			if ( $header.find( '.standard' ).length > 0 ) {
				if ( scrollPos > ( headerHeight + 150 ) ) {

					clearTimeout( timerStickyHeader );
					timerStickyHeader = setTimeout(() => {
						$header.addClass( 'sticky-active' );
					}, headerTransition ); // Header transition effect time

				}

				if ( scrollPos < headerHeight ) {
					clearTimeout( timerStickyHeader );
					timerStickyHeader = setTimeout(() => {
						$header.removeClass( 'sticky-active' );
					}, headerTransition ); // Header transition effect time
				}
			}

			// Hide side menu on scroll
			if ( scrollPos >= 200 && getWindowWidth() > tabletBreakPoint ) {
				// Close all dropdown menus
				$( '.dropdown' ).trigger( 'mouseleave' );
			}

			lastScroll = scrollPos;
		}

		// Set full screen height & top space
		fullScreenHeight();
		function fullScreenHeight() {
			var fullScreenObj          = $( '.full-screen' ),
				fullScreenMobileobj    = $( '.full-mobile-screen' ),
				firstsectionfullscreen = $( 'section:first.full-screen, section:first .full-screen' ),
				navbar                 = $( 'header nav.navbar' ),
				mini_header            = $( '.mini-header-main-wrapper' ),
				minHeight              = getWindowHeight(),
				headerHeight           = getHeaderHeight();

			if ( 'undefined' != typeof CraftoMain && $.inArray( 'imagesloaded', CraftoMain.disable_scripts ) < 0 ) {
				const $pageLayout = fullScreenObj.parents( '.crafto-page-layout' );
				if ( $pageLayout.length > 0 ) {
					$pageLayout.imagesLoaded( function() {
						if ( firstsectionfullscreen.length > 0 && ( $( '.mobile-top-space' ).length > 0 ) ) {
							firstsectionfullscreen.css( 'height', minHeight - headerHeight );
						} else if ( navbar.hasClass( 'mobile-top-space' ) ) {
							minHeight = minHeight - navbar.outerHeight();
							fullScreenObj.css( 'height', minHeight );
							fullScreenMobileobj.css( 'height', minHeight );
						} else {
							if ( fullScreenObj.hasClass( 'top-space' ) ) {
								if ( mini_header.length > 0 ) {
									minHeight = ( minHeight - navbar.outerHeight() ) - ( mini_header.outerHeight() );
									fullScreenObj.css( 'height', minHeight );
								} else {
									minHeight = minHeight - navbar.outerHeight();
									fullScreenObj.css( 'height', minHeight );
								}
							} else {
								fullScreenObj.css( 'height', minHeight );
							}
							if ( $( '' === fullScreenMobileobj ) ) {
								fullScreenMobileobj.css( 'height', minHeight );
							}
						}
					});
				}
			}
		}

		// Page Preloader
		let timerPreloader;
		pagePreloader();
		function pagePreloader() {
			const el_preloader_overlay = $( '.preloader-overlay' );
			if ( el_preloader_overlay.length > 0 ) {
				el_preloader_overlay.delay( 2000 ).fadeOut( 'slow' );
				if ( el_body.hasClass( 'preloader-overflow-hidden' ) ) {
					clearTimeout( timerPreloader );
					timerPreloader = setTimeout(() => {
						el_body.removeClass( 'preloader-overflow-hidden' );
					}, 3000 );
				}
			}
		}

		// Side menu submenu toggle.
		let timerLeftSidebarWrap;
		let el_left_sidebar_wrapper= $( '.left-sidebar-wrapper' );
		$document.on( 'click', '.sub-menu-item > li.menu-item-has-children > .menu-toggle', function( e ) {
			e.preventDefault();

			var _parent     = $( this ).parent().parent( '.sub-menu-item' ).find( '.sub-menu-item' );
			var _parentAttr = $( this ).attr( 'data-bs-target' );

			if ( _parent.length > 0 ) {
				_parent.each( function() {
					var _this = $( this ),
						_attr = _this.parent().find( '.menu-toggle' ).attr( 'data-bs-target' );

					if ( _attr != _parentAttr ) {
						_this.parent().find( '.menu-toggle:not(.collapsed)' ).addClass( 'collapsed' );
						_this.collapse( 'hide' );
					}
				});
			}

			if ( 'undefined' != typeof CraftoMain &&
				$.inArray( 'sticky-kit', CraftoMain.disable_scripts ) < 0 ) {
				if ( el_left_sidebar_wrapper.length > 0 ) {

					clearTimeout( timerLeftSidebarWrap );
					timerLeftSidebarWrap = setTimeout(() => {
						el_left_sidebar_wrapper.trigger( 'sticky_kit:recalc' );
					}, 500 );
				}
			}
		});

		let grids = [
			'.default-blog-grid',
			'.default-portfolio-grid',
			'.default-property-grid',
			'.default-tours-grid'
		];

		grids.forEach( selector => {
			let $element = $( selector );
			if ( $element.length > 0 ) {
				initializeIsotope( $element );
			}
		});

		function initializeIsotope( element ) {
			let timerIsotope;
			if ( 'undefined' != typeof CraftoMain && 
			$.inArray( 'imagesloaded', CraftoMain.disable_scripts ) < 0 && 
			$.inArray( 'isotope', CraftoMain.disable_scripts ) < 0 ) {
				element.imagesLoaded( function() {
					element.isotope({
						layoutMode: 'masonry',
						itemSelector: '.grid-item',
						percentPosition: true,
						masonry: {
							columnWidth: '.grid-sizer'
						}
					});
				});

				element.isotope();

				clearTimeout( timerIsotope );
				timerIsotope = setTimeout(() => {
					element.isotope();
				}, 500 );
			}
		}
	});

})( jQuery );

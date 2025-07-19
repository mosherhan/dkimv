( function ( $ ) {
	"use strict";

	function debounce( func, wait, immediate ) {
		var timeout;
		return function() {
			var context = this,
				args    = arguments;

			var later = function() {
				timeout = null;
				if ( ! immediate ) {
					func.apply( context, args );
				}
			};

			var callNow = immediate && ! timeout;
			clearTimeout( timeout );
			timeout = setTimeout( later, wait );
			if ( callNow ) {
				func.apply( context, args );
			}
		};
	};

	/***** Custom rotate animation *****/
	$( window ).on( 'elementor/frontend/init', function() {
		
		var floatingEffect;
		var ModuleHandler = elementorModules.frontend.handlers.Base;

		floatingEffect = ModuleHandler.extend({
			bindEvents: function () {
				this.run();
			},

			getDefaultSettings: function() {
				return {
					direction : 'alternate',
					easing : 'easeInOutSine',
					loop : true
				};
			},
			onElementChange: debounce( function( prop ) {
				if ( prop.indexOf( 'crafto_floating' ) !== -1 ) {
					this.anime && this.anime.restart();
					this.run();
				}
			}, 400 ),
			settings: function( key ) {
				return this.getElementSettings( 'crafto_floating_effects_' + key );
			},
			run: function() {
				var options             = this.getDefaultSettings(),
					element             = this.findElement( '.elementor-widget-container' ).get(0),
					rotate_toggle       = this.settings( 'rotate_toggle' ),
					rotate_duration     = this.settings( 'rotate_duration.size' ),
					rotate_delay        = this.settings( 'rotate_delay.size' ),
					rotate_x_sizes_from = this.settings( 'rotate_x.sizes.from' ),
					rotate_x_sizes_to   = this.settings( 'rotate_x.sizes.to' ),
					rotate_y_sizes_from = this.settings( 'rotate_y.sizes.from' ),
					rotate_y_sizes_to   = this.settings( 'rotate_y.sizes.to' ),
					rotate_z_sizes_from = this.settings( 'rotate_z.sizes.from' ),
					rotate_z_sizes_to   = this.settings( 'rotate_z.sizes.to' );
				
				if ( rotate_toggle ) {
					if ( 'yes' !== this.settings( 'rotate_infinite' ) ) {
						if ( rotate_x_sizes_from.length !== 0 || rotate_x_sizes_to.length !== 0 ) {
							options.rotateX = {
								value : [rotate_x_sizes_from || 0, rotate_x_sizes_to || 0],
								duration : rotate_duration,
								delay : rotate_delay || 0
							};
						}

						if ( rotate_y_sizes_from.length !== 0 || rotate_y_sizes_to.length !== 0 ) {
							options.rotateY = {
								value : [rotate_y_sizes_from || 0, rotate_y_sizes_to || 0],
								duration : rotate_duration,
								delay : rotate_delay || 0
							};
						}

						if ( rotate_z_sizes_from.length !== 0 || rotate_z_sizes_to.length !== 0 ) {
							options.rotateZ = {
								value : [rotate_z_sizes_from || 0, rotate_z_sizes_to || 0],
								duration : rotate_duration,
								delay : rotate_delay || 0
							};
						}
					}
				}

				if ( this.settings( 'show' ) ) {
					options.targets = element;
					if ( rotate_toggle  ) {
						this.anime = window.anime && window.anime( options );
					}
				}
			}
		});

		elementorFrontend.hooks.addAction( 'frontend/element_ready/widget', function( $scope ) {
			elementorFrontend.elementsHandler.addHandler( floatingEffect, {
				$element: $scope
			});
		});
	});
})( jQuery, window.elementorFrontend );

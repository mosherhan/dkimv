let CraftoAddonsInit = {
	init: function init() {
		elementorFrontend.hooks.addAction( 'frontend/element_ready/crafto-google-maps.default', CraftoAddonsInit.googleMaps );
	},
	googleMaps:function( $scope ) {
		let target   = jQuery( $scope.find( '.google-map' ) ),
			uniqueId = target.data( 'uniqueid' ),
			settings = target.data( 'settings' ) || {};

		if ( 0 === target.length ) {
			return;
		}

		let geocoder;
		let address_arr = settings['address'];

		switch ( settings['maps_style'] ) {
			case 'retro':
				map_style = Retro
				break;
			case 'standard':
				map_style = Standard
				break;
			case 'silver':
				map_style = Silver
				break;
			case 'dark':
				map_style = Dark
				break;
			case 'night':
				map_style = Night
				break;
			case 'aubergine':
				map_style = Aubergine
				break;
			default:
				map_style = Silver
		}

		let mapOptions = {
			zoom: settings['zoom'],
			mapTypeControlOptions: {
				mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"]
			},
		}

		mapOptions.scrollwheel = false;
		if ( 'yes' === settings['scrollwheel'] ) {
			mapOptions.scrollwheel = true;
		}

		mapOptions.zoomControl = false;
		if ( 'yes' === settings['zoom_control'] ) {
			mapOptions.zoomControl = true;
		}

		mapOptions.scaleControl = false;
		if ( 'yes' === settings['scalecontrol'] ) {
			mapOptions.scaleControl = true;
		}

		mapOptions.streetViewControl = false;
		if ( 'yes' === settings['streetviewcontrol'] ) {
			mapOptions.streetViewControl = true;
		}

		mapOptions.fullscreenControl = false;
		if ( 'yes' === settings['fullscreencontrol'] ) {
			mapOptions.fullscreenControl = true;
		}

		mapOptions.disableDefaultUI = false;
		if ( 'yes' === settings['disabledefaultUI'] ) {
			mapOptions.disableDefaultUI = true;
		}
		
		if ( settings['crafto_google_maps_id'] ) {
			mapOptions.mapId = settings['crafto_google_maps_id'];
		}

		let map      = new google.maps.Map( document.getElementById( uniqueId ), mapOptions );
			geocoder = new google.maps.Geocoder();

		if ( 'cloud-based-style' !== settings['maps_style'] ) {
			let styledMapType = new google.maps.StyledMapType( map_style, { name: 'Styled Map' } );
				map.mapTypes.set( 'styled_map', styledMapType );
				map.setMapTypeId( 'styled_map' );
		}

		jQuery.each( address_arr, function( index, value ) {
			geocoder.geocode( { 'address': value['crafto_maps_address'] }, function( results, status ) {

				if ( 'OK' === status ) {

					let latitude  = results[0].geometry.location.lat();
					let longitude = results[0].geometry.location.lng();
					let infobox   = value['crafto_maps_infowindow'];

					let defaultopen  = '';
					let info_title   = '';
					let info_address = '';
					let button_text  = '';
					let button_link  = '';
					if ( 'yes' === infobox ) {
						defaultopen  = value['crafto_defaultopen_infowindow'];
						info_title   = value['crafto_infowindow_title'];
						info_address = value['crafto_infowindow_address'];
						button_text  = value['crafto_infowindow_button_text'];
						button_link  = value['crafto_infowindow_button_link'];
					}

					let flag = false;
					let infowindowContent = '<div class=infowindow>';
						infowindowContent += '<strong class="info-title">';
						infowindowContent += info_title
						infowindowContent += '</strong>';
						infowindowContent += '<p>' + info_address + '</p>';
						infowindowContent += '</div>';
						infowindowContent += '<div class="google-maps-link">';
						infowindowContent += '<a class="map-btn" aria-label="' + button_text + '" target="_blank" jstcache="31" href="' + button_link['url'] + '" jsaction="mouseup:placeCard.largerMap">' + button_text + '</a>';
						infowindowContent += '</div>';

					if ( 'default' === settings['marker_type'] ) {
						const default_marker = new google.maps.marker.AdvancedMarkerElement({
							position: { lat: latitude, lng: longitude },
							map: map,
							zIndex: 9999999
						});

						if ( 'yes' === infobox ) {
							let infowindow = new google.maps.InfoWindow({
								content: infowindowContent,
								maxWidth: settings['infobox_maxWidth'],
							});

							if ( 'yes' === defaultopen ) {
								infowindow.open({
									anchor: default_marker,
									map: map
								});
								flag = true;
							}

							default_marker.addListener( 'click', function () {
								if ( 'yes' === infobox ) {
									if ( flag === false ) {
										infowindow.open({
											anchor: default_marker,
											map: map
										});
										flag = true;
									} else {
										infowindow.close();
										flag = false;
									}
								}
							});
						}
					}
					if ( 'image' === settings['marker_type'] ) {
						const image_marker = new google.maps.marker.AdvancedMarkerElement( {
							position: { lat: latitude, lng: longitude },
							map: map
						} );

						const imageContent = document.createElement( 'img' );
						imageContent.src = settings['marker_image'];
						imageContent.alt = 'Marker';
						imageContent.style.width = settings['image_marker_width'] + 'px';
						imageContent.style.height = settings['image_marker_height'] + 'px';

						image_marker.content = imageContent;

						if ( 'yes' === infobox ) {
							let infowindow = new google.maps.InfoWindow({
								content: infowindowContent,
								maxWidth: settings['infobox_maxWidth'],
							});
					
							if ( 'yes' === defaultopen ) {
								infowindow.open({
									anchor: image_marker,
									map: map
								});
								flag = true;
							}

							image_marker.addListener( 'click', toggleBounce );
							let isBouncing = false;
					
							function toggleBounce() {
								if ( ! isBouncing ) {
									image_marker.content.style.animation = "custom-bounce .4s ease infinite alternate";
									isBouncing = true;
								} else {
									image_marker.content.style.animation = "";
									isBouncing = false;
								}

								if ( 'yes' === infobox ) {
									if ( flag === false ) {
										infowindow.open({
											anchor: image_marker,
											map: map
										});
										flag = true;
									} else {
										infowindow.close();
										flag = false;
									}
								}
							}
						}
					}

					if ( 'html' === settings['marker_type'] ) {

						function HTMLMarker( latitude, longitude ) {
							this.pos = new google.maps.LatLng( latitude, longitude );
						}

						HTMLMarker.prototype = new google.maps.OverlayView();
						HTMLMarker.prototype.onAdd = function() {

							this.div           = document.createElement( 'div' );
							this.div.className = 'arrow-box html-marker';
							this.div.innerHTML = '<span></span><span></span>';
							let panes          = this.getPanes();

							panes.overlayMouseTarget.appendChild( this.div );

							let flag = false;
							if ( 'yes' === infobox ) {
								const infowindow = new google.maps.InfoWindow({
									content: infowindowContent,
									maxWidth: settings['infobox_maxWidth'],
								});
								infowindow.setPosition( new google.maps.LatLng( latitude, longitude ) );

								if ( 'yes' === defaultopen ) {
									infowindow.setOptions( {
										pixelOffset: new google.maps.Size( 10, -30 )
									} );
									infowindow.open( map );
									flag = true;
								}

								this.div.addEventListener('click', function( event ) {
									if ( 'yes' === infobox ) {
										infowindow.setOptions( { pixelOffset: new google.maps.Size( 10, -30 ) } );
										if ( false === flag ) {
											infowindow.open( map );
											flag = true;
										} else {
											infowindow.close();
											flag = false;
										}
									}
								});
							}
						}
						
						HTMLMarker.prototype.draw = function() {
							let overlayProjection = this.getProjection();
							let position          = overlayProjection.fromLatLngToDivPixel( this.pos );
							this.div.style.left   = position.x + 'px';
							this.div.style.top    = ( position.y - 35 ) + 'px';
						}
						let htmlMarker = new HTMLMarker( latitude, longitude );
						htmlMarker.setMap( map );
					}

					map.setCenter( new google.maps.LatLng( latitude, longitude ) );

				} else {
					alert( 'Geocode was not successful for the following reason: ' + status );
				}
			});
		});
	},
}

jQuery( window ).on( 'elementor/frontend/init', CraftoAddonsInit.init );
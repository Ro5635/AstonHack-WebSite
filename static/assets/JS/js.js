		
		//Hide header content to prevent jump when positioned correctly
		//This is execute before the page is ready
		// document.getElementById("contentWrapper").style.display = "none";

		var mapDisplayed = 0;
		var fullPageGMapOpened = 0; // Only open the google map in a new tab once; it gets annoying...
		var animateMapShaddow = 0;  // Animate the maps shaddow?
		var animateSponsorLogos = 0; //Animate the sponsor logos?

		$(document).ready(function(){ 

			//Hide the map so it can be animated in
			$('#mapContainer').hide();


			//Enable footer address map tool tip
			$('a[rel="mapTip"]').tooltip();

			reCalcHeaderButtonPosition();

			$('#astonmb').removeClass('animated');


			//Calculate the initial Positioning
			reCalcHeaderButtonsState();

			//Save the menu bar offset in to datatag for later referance
			var menu = $('.mainNavBar');
			var origOffsetY = menu.offset().top;
			$('.mainNavBar').attr('data-origMenuOffsetY', origOffsetY);
			
			//Show the header elements, correct poitioning is now done
			$('#pageHeaderButtons').show();
			$('#pageHeaderContent').show();


			fixPageEndHeight();


			/// Slide in the map when it is scrolled into the viewport, use inview.js to do this
			$('#mapAddressSideBar').on('inview', function(event, isInView) {
				if (isInView) {
					if(!mapDisplayed){
   						// element is now visible in the viewport
   						$('#mapContainer').show();
   						//Initilise the google map
   						initMap();
   						//Remove the event listener
   						// $('mapAddressSideBar').off('inview'); //This does not seem to work...
						mapDisplayed = !mapDisplayed; //Stop the map from being re-inited when the user scrolls in and out
					}

					animateMapShaddow = 1;


				}else {
    				// element has gone out of viewport
    				animateMapShaddow = 0;

    			}
    		});

    		//animate the sponsor logos when they are scrolled into the viewport
    		$('#sponsorLogos').on('inview', function(event, isInView) {
    			if (isInView) {
					//element is in teh viewport
					animateSponsorLogos = 1;

				}else {
    				// element has gone out of viewport
    				animateSponsorLogos = 0;

    			}
    		});
    		


			///////

			////////// When the map is clicked take the user to google maps
			$('#mapContainer').click(function(){
				if(!fullPageGMapOpened){
					//open the maps link in a new tab
					var win = window.open('https://www.google.co.uk/maps/place/Aston+University/@52.4869136,-1.8900871,17z/data=!4m15!1m9!4m8!1m0!1m6!1m2!1s0x4870bc9ae4f2e4b3:0x9a670ba18e08a084!2sAston+University,+Aston+Express+Way,+Birmingham+B4+7ET!2m2!1d-1.8878984!2d52.4869104!3m4!1s0x4870bc9ae4f2e4b3:0x9a670ba18e08a084!8m2!3d52.4869104!4d-1.8878984?hl=en', '_blank');

					//Don't open this again
					fullPageGMapOpened = !fullPageGMapOpened;
				}
				
			});

			//Parrallx like effect on the mainbuilding as the viewport is scrolled
			$(window).scroll(function() {


				var scroll = $(window).scrollTop();

				//Update the astonMB
				requestAnimationFrame( function(){
					animateAstonMB(scroll);
				});

				if(animateMapShaddow){

					var viewPortHeight = jQuery(window).height();
					requestAnimationFrame( function(){
						animateGMapShadow(viewPortHeight)
					});

				}

				if(animateSponsorLogos){
					requestAnimationFrame(function(){
						animateSponsorLogosOnScroll();
					}); 	
				}
				


				//Recalculate the header buttons visibility
				reCalcHeaderButtonsState(scroll);

				//Handle the navigation menu bar
				handleMenuBar();

			});

			//Animates the AstonMB position based on the scrolll position
			function animateAstonMB(scrollPos){		

				var vTransformpx = ( scrollPos * -0.25)

				//Ensure that the building will not be left floating
				if( parseInt($('#astonmb').css('bottom')) < vTransformpx ){
					$("#astonmb").css("transform","translate( 0px , "  + vTransformpx + "px)");
				}

			}


			//Animate the Google maps shadow based on the scroll position
			function animateGMapShadow(viewPortHeight){

				var maxShadowOffSet = 20;	// The maximum shaddow offset in pixels

				var verticalOffsetOnVPEnter = $('#mapContainer')[0].getBoundingClientRect().top ;

				var HalfVPHeight = (viewPortHeight / 2);
				var offSetFromCenter = (verticalOffsetOnVPEnter + ($('#mapContainer').height() / 2) )- HalfVPHeight;

				//scale the offset
				var scaleFactor = HalfVPHeight / maxShadowOffSet;
				var shaddowOffset = Math.round(offSetFromCenter / scaleFactor);
				// console.log('offset S: ' + shaddowOffset);

				//This now needs to happen in the HTML5 requestAnimationFrame...
				$('#mapContainer').css('box-shadow', '0 ' + shaddowOffset + 'px 20px 2px #000');
				// box-shadow: 0 0px 20px 2px #000; 



			}

			//Animate the sponsor logos
			function animateSponsorLogosOnScroll(){

				var VPHeight = jQuery(window).height();

				var logoRowYOffSet = $('#sponsorLogos')[0].getBoundingClientRect().top;

				var goldVerticalOffSet = ($('#goldSponsorRow')[0].getBoundingClientRect().top - ($('#goldSponsorRow').height() / 2));
				var silverVerticalOffSet = ($('#silverSponsorRow')[0].getBoundingClientRect().top - ($('#silverSponsorRow').height() / 2));
				var bronzeVerticalOffSet = ($('#bronzeSponsorRow')[0].getBoundingClientRect().top - ($('#bronzeSponsorRow').height() / 2));

				var goldTranslationy = goldVerticalOffSet * 0.10;
				var silverTranslationy = silverVerticalOffSet * 0.09;
				var bronzeTranslationy = silverVerticalOffSet * 0.09;
				// console.log("Gold Level: " + goldTranslationy + " silv level: " + silverTranslationy);

				//Gold Sponsors:
				if(goldVerticalOffSet < (VPHeight*0.70)){
					$('.goldSponsorLogo').css('transform','scale3d(1.55,1.55,1.55) translate3d(0px, ' + goldTranslationy + 'px, 0px)');
					// $('.goldSponsorLogo').css('margin-bottom','45%');
				}else{
					$('.goldSponsorLogo').css('transform','translate3d(0px, ' + goldTranslationy + 'px, 0px)');
					// $('.goldSponsorLogo').css('margin-bottom','5%');
				}

				//Silver Sponsors:
				if(silverVerticalOffSet < (VPHeight*0.62)){
					$('.silverSponsorLogo').css('transform','scale3d(1.45,1.45,1.45) translate3d(0px, ' + silverTranslationy + 'px, 0px)');	
					// $('.silverSponsorLogo').css('margin-bottom','65%');

				}else{
					$('.silverSponsorLogo').css('transform','translate3d(0px, ' + silverTranslationy + 'px, 0px)');
					// $('.silverSponsorLogo').css('margin-bottom','0%');
				}

				//Bronze Sponsors:
				if(silverVerticalOffSet < (VPHeight*0.30)){
					$('.bronzeSponsorLogo').css('transform','scale3d(1.35,1.35,1.35) translate3d(0px, ' + bronzeTranslationy + 'px, 0px)');	
					// $('.bronzeSponsorLogo').css('margin-top','30%');

				}else{
					$('.bronzeSponsorLogo').css('transform','translate3d(0px, ' + bronzeTranslationy + 'px, 0px)');
					// $('.bronzeSponsorLogo').css('margin-top','0%');
				}


				//transform: translate3d(10px,0px,0px);

			}
			


			function handleMenuBar(){
			//Handle the menu bar
			var origOffsetY = $('.mainNavBar').attr('data-origMenuOffsetY');

			if($(window).scrollTop() >= (origOffsetY * 0.9)){
				$('.mainNavBar').css('background-color', '#ecf0f1' );
				$('.mainNavLinks li').css('margin-right', '5vw' );
			}

			if ($(window).scrollTop() >= origOffsetY) {
				$('.mainNavBar').addClass('fixed-top');
					//add padding to prevent jump with loss of nav bar
					navBarHeight = parseInt($('.mainNavBar').css('height'));
					$('.pageContentSection').filter(":first").css('padding-top',  navBarHeight);

				} else {
					$('.mainNavBar').removeClass('fixed-top');
					$('.mainNavBar').css('background-color', '#FFF' );
					$('.mainNavLinks li').css('margin-right', '0vw' );
					$('.pageContentSection').filter(":first").css('padding-top', 0)

				}
			}


			//Calculates and applies the position of the header buttons
			function reCalcHeaderButtonPosition(scroll){

				//Is a value for scroll passed
				if(typeof scroll === 'undefined'){ scroll = $(window).scrollTop(); }

				//Display the header buttons in correct pos now page is loaded
				var headerWidth = parseInt( $("#pageHeader").css('width'));
				var headerHeight = parseInt( $("#pageHeader").css('height'));

				//Has the width of the rendered button been found
				if(typeof $('#pageHeaderButtons').attr('data-registrationButtWidth') === 'undefined'){

					//Save the width of the rendered button for later use, this is not accesible when
					//the button is hidden so must be found and recorded now
					var headerButtonsWidth = parseInt( $("#pageHeaderButtons").css('width'));
					$('#pageHeaderButtons').attr('data-registrationButtWidth', headerButtonsWidth);
					
				}

				 //Has the height of the rendered content been found
				 if(typeof $('#pageHeaderContent').attr('data-contentHeight') === 'undefined'){

					//Save the width of the rendered button for later use, this is not accesible when
					//the button is hidden so must be found and recorded now
					var headerContentHeight = parseInt( $("#pageHeaderContent").css('height'));
					$('#pageHeaderContent').attr('data-contentHeight', headerContentHeight);
					
				}


					//Has the width of the rendered content been found
					if(typeof $('#pageHeaderContent').attr('data-contentWidth') === 'undefined'){

					//Save the width of the rendered button for later use, this is not accesible when
					//the button is hidden so must be found and recorded now
					var headerContentWidth = parseInt( $("#pageHeaderContent").css('width'));
					$('#pageHeaderContent').attr('data-contentWidth', headerContentWidth);
					
				}


				var headerButtonsHeight = parseInt($('#pageHeaderContent').attr('data-contentHeight'));
				var headerButtonsWidth = $('#pageHeaderButtons').attr('data-registrationButtWidth')
				var headerButtonsCentre = (headerWidth / 2 ) - (headerButtonsWidth / 2);
				var headerContentWidth = $('#pageHeaderContent').attr('data-contentWidth');
				var headerContentCentre = (headerWidth / 2 ) - (headerContentWidth / 2);

				var headerButtonsTop = headerHeight * 0.40;
				var headerContentTop = headerButtonsTop + headerButtonsHeight + (headerHeight * 0.04) ;								//THIS ALL NEEDS REFACTORING...

				// $('#pageHeaderButtons').css('left', headerButtonsCentre + 'px' );
				// $('#pageHeaderButtons').css('top', headerButtonsTop + 'px' );
				$('#contentWrapper').css('top', headerButtonsTop + 'px' );

				// $('#pageHeaderContent').css('left', headerContentCentre + 'px' );
				$('#pageHeaderContent').css('top', headerContentTop + 'px' );

				$('#contentWrapper').addClass('animated');
				$('#contentWrapper').addClass('bounceIn');
				//Show the content
				$('#contentWrapper').css('display','block');

			}

			/**
			Calculates the visibility of the header buttons and hies them when the building is set to scroll overthem
			sets z-index initialy so they gracefuly leave the view and then is hidden. Reverse is done when scrolling back.
			*/
			function reCalcHeaderButtonsState(scroll){

				var pageHeaderHeight = parseInt( $("#pageHeader").css('height'));
				//var requiredClerance = parseInt($('#pageHeaderButtons').css('top')) + parseInt($('#pageHeaderButtons').css('height'));
				//var mbHidePoint = parseInt( $("#astonmb").css('height')) * 0.35;

				//calculate the position as which to move the buttons to the lower layer, 0.2 was found from trial and error
				var hideHeaderButtScrollPos = pageHeaderHeight * 0.16; // (pageHeaderHeight - requiredClerance) - mbHidePoint;

				var buttonsVisible = $('#pageHeaderButtons').is(":visible");
				
				if(scroll > hideHeaderButtScrollPos){
					//show
					$('#astonmb').css('z-index', 3);
				}else{
					//move z-index so building will slide overtop
					$('#astonmb').css('z-index', -1);
				}

				if(scroll > pageHeaderHeight && buttonsVisible){
					//hide header buttons
					$('#pageHeaderButtons').hide();
					$('#pageHeaderContent').hide();

				}else if(scroll < pageHeaderHeight && !buttonsVisible){
					//show header buttons
					$('#pageHeaderButtons').show();
					$('#pageHeaderContent').show();
					//Move to correct position
					reCalcHeaderButtonPosition();

				}

			}


			/**
			Recalcualate the positioning and apply to the aston uni image
			*/
			function recalcOnWindowResize() {

				var headerWidth = window.innerWidth || document.body.clientWidth;
				var headerHeight =  window.innerHeight || document.body.clientHeight;//parseInt( $("#pageHeader").css('height'));
				var mBImageHeight = parseInt( $("#astonmb").css('height'));

				if(mBImageHeight < 10){
					//There seems to be occerances where the image has not yet loaded yet, this means it has no height. Maths is a bit difficult without the
					//height value; so set a call back for when the image is actualy loaded.

					var mainBuildImage = document.querySelector('#astonmb')

					function mBLoadedReRun() {
						recalcOnWindowResize();
						console.log("Race condition bypassed; really need a long term solution to this...");
					}

					if(mainBuildImage.complete) {
						mBLoadedReRun();

					} else{
						mainBuildImage.addEventListener('load', mBLoadedReRun)

					}


				}

				if(headerWidth > 2000){
					var mBOffSet = -((headerHeight * 0.05)  + (mBImageHeight * 0.3));

				}else if(headerWidth > 1500){
					var mBOffSet = -((headerHeight * 0.025)  + (mBImageHeight * 0.3));

				}else{
					var mBOffSet = -(mBImageHeight * 0.3);

				}

				$('#astonmb').css('bottom', mBOffSet);
				console.log("recalcOnResize, mBOffSet: " + mBOffSet);

				//Fix the new height of the pageEnd
				fixPageEndHeight();


			}



			$(function () {
				recalcOnWindowResize();



				$(window).resize(function() {
					recalcOnWindowResize();
					reCalcHeaderButtonPosition();
				});
			});

			/*
			//	Update the height of the pageEnd element to the height of the footer, this allows for the user
			//	to scroll only the required height.
			*/
			function fixPageEndHeight(){
				var requiredHeight = parseInt($('footer').css('height'));
				//Apply the height to the pageEnd element 
				$('#pageEnd').css('height', requiredHeight);

			}

			//?
			document.cookie = "EssentialTimes=Tuesdays and Thursdays, 6.30 - 8.30. 1st session is Free";

			//Right at the end do this again; solves some wierd race condition that occers sometimes. Quite what causes it is still under investigation...
		//	recalcOnWindowResize();



	}); 





		
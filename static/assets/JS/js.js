		//Hide header content to prevent jump when positioned correctly
		//This is execute before the page is ready
		// document.getElementById("contentWrapper").style.display = "none";

		var mapDisplayed = 0;
		var fullScreenMapAsked = 0; // Only open the google map in a new tab once; it gets annoying...
		var animateMapShaddow = 0;  // Animate the maps shaddow?
		var animateSponsorLogos = 0; //Animate the sponsor logos?

		//Current menu section tracker
		aboutSectionCurrent = 0;
		sponsorSectionCurrent = 0;
		scheduleSectionCurrent = 0;

		//is there sufficient v soace for all of the controls
		GLOBALInsufficientVPHeight = 0;

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
			var origOffsetY = $("#pageHeader").height();

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
					//element is in the viewport
					animateSponsorLogos = 1;


				}else {
    				// element has gone out of viewport
    				animateSponsorLogos = 0;

    			}
    		});

    		/////// Handle the updating of the sections of the nav bar
    		
    		$('#sponsorLogos').on('inview', function(event, isInView) {
    			if (isInView) {
					//Set the sponsor section to active and all outhers to inactive
					if( !( $('#sponsorLink').hasClass('active') )){
						
						$(".mainNavLinks>li.active").removeClass("active");
						$('#sponsorLink').addClass('active');
					}


				}else {

				}
			});


    		$('#scheduleSegment').on('inview', function(event, isInView) {
    			if (isInView) {
					//Set the sponsor section to active and all outhers to inactive
					if( !( $('#schedLink').hasClass('active') )){
						
						$(".mainNavLinks>li.active").removeClass("active");
						$('#schedLink').addClass('active');
					}


				}else {

				}
			});
    		

    		$('#aboutSegment').on('inview', function(event, isInView) {
    			if (isInView) {
					//Set the sponsor section to active and all outhers to inactive
					if( !( $('#aboutLink').hasClass('active') )){
						
						$(".mainNavLinks>li.active").removeClass("active");
						$('#aboutLink').addClass('active');
					}


				}else {

				}
			});

			///////

			////////// When the map is clicked ask the user if they want to be taken to google maps
			$('#mapContainer').click(function(){
				//Allow the map to be controlled again:
				$('#map').css("pointer-events", "auto");
				if(!fullScreenMapAsked){
					//ask the user if they want to view in google maps
					$('#generalModelBody').html('<p>Do you want to open the map full screen in Google maps?</p>');
					$('#generalModelAdditionalButtons').html('<button id="btnOpenGMapsFull" type="button" class="btn btn-secondary" data-dismiss="modal">Go Full Screen</button>');
					$('#generalModel').modal('show')

					//Don't ask this again
					fullScreenMapAsked = !fullScreenMapAsked;
				}
				
			});

			//Open the general model configured to handle a mailing list sign up
			$('.openMCSignUp').click(function(){
				$('#generalModelBody').html('<link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css"><div id="mc_embed_signup"><form action="//astonhack.us16.list-manage.com/subscribe/post?u=18b58febfa384b200eac98c58&amp;id=6967a3252d" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate><div id="mc_embed_signup_scroll"><label for="mce-EMAIL">Subscribe for updates</label><input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required><!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups--><div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_18b58febfa384b200eac98c58_6967a3252d" tabindex="-1" value=""></div><div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div></div></form></div>');
				//Remove any additionl buttons
				$('#generalModelAdditionalButtons').html('');
				$('#generalModel').modal('show')

			});


			//Handle the button press on the "Open full screen map?" model
			$('#generalModelAdditionalButtons').on('click', '#btnOpenGMapsFull', function() {
				//open the maps link in a new tab
				var win = window.open('https://www.google.co.uk/maps/place/Aston+University/@52.4869136,-1.8900871,17z/data=!4m15!1m9!4m8!1m0!1m6!1m2!1s0x4870bc9ae4f2e4b3:0x9a670ba18e08a084!2sAston+University,+Aston+Express+Way,+Birmingham+B4+7ET!2m2!1d-1.8878984!2d52.4869104!3m4!1s0x4870bc9ae4f2e4b3:0x9a670ba18e08a084!8m2!3d52.4869104!4d-1.8878984?hl=en', '_blank');

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

			function reCalcMenuBar(){
				//Save the menu bar offset in to datatag for later referance
				var menu = $('.mainNavBar');
				var origOffsetY = menu.offset().top;
				$('.mainNavBar').attr('data-origMenuOffsetY', origOffsetY);
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
				//var headerButtonsWidth = $('#pageHeaderButtons').attr('data-registrationButtWidth')
				var headerButtonsCentre = (headerWidth / 2 ) - (headerButtonsWidth / 2);
				//var headerContentWidth = $('#pageHeaderContent').attr('data-contentWidth');
				var headerContentCentre = (headerWidth / 2 ) - (headerContentWidth / 2);

				var headerButtonsTop = headerHeight * 0.38;
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

				var headerLogoVisible = $('#astonHackHeaderLogo').is(":visible");

				// var headerWidth = window.innerWidth || document.body.clientWidth;
				// var headerHeight =  window.innerHeight || document.body.clientHeight;

				// var screenRatio = headerWidth / headerHeight;

				//Arrange the layers as necasary
				if(scroll > hideHeaderButtScrollPos){
					//show
					$('#astonmb').css('z-index', 3);
				}else{
					//move z-index so building will slide overtop
					$('#astonmb').css('z-index', -1);
				}

				//Do the buttons need to be hidden?
				if(scroll > pageHeaderHeight && (buttonsVisible || headerLogoVisible)){
					//hide header buttons
					hideHeaderElements();

				}else if(scroll < pageHeaderHeight && !buttonsVisible){
					
					//show header buttons
					showHeaderElements(GLOBALInsufficientVPHeight);
					
					//Move to correct position
					reCalcHeaderButtonPosition();
					

				}

			}

			function hideHeaderElements(){

				//hide header buttons
				$('#pageHeaderButtons').hide();
				//hide the header content
				$('#pageHeaderContent').hide();

				//Addition of the AH logo to the hide
				$('#astonHackHeaderLogo').hide();
				//Hide the scroll down reminder arrow
				$('#scrollDownReminderArrow').hide();

			}

			//Hide the elements that are not to be shown when V space is limited in the header
			function hideinsufficientVPHeightElements(){
				//hide header buttons
				$('#pageHeaderButtons').hide();
				//hide the header content
				$('#pageHeaderContent').hide();
				//Hide the scroll down reminder arrow
				$('#scrollDownReminderArrow').hide();

			}

			function showHeaderElements(insufficientVertHeight){

				if(insufficientVertHeight){

					//The AH logo to this
					$('#astonHackHeaderLogo').show();

				}else{

					//show header buttons
					$('#pageHeaderButtons').show();
					//show the header content
					$('#pageHeaderContent').show();
					//addition of the AH logo to this
					$('#astonHackHeaderLogo').show();
					//Also show the scroll down arrow
					$('#scrollDownReminderArrow').show();

				}



			}


			/**
			Recalcualate the positioning and apply to the aston uni image
			*/
			function reCalcAstonMBPos() {

				var headerWidth = window.innerWidth || document.body.clientWidth;
				var headerHeight =  window.innerHeight || document.body.clientHeight;
				var mBImageHeight = parseInt( $("#astonmb").css('height'));

				if(mBImageHeight < 10){
					//There seems to be occerances where the image has not yet loaded yet, this means it has no height. Maths is a bit difficult without the
					//height value; so set a call back for when the image is actualy loaded.

					var mainBuildImage = document.querySelector('#astonmb')

					function mBLoadedReRun() {
						reCalcAstonMBPos();
						console.log("Race condition bypassed; really need a long term solution to this...");
					}

					if(mainBuildImage.complete) {
						mBLoadedReRun();

					} else{
						mainBuildImage.addEventListener('load', mBLoadedReRun)

					}


				}


				//handle the small V height screens

				mBOffSet = mBImageHeight - (headerHeight * 2/3);

				if(mBOffSet < (mBImageHeight * 0.3)){
					mBOffSet = 	(mBImageHeight * 0.3);
				}

				$('#astonmb').css('bottom', -mBOffSet);

			}


			function handleSmallVHeightScreens(){

				buttonOffset = $('#pageHeaderButtons')[0].getBoundingClientRect().top;
				logoHeight = $('#astonHackHeaderLogo').height() + 15;

				if(buttonOffset < logoHeight){
					//Hide header elements there is not enough space
					hideinsufficientVPHeightElements();
					GLOBALInsufficientVPHeight = 1;

				}else{
					//there is sufficent V height for all of the elements
					GLOBALInsufficientVPHeight = 0;
					//Running showHeaderElements() is technicaly a bad idea but one notch of scroll will fix any issues
					showHeaderElements(GLOBALInsufficientVPHeight);
					reCalcHeaderButtonsState();

				}
			}

			//Calls all of the functions required to handle changes in the screen size
			function handleScreenSizeChange(){

				reCalcAstonMBPos();
				showHeaderElements(false);
				reCalcHeaderButtonPosition();
				reCalcHeaderButtonsState();
				handleSmallVHeightScreens();
				//Ensure the update value is correct for the menu
				reCalcMenuBar();
				//Fix the new height of the pageEnd
				fixPageEndHeight();

			}

			/*
			//	Update the height of the pageEnd element to the height of the footer, this allows for the user
			//	to scroll only the required height.
			*/
			function fixPageEndHeight(){
				var requiredHeight = parseInt($('footer').css('height'));
				//Apply the height to the pageEnd element 
				$('#pageEnd').css('height', requiredHeight);

			}


			$(function () {
				handleScreenSizeChange();

				$(window).resize(function() {
					// //TMP
					// var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
					// var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

					// console.log('RATIO x/y: ' + w/h);
					// // console.log('RATIO y/x: ' + h/w);

					// //END TMP
					handleScreenSizeChange();


				});
			});


			//?
			document.cookie = "EssentialTimes=Tuesdays and Thursdays, 6.30 - 8.30. 1st session is Free";


		}); 





		
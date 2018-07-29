/*
*
* These are the base scripts for the astonhack site
*
* AstonHack 2017
*/

var mapDisplayed = 0;
var fullScreenMapAsked = 0; // Only open the google map in a new tab once; it gets annoying...
var animateMapShaddow = 0;  // Animate the maps shaddow?
var animateSponsorLogos = 0; //Animate the sponsor logos?
var scrollDownArrowRotating = 1; //Is the scroll down arrow animating?

//Current menu section tracker
aboutSectionCurrent = 0;
sponsorSectionCurrent = 0;
scheduleSectionCurrent = 0;

//is there sufficient v space for all of the controls
GLOBALInsufficientVPHeight = 0;

var images = [
    {
        left: {src: "assets/media/2017Photos/AstonHack201701.JPG", width: 35},
        right: {src: "assets/media/2017Photos/AstonHack201702.JPG", width: 65}
    },
    {
        left: {src: "assets/media/2017Photos/AstonHack201704.JPG", width: 40},
        right: {src: "assets/media/2017Photos/AstonHack201703.JPG", width: 60}
    },
    {
        left: {src: "assets/media/2017Photos/AstonHack201705.JPG", width: 20},
        right: {src: "assets/media/2017Photos/AstonHack201706.JPG", width: 80}
    },
    {
        left: {src: "assets/media/2017Photos/AstonHack201714.JPG", width: 35},
        right: {src: "assets/media/2017Photos/AstonHack201713.JPG", width: 65}
    },
    {
        left: {src: "assets/media/2017Photos/AstonHack201707.JPG", width: 80},
        right: {src: "assets/media/2017Photos/AstonHack201708.JPG", width: 20}
    },
    {
        left: {src: "assets/media/2017Photos/AstonHack201709.JPG", width: 35},
        right: {src: "assets/media/2017Photos/AstonHack201715.JPG", width: 65}
    },
    {
        left: {src: "assets/media/2017Photos/AstonHack201712.JPG", width: 35},
        right: {src: "assets/media/2017Photos/AstonHack201711.JPG", width: 65}
    },
];



function imageFadeSwitcher(imageID, newSrc, animation) {

    var element = document.getElementById(imageID);

    element.classList.remove("animated");
    element.classList.remove("slideInRight");
    element.classList.remove("slideInLeft");

    // Start Fadeout
    element.classList.add("opacityZero");



    setTimeout(function () {

        switch (animation) {
            case 'left':
                element.classList.add("slideInLeft");
                break;

            case 'right':
                element.classList.add("slideInRight");
                break;

        }


        element.src = '';
        element.src = newSrc;

        setTimeout(function(){
            element.classList.remove("opacityZero");
            element.classList.add("animated");


        }, 150);


    }, 600);
}


$(document).ready(function(){

	//Hide the map so it can be animated in
	$('#mapContainer').hide();


	//Enable footer address map bootstrap tool tip
	$('a[rel="mapTip"]').tooltip();

	// Depending on the available space show or hide the buttons
	// this should really be done with CSS breakpoints...
	reCalcHeaderButtonPosition();

	$('#astonmb').removeClass('animated');


	//Calculate the initial Positioning
	reCalcHeaderButtonsState();

	//Save the menu bar offset in to datatag for later reference
	var origOffsetY = $("#pageHeader").height();

	$('.mainNavBar').attr('data-origMenuOffsetY', origOffsetY);
	
	//Show the header elements, correct positioning is now done
	$('#pageHeaderButtons').show();
	$('#pageHeaderContent').show();

	//Handle The Footer Images and the footer height
	var footerImages = document.getElementsByClassName('footerImage');
	var countOfLoadedImages = 0;

	//for each of the images in the array if it is loaded iterate up the loaded images count, otherwise add a call back on load 
	for(var i = 0; i < footerImages.length; i++){
		var image = footerImages[i];

		//Has the image finished loading?
		if(image.complete){
			//The image is in place, does not need a call back to recalculate footer height when it loads
			countOfLoadedImages++;

		}else{
			//The image has not finished loading, add call backs to the image to prompt recalculation of footer height on load
			image.addEventListener('load', fixPageEndHeight());
			//catch load error
			image.addEventListener('error', function() {
				//If the image fails to load still run the footer height calculator
				fixPageEndHeight();
			});

			// console.log('CallBack for image load added on: ' + image.src)

		}

	}

	//Update the page footer height if there were loaded images
	if(countOfLoadedImages > 0){
		fixPageEndHeight();	
	}


		//Causes double running but catches issues, revisit this...
		handleScreenSizeChange();

	//Call the resize handler on screen resize
	$(window).resize(function() {
		handleScreenSizeChange();

	});


	/**
	* isElementDisplayNone
	*
	* Returns boolean as to if the passed element is set to display none
	*/
	function isElementDisplayNone(targetElement) {
		var elementCurrentStyles = window.getComputedStyle(targetElement);
    	var elementCurrentDisplayValue = elementCurrentStyles.getPropertyValue("display");

    	return (elementCurrentDisplayValue === 'none');

	}

    var imageIndex = 1;
	var preLoadedImages = [];
	var cycledAtLeastOnce = false;
	var desktopImageSlider = document.getElementById("desktopImageSlider");

    setInterval(function () {

    	// If the desktop slider is not visible do not update it
    	if(isElementDisplayNone(desktopImageSlider)) return;
    	
        imageFadeSwitcher("lefthandImage", images[imageIndex].left.src, 'left');
        imageFadeSwitcher("righthandImage", images[imageIndex].right.src, 'right');


        // Pre load the next Image
		if (!cycledAtLeastOnce) {
			console.log('Preloading init');
			console.log(images[imageIndex].left.src);
			preload(images[imageIndex].left.src, images[imageIndex].right.src);

		}

        imageIndex++;

        if (imageIndex >= images.length) {

			// Final images load
			// preload(images[imageIndex].left.src, images[imageIndex].right.src);

            imageIndex = 0;
            cycledAtLeastOnce = true;
        }


    }, 3500);

    // Mobile Image slider
    var mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    pagination: {
    	el: '.swiper-pagination',
    },

    autoplay: {
    delay: 2200,
  	}
	})
	

	///////////////////////
	// FUNCTIONS
	///////////////////////

    function preload() {
        for (var i = 0; i < arguments.length; i++) {
            preLoadedImages[i] = new Image();
            preLoadedImages[i].src = preload.arguments[i];
        }
    }

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
			//Set the sponsor section to active and all others to inactive
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

	//Quick and dirty bug fix, I need to go to bed. Will refactor.			
	$('#pageEnd').on('inview', function(event, isInView) {
		if (isInView) {
			//Re-run the height calculator
			fixPageEndHeight();

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

	//Handle the button press on the "Open full screen map?" model
	$('#generalModelAdditionalButtons').on('click', '#btnOpenGMapsFull', function() {
		//open the maps link in a new tab
		var win = window.open('https://www.google.co.uk/maps/place/Aston+University/@52.4869136,-1.8900871,17z/data=!4m15!1m9!4m8!1m0!1m6!1m2!1s0x4870bc9ae4f2e4b3:0x9a670ba18e08a084!2sAston+University,+Aston+Express+Way,+Birmingham+B4+7ET!2m2!1d-1.8878984!2d52.4869104!3m4!1s0x4870bc9ae4f2e4b3:0x9a670ba18e08a084!8m2!3d52.4869104!4d-1.8878984?hl=en', '_blank');

	});

	function configureGeneralModel(theBody,theIcon,theTitle, weblink){
		$('#generalModelBody').html('<p>' + theBody +'</p>');
		$('#generalModelTitle').html(theTitle);
		if(weblink){
			$('#generalModelAdditionalButtons').html('<a href="' + weblink + '" target="_blank"><button type="button" class="btn btn-secondary" data-dismiss="modal">More Info</button></a>');
			
		}else{
			$('#generalModelAdditionalButtons').html('');
		}

		$('#generalModel').modal('show')
	}


	//Parallax like effect on the main building as the viewport is scrolled
	$(window).scroll(function() {


		var scroll = $(window).scrollTop();

		//Update the astonMB
		requestAnimationFrame( function(){
			animateAstonMB(scroll);
		});

		// Should the map shadow be animated?
		if(animateMapShaddow){

			var viewPortHeight = jQuery(window).height();
			requestAnimationFrame( function(){
				animateGMapShadow(viewPortHeight)
			});

		}

		// SHould the logos be animated?
		if(animateSponsorLogos){
			requestAnimationFrame(function(){
				animateSponsorLogosOnScroll();
			}); 	
		}

		if(scrollDownArrowRotating){
			//Now the user has scrolled stop the arrow rotating, its to much of a performance drain!
			//And safari wierdness happens when a lower layer is being animated 
			$('#scrollDownReminderArrow').removeClass('rotateAroundY');
			
			//The animation is now stopped
			scrollDownArrowRotating = 0;

		}
		


		//Recalculate the header buttons visibility
		reCalcHeaderButtonsState(scroll);

		//Handle the navigation menu bar
		handleMenuBar();

	});

	//Animates the AstonMB position based on the scroll position
	function animateAstonMB(scrollPos){		

		var vTransformpx = ( scrollPos * -0.25)

		//Ensure that the building will not be left floating
		if( parseInt($('#astonmb').css('bottom')) < vTransformpx ){
			$("#astonmb").css("transform","translate( 0px , "  + vTransformpx + "px)");
		}

	}


	//Animate the Google maps shadow based on the scroll position
	function animateGMapShadow(viewPortHeight){

		var maxShadowOffSet = 20;	// The maximum shadow offset in pixels

		var verticalOffsetOnVPEnter = $('#mapContainer')[0].getBoundingClientRect().top ;

		var HalfVPHeight = (viewPortHeight / 2);
		var offSetFromCenter = (verticalOffsetOnVPEnter + ($('#mapContainer').height() / 2) )- HalfVPHeight;

		// Scale the offset
		var scaleFactor = HalfVPHeight / maxShadowOffSet;
		var shaddowOffset = Math.round(offSetFromCenter / scaleFactor);

		// This now needs to happen in the HTML5 requestAnimationFrame...
		$('#mapContainer').css('box-shadow', '0 ' + shaddowOffset + 'px 20px 2px rgba(0,0,0,0.31)');
		// box-shadow: 0 0px 20px 2px #000; 



	}

	//Animate the sponsor logos
	function animateSponsorLogosOnScroll(){

		var VPHeight = jQuery(window).height();

		var logoRowYOffSet = $('#sponsorLogos')[0].getBoundingClientRect().top;

		var goldVerticalOffSet = ($('#goldSponsorRow')[0].getBoundingClientRect().top - ($('#goldSponsorRow').height() / 2));
		var goldHardwareVerticalOffSet = ($('#goldHardwareSponsorRow')[0].getBoundingClientRect().top - ($('#goldHardwareSponsorRow').height() / 2));
		var silverVerticalOffSet = ($('#silverSponsorRow')[0].getBoundingClientRect().top - ($('#silverSponsorRow').height() / 2));
		var bronzeVerticalOffSet = ($('#bronzeSponsorRow')[0].getBoundingClientRect().top - ($('#bronzeSponsorRow').height() / 2));

		// Center the Y movement around the color title
		var yOffSet = 0.03 * VPHeight;

		//Remove the Y offset from the fractional Y displacement to move center of movement up.
		var goldTranslationy = (goldVerticalOffSet * 0.10) - yOffSet;
		var goldHardwareTranslationy = (goldHardwareVerticalOffSet * 0.10) - yOffSet;
		var silverTranslationy = (silverVerticalOffSet * 0.09) - yOffSet;
		var bronzeTranslationy = (silverVerticalOffSet * 0.09) - yOffSet;
		// console.log("Gold Level: " + goldTranslationy + " silver level: " + silverTranslationy);

		//Gold Sponsors:
		if(goldVerticalOffSet < (VPHeight*0.70)){
			$('.goldSponsorLogo').css('transform','scale3d(1.4,1.4,1.4) translate3d(0px, ' + goldTranslationy + 'px, 0px)');
			// $('.goldSponsorLogo').css('margin-bottom','45%');
		}else{
			$('.goldSponsorLogo').css('transform','translate3d(0px, ' + goldTranslationy + 'px, 0px)');
			// $('.goldSponsorLogo').css('margin-bottom','5%');
		}

		// Gold Hardware Sponsors
		if(goldHardwareVerticalOffSet < (VPHeight*0.70)){
			$('.goldHardwareSponsorLogo').css('transform','scale3d(1.15,1.15,1.15) translate3d(0px, ' + goldHardwareTranslationy + 'px, 0px)');


		}else{
			$('.goldHardwareSponsorLogo').css('transform','translate3d(0px, ' + goldHardwareTranslationy + 'px, 0px)');

		}

		//Silver Sponsors:
		if(silverVerticalOffSet < (VPHeight*0.62)){
			$('.silverSponsorLogo').css('transform','scale3d(1.2,1.2,1.2) translate3d(0px, ' + silverTranslationy + 'px, 0px)');	


		}else{
			$('.silverSponsorLogo').css('transform','translate3d(0px, ' + silverTranslationy + 'px, 0px)');

		}

		//Bronze Sponsors:
		if(bronzeVerticalOffSet < (VPHeight*0.60)){
			$('.bronzeSponsorLogo').css('transform','scale3d(1.35,1.35,1.35) translate3d(0px, ' + bronzeTranslationy + 'px, 0px)');	


		}else{
			$('.bronzeSponsorLogo').css('transform','translate3d(0px, ' + bronzeTranslationy + 'px, 0px)');

		}


	}
	


	function handleMenuBar(){

		var expandedColour  = 'rgb(52, 51, 51)';//'#ecf0f1';//'rgb(52, 51, 51)';
		var minimisedColour = '#FFF';

		//Handle the menu bar
		var origOffsetY = $('.mainNavBar').attr('data-origMenuOffsetY');

		if($(window).scrollTop() >= (origOffsetY * 0.9)){
			$('.mainNavBar').css('background-color', expandedColour );
			$('.mainNavLinks li').css('margin-right', '5vw' );
			$('.mainNavLinks li a').css('color', 'white' );
		}

		if ($(window).scrollTop() >= origOffsetY) {
			$('.mainNavBar').addClass('fixed-top');
				//add padding to prevent jump with loss of nav bar
				navBarHeight = parseInt($('.mainNavBar').css('height'));
				$('.pageContentSection').filter(":first").css('padding-top',  navBarHeight);

			} else {
				$('.mainNavBar').removeClass('fixed-top');
				$('.mainNavBar').css('background-color', minimisedColour );
				$('.mainNavLinks li a').css('color', '' );
				$('.mainNavLinks li').css('margin-right', '0vw' );
				$('.pageContentSection').filter(":first").css('padding-top', 0)

			}
		}

		function reCalcMenuBar(){
		//Save the menu bar offset in to datatag for later reference
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

			//Save the width of the rendered button for later use, this is not accessible when
			//the button is hidden so must be found and recorded now
			var headerButtonsWidth = parseInt( $("#pageHeaderButtons").css('width'));
			$('#pageHeaderButtons').attr('data-registrationButtWidth', headerButtonsWidth);
			
		}

		 //Has the height of the rendered content been found
		 if(typeof $('#pageHeaderContent').attr('data-contentHeight') === 'undefined'){

			//Save the width of the rendered button for later use, this is not accessible when
			//the button is hidden so must be found and recorded now
			var headerContentHeight = parseInt( $("#pageHeaderContent").css('height'));
			$('#pageHeaderContent').attr('data-contentHeight', headerContentHeight);
			
		}


			//Has the width of the rendered content been found
			if(typeof $('#pageHeaderContent').attr('data-contentWidth') === 'undefined'){

			//Save the width of the rendered button for later use, this is not accessible when
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
	Calculates the visibility of the header buttons and hies them when the building is set to scroll over them
	sets z-index initially so they gracefully leave the view and then is hidden. Reverse is done when scrolling back.
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
			//move z-index so building will slide over top
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


	//hide all of the header elements, this is so they do not interfere when off screen.
	function hideHeaderElements(){
		//Hide all header elements
		$('.hideableHeaderElement').hide();

	}

	//Hide the elements that are not to be shown when vertical space is limited in the header
	function hideinsufficientVPHeightElements(){
		$('.largerScreenHeaderElements').hide()

	}

	//Show the header elements
	function showHeaderElements(insufficientVertHeight){

		if(insufficientVertHeight){
			//There is not enough screen height to show more than the basic elements
			$('.smallScreenOnlyHeaderElements').show();

		}else{
			//There is enough vertical screen height to show everything
			$('.hideableHeaderElement').show();


		}



	}


	/**
	*	Recalculate the positioning and apply to the aston uni image
	*/
	function reCalcAstonMBPos() {

		var headerWidth = window.innerWidth || document.body.clientWidth;
		var headerHeight =  window.innerHeight || document.body.clientHeight;
		var mBImageHeight = parseInt( $("#astonmb").css('height'));

		if(mBImageHeight < 10){
			//There seems to be occerances where the image has not yet loaded yet, this means it has no height. Maths is a bit difficult without the
			//height value; so set a call back for when the image is actually loaded.

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
			//there is sufficient V height for all of the elements
			GLOBALInsufficientVPHeight = 0;
			//Running showHeaderElements() is technically a bad idea but one notch of scroll will fix any issues
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
	//	This should only be ran when all of the images in the footer have been loaded, this is best achieved by
	//	running each time an image is finished. just in case all of the images are never fully acquired.
	*/	 
	function fixPageEndHeight(){
		var requiredHeight = parseInt($('footer').css('height'));
		//Apply the height to the pageEnd element 
		$('#pageEnd').css('height', requiredHeight);
	}



	//////////////////////////////////
	//Smooth Scroll solution sourced from: https://css-tricks.com/snippets/jquery/smooth-scrolling/

	// Select all links with hashes
	$('.smoothScrollLink').click(function(event) {
	    // On-page links
	    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
	    	&& 
	    	location.hostname == this.hostname
	    	){
				// Figure out element to scroll to
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
				// Does a scroll target exist?
				if (target.length) {
    			// Only prevent default if animation is actually gonna happen
    			event.preventDefault();
    			$('html, body').animate({
    				scrollTop: (target.offset().top - 50)
    			}, 1000, function() {
          			// Callback after animation
          			// Must change focus!
          			var $target = $(target);
          			$target.focus();
          			if ($target.is(":focus")) { // Checking if the target was focused
          				return false;
          			} else {
          				return true;
          			};
          		});
    		}
    	}
    });

		/////////////////////////////// End Smooth Scroll Solution

	//?
	document.cookie = "EssentialTimes=Tuesdays and Thursdays, 6.30 - 8.30. 1st session is Free";


}); 



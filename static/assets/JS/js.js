		
		//Hide header content to prevent jump when positioned correctly
		//This is execute before the page is ready
		document.getElementById("contentWrapper").style.display = "none";
		// $('#contentWrapper').css('display','none');

		$(document).ready(function(){ 



			//Enable footer address map tool tip
			$('a[rel="mapTip"]').tooltip();

			$('#astonmb').removeClass('animated');


			reCalcHeaderButtonPosition()


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


			/**
				Parrallx like effect on the mainbuilding as the viewport is scrolled
				*/
				$(window).scroll(function() {


					var scroll = $(window).scrollTop();

					var vTransformpx = ( scroll * -0.25)

				//Ensure that the building will not be left floating
				if( parseInt($('#astonmb').css('bottom')) < vTransformpx ){
					$("#astonmb").css("transform","translate( 0px , "  + vTransformpx + "px)");
				}


				//Recalculate the header buttons visibility
				reCalcHeaderButtonsState(scroll);

				//Handle the navigation menu bar
				handleMenuBar();

			});


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


			/**
				Calculates and applies the position of the header buttons
				*/
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

					var headerWidth = parseInt( $("#pageHeader").css('width'));
					var headerHeight = parseInt( $("#pageHeader").css('height'));
					var mBImageHeight = parseInt( $("#astonmb").css('height'));

					if(headerWidth > 2000){
						var mBOffSet = -((headerHeight * 0.05)  + (mBImageHeight * 0.3));

					}else if(headerWidth > 1500){
						var mBOffSet = -((headerHeight * 0.025)  + (mBImageHeight * 0.3));

					}else{
						var mBOffSet = -(mBImageHeight * 0.3);
						
					}


					$('#astonmb').css('bottom', mBOffSet);

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



		}); 





		
		$(document).ready(function(){ 

			//Enable footer address map tool tip
			$('a[rel="mapTip"]').tooltip();


			var onePercentHeadScrolled = parseInt( $("#astonTriangle").css('top') , 10) / 100;
			var startLeft = parseInt( $("#astonTriangle").css('left') , 10);
			var beenScrolled = false;

			$(window).scroll(function() {


				var scroll = $(window).scrollTop();


				var percentScrolled = scroll / onePercentHeadScrolled;

				var newLeftPosPercent = ( percentScrolled / 100 ) * startLeft 

				$("#astonTriangle").css("transform","translate(" + -newLeftPosPercent +  "px , "  + ( scroll * -0.7)  + "px)");



				if(percentScrolled < 1 && beenScrolled){

							//Remove the login form
							$('#astonTriangle').removeClass('animated');
							$('#astonTriangle').removeClass('pulse');
							$('#astonTriangle').addClass('animated');
							$('#astonTriangle').addClass('pulse');

							beenScrolled = false;

						} else if(percentScrolled > 150){
							
							beenScrolled = true;

						}


					});


			//?
			document.cookie = "EssentialTimes=Tuesdays and Thursdays, 6.30 - 8.30. 1st session is Free";



		}); 
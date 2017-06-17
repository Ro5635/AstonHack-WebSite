/*
*	JS Script from: https://gist.github.com/scottmagdalein/259d878ad46ed6f2cdce
*	By: scottmagdalein
*/

// <script type="text/javascript" src="//s3.amazonaws.com/downloads.mailchimp.com/js/signup-forms/popup/embed.js" data-dojo-config="usePlainJson: true, isDebug: false"></script>

$(document).ready(function(){
//Converted to JQuery for handaling of legacy browsers with the class select
	function showMailingPopUp() {
		require(["mojo/signup-forms/Loader"], function(L) { L.start({"baseUrl":"mc.us16.list-manage.com","uuid":"18b58febfa384b200eac98c58","lid":"6967a3252d"}) })
		document.cookie = "MCEvilPopupClosed=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	};

	$(".open-MCpopup").click(function(){
		showMailingPopUp()
		
	});

//End OnReaddy
});


//Origional from mailchimp generator:
// <script type="text/javascript" src="//s3.amazonaws.com/downloads.mailchimp.com/js/signup-forms/popup/embed.js" data-dojo-config="usePlainJson: true, isDebug: false"></script>
// <script type="text/javascript">require(["mojo/signup-forms/Loader"], function(L) { L.start({"baseUrl":"mc.us16.list-manage.com","uuid":"18b58febfa384b200eac98c58","lid":"6967a3252d"}) })</script>
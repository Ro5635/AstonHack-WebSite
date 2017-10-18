// This is a tmp test


var callbackURL = 'https://astonhack.co.uk/ticketing/';//'http://astonhack.co.uk/test.html';
var apiURL= 'https://ticketing.astonhack.co.uk';//'https://ah.ro5635.co.uk';
var url_string = window.location.href;



var url = new URL(url_string);



var inAssignTicketStage = true;
var inProvisionTicketMode = false;




var queryParams = {};

queryParams.token_type = gup('token_type', url_string);
queryParams.access_token = gup('access_token', url_string);
queryParams.ticketID = url.searchParams.get("ticketID");

// Test to see that all required parameters are present
for(var param in queryParams){
	if(queryParams[param] === undefined || queryParams[param] === null){
		inAssignTicketStage = false;


	}

}



if(inAssignTicketStage){
	callBackendAssign(queryParams.access_token, queryParams.ticketID);
}else{
	// test to see if there are tickets, if so show the form else show msg
	displayTicketRequester();


}


function recaptchaCallback() {
	$('#requestTicketButt').removeClass('disabled');
};

$('#requestTicketButt').click(function() {

	var gToken = $("#g-recaptcha-response").val();

	provisionATicket(gToken);


});

function displayTicketRequester(){

	// Depending on if there are tickets avalible
	// show the ticket request, if there are not tickets avalible then
	// the request for ticket will fail anyway...

	getRemainingTickets(function(ticketsRemaining){

		if(ticketsRemaining > 0){
			// There are tickets, show the ticket request form
			$('#googleAntiRobot').slideDown('slow');

		}else{
			// There are no tickets avalible
			displayError('Ticket Wave Sold Out! We will be releasing more soon. Hang tight. ');

		}

	});

}

function getRemainingTickets(callback){

		$.ajax({
		url:  apiURL + '/tickets/ticketsavailable',
		type: "GET",
		cache: false,
		success: function(result){

			callback(result.availableTickets);

		}
	});



}

function provisionATicket(googleToken){

	$.ajax({
		url:  apiURL + '/tickets/provision',
		type: "POST",
		data:  {googleToken : googleToken},
		cache: false,
		success: function(result){

			var encodedCallbackURL = encodeURIComponent(callbackURL + '?ticketID=' + result.ticket.id);
			var authURL = 'https://my.mlh.io/oauth/authorize?client_id=791ddd35fc96cb579b5fd8ee9262960943299cbf3fd20da02d40afa7a4f51ba7&response_type=token';
			authURL = authURL + '&redirect_uri=' + encodedCallbackURL;

			// Remove the google recapacha from the page
			$('#googleAntiRobot').slideUp();


			addAuthWithMyMLHButt(authURL);



		}
	});


}

function addAuthWithMyMLHButt(authURL){
	// Add the registration button to the DOM
	$('#authMYMLHButton').html('<div id="registrationButton" class="text-cen1ter"><a href="' + authURL + '"><button type="button" class="btn btn-secondary btn-lg">Register With MYMLH</button></a></div>');
	$('#authMYMLHButton').slideDown('slow');

}


function callBackendAssign(mlh_access_token, ticketID){
	//Send the params over to the backend

	var dataToTransmit = 'mlh_access_token=' + mlh_access_token + '&ticketID=' + ticketID;

	$.ajax({
		url: apiURL + '/tickets/assign',
		type: "POST",
		data: dataToTransmit,
		cache: false,
		success: function(jsonResponse){


			//Display Ticket details 
			displayTicketDetails(jsonResponse.name, jsonResponse.email, jsonResponse.ticketID);

		},
		error: function(jsonResponse){
			// Is there an error message
			console.log(jsonResponse);
			if(jsonResponse.responseJSON.error.msg){
				//Display the error message
				displayError(jsonResponse.responseJSON.error.msg);

			}
		}
	});


}

function displayError(message){
	$('#errorMessageText').html(message);
	$('#errorMessage').slideDown('slow');


}

function displayTicketDetails(name, email, ticketID){

	$('#ticketName').text(name);
	$('#ticketEmail').text(email);
	$('#ticketID').text(ticketID);

	$('#ticket').slideDown('slow');

}


function gup( name, url ) {
	// Sourced from: https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
	if (!url) url = location.href;
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\#&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( url );
	return results == null ? null : results[1];
}



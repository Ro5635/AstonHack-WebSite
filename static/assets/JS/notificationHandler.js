if (!("Notification" in window)) {
	// This browser does not support desktop notifications

} else if (Notification.permission === "granted") {
	// Notifications are enabled


}
// if the user has not specificaly denied request. 
else if (Notification.permission !== "denied") {

	// Request permission to send notification
	Notification.requestPermission(function (permission) {

	if (permission === "granted") {


	}

});
}



// Handle the notification websocket

var socket = io('http://127.0.0.1:8085');

var userNotification = new userNotification();

/**
* Handle WebSocket
*
* On recipet of a notification display it to the user
*/
socket.on('notification', function(data){
	userNotification.spawnNotification(data['body'], data['icon'], data['title'], data['weblink']);

});


/**
*	Functionality that allows the display of a notification to the user
* either in the browser or as a desktop notification.
*
*/
function userNotification(){

	this.spawnNotification = function(theBody,theIcon,theTitle, weblink) {

		if(Notification.permission === "granted"){
			// Display notiication using the desktop notification API
			this.spawnDesktopNotification(theBody,theIcon,theTitle, weblink);

		}else{
			// Display the notification in browser
			this.spawnBrowserNotification(theBody,theIcon,theTitle, weblink);
		}




	}

	this.spawnDesktopNotification = function(theBody,theIcon,theTitle, weblink){
		var options = {
			body: theBody,
			icon: theIcon
		}

		// Create new desktop notification
		var newNotification = new Notification(theTitle, options);

		newNotification.onclick = function () {
			window.open(weblink);
			newNotification.close();
		};

	}

	this.spawnBrowserNotification = function(theBody,theIcon,theTitle, weblink){
		// Displays a notification equivilent to a desktop notification however it is
		// a browser based notification in the DOM.

		// Using from the base.js
		configureGeneralModel(theBody,theIcon,theTitle, weblink);
	}


}


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
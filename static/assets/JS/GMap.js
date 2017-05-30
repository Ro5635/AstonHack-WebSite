//
//  Google Maps JS API
//  
//  Puts a map onto the page without using iframes with the astonhack logo as the flag just outside the uni.
//  Code adapted from the Maps API Docs 
//
// 



// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.
var flagPoints = [
['Aston Hack, Aston University', 52.486588, -1.889655]
];

function initMap() {
  
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: {lat:  52.486481, lng:  -1.889487}
  });

  setMarkers(map);
}



function setMarkers(map) {
        // Adds markers to the map.

        // Marker sizes are expressed as a Size of X,Y where the origin of the image
        // (0,0) is located in the top left of the image.

        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        var image = {
          url: '/assets/media/astonhack-logo-gmaps2.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(100, 75),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };
        for (var i = 0; i < flagPoints.length; i++) {
          var flagPoint = flagPoints[i];
          var marker = new google.maps.Marker({
            position: {lat: flagPoint[1], lng: flagPoint[2]},
            map: map,
            icon: image,
            shape: shape,
            title: flagPoint[0],
            zIndex: flagPoint[3]
          });
        }
      }
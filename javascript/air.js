var app;
function init(){
	var map1 = createMap('map1', 51.505, -0.9);
	var map2 = createMap('map2', 44.954, -93.091);

	var latLong = map1.getCenter();
	var curLat = latLong.lat
	console.log(curLat);
	new Vue({
	  el: '#app',
	  data: { 
	  		latitude: "",
	  		longitude: ""
	   },
	  methods: { /* Any app-specific functions go here */ },
	});
}

function createMap(mapID, lat, long) {
	var mymap = L.map(mapID).setView([lat, long], 13);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.light'
	}).addTo(mymap);

	return mymap
}


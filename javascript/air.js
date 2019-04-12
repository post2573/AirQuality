var app;
var map1;
var map2;
function init(){
	app = new Vue({
	  el: '#app',
	  data: { 
	  		map1: {
	  			latitude: 51.505,
	  			longitude: -0.9
	   		},
	   		map2: {
	  			latitude: 44.954,
	  			longitude: -93.091
	   		}
	   },
	  methods: { /* Any app-specific functions go here */ },
	});
	map1 = createMap('map1', app.map1.latitude, app.map1.longitude);
	map2 = createMap('map2', app.map2.latitude, app.map2.longitude);

	//add event listener
	map1.on('moveend', onMap1Pan);
	map2.on('moveend', onMap2Pan);
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

function onMap1Pan(e){
	var center = map1.getCenter();
	rlat = Math.round(center.lat * 1000) / 1000;
	rlng = Math.round(center.lng * 1000) / 1000;
	app.map1.latitude = rlat;
	app.map1.longitude = rlng;
}

function onMap2Pan(e){
	var center = map2.getCenter();
	rlat = Math.round(center.lat * 1000) / 1000;
	rlng = Math.round(center.lng * 1000) / 1000;
	app.map2.latitude = rlat;
	app.map2.longitude = rlng;
}


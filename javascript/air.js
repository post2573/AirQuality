var app;
var map1;
var map2;
function init(){
	app = new Vue({
	  el: '#app',
	  data: { 
	  		map1: {
	  			latitude: 51.509865,
	  			longitude: -0.118092,
	  			city: "London"
	   		},
	   		map2: {
	  			latitude: 44.954,
	  			longitude: -93.091,
	  			city: "St. Paul"
	   		},
	   		airDataResults: [],
	   		particleType: "",
	   		particleTypeOptions: [
                { value: "pm25", text: "PM2.5" },
                { value: "pm10", text: "PM10" },
                { value: "so2", text: "SO₂" },
                { value: "no2", text: "NO₂" },
                { value: "o3", text: "O₃" },
                { value: "co", text: "CO" },
                { value: "bc", text: "BC" }
            ],
            particleValue: "",
            particleValueOptions: [
                { value: "=", text: "=" },
                { value: ">", text: ">" },
                { value: "<", text: "<" },
                { value: ">=", text: ">=" },
                { value: "<=", text: "<=" }
            ]
	   },
	  methods: { /* Any app-specific functions go here */ },
	});

	//create the maps
	map1 = createMap('map1', app.map1.latitude, app.map1.longitude);
	map2 = createMap('map2', app.map2.latitude, app.map2.longitude);
	//var airData = retrieveParticleData();
	//var airData2 = retrieveParticleData2();

	//add event listeners
	$("#map1B").click(updateLatLong($('#lat1')[0].value, $('#long1')[0].value));
	$("#map2B").click(updateLatLong2);
	$("#citySearch").click(cityLookUp);
	$("#map1Full").click(fullScreen);
	map1.on('moveend', onMap1Pan);
	map2.on('moveend', onMap2Pan);
}

function fullScreen(){
	console.log("requested");
	var map1 = document.getElementById("map1");
	if (map1.requestFullscreen) {
  		map1.requestFullscreen();
	}
	//map1.getreqfullscreen();
}

function createMap(mapID, lat, long) {
	var mymap = L.map(mapID).setView([lat, long], 13);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 16,
		minZoom: 9,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.light'
	}).addTo(mymap);

	return mymap
}

function cityLookUp(){
	//grab user input
	//look that city up in nominatim
	//grab the first entries lat and lon
	//setView of map to that lat lon
	var prevCity = app.map1.city;
	var city = $('#city1')[0].value;
	app.map1.city = city;
	console.log(city);
	
		var request = {
	        	type: "GET",
	            url: "https://nominatim.openstreetmap.org/search?q=" + city + "&format=json",
	            dataType: "json",
	            success: function(data){
	            	console.log(data);
	            	var lat = data[0].lat;
	            	var lon = data[0].lon;
	            	//$('#lat1')[0].value = lat;
	            	//$('#long1')[0].value = lon;
	            	updateLatLong(lat, lon);
	            }
	        };
	        $.ajax(request);
	
}

function onMap1Pan(e){
	var center = map1.getCenter();
	rlat = Math.round(center.lat * 1000) / 1000;
	rlng = Math.round(center.lng * 1000) / 1000;
	app.map1.latitude = rlat;
	app.map1.longitude = rlng;
	retrieveParticleData();
	updateCityOnPan(rlat,rlng);
}

function onMap2Pan(e){
	var center = map2.getCenter();
	rlat = Math.round(center.lat * 1000) / 1000;
	rlng = Math.round(center.lng * 1000) / 1000;
	app.map2.latitude = rlat;
	app.map2.longitude = rlng;
	retrieveParticleData2();
	updateCity2OnPan(rlat, rlng);
}

function updateCityOnPan(lat, lng){

	var request = {
        	type: "GET",
            url: "https://nominatim.openstreetmap.org/reverse?format=json" + "&lat=" + lat + "&lon=" + lng,
            dataType: "json",
            success: function(data){
            	if(data.address.city != undefined){
            		app.map1.city = data.address.city;
            	}
            	else{
            	
            		//console.log(data.address.county);
        			app.map1.city = data.address.county;
            	}
            	//console.log(app.map1.city);
            	console.log(data);
            }
        };
        $.ajax(request);
}

function updateCity2OnPan(lat, lng){

	var request = {
        	type: "GET",
            url: "https://nominatim.openstreetmap.org/reverse?format=json" + "&lat=" + lat + "&lon=" + lng,
            dataType: "json",
            success: function(data){
            	if(data.address.city != undefined){
            		app.map2.city = data.address.city;
            	}
            	else{
            	
            		//console.log(data.address.county);
        			app.map2.city = data.address.county;
            	}
            	//console.log(app.map1.city);
            	console.log(data);
            }
        };
        $.ajax(request);
}

function updateLatLong(lat, lng){
	//L.latLng($("#lat1").value, $("#long1").value)
	//console.log($("#lat1").target.value); 
	//lat = $('#lat1')[0].value;
	app.map1.latitude = lat;
	//lng = $('#long1')[0].value;
	app.map1.longitude = lng;
	//console.log(app.map1.latitude);
	map1.setView([lat, lng], 13);
	//console.log(app.map1.latitude);
	//app.map1.latitude = $("#lat1").value;
	retrieveParticleData();
}

function updateLatLong2(){
	//L.latLng($("#lat1").value, $("#long1").value)
	//console.log($("#lat1").target.value); 
	lat = $('#lat2')[0].value;
	app.map2.latitude = lat;
	lng = $('#long2')[0].value;
	app.map2.longitude = lng;
	//console.log(app.map1.latitude);
	map2.setView([lat, lng], 13);
	//console.log(app.map1.latitude);
	//app.map1.latitude = $("#lat1").value;
	retrieveParticleData2();
}

function retrieveParticleData(){
	console.log("Made it in Here!!!")
	var lat = app.map1.latitude;
	var lng = app.map1.longitude;

	var nwCorner = map1.getBounds().getNorthWest();
	var seCorner = map1.getBounds().getSouthEast();
	var rad = Math.round(CalculateDistance(nwCorner.lat,nwCorner.lng,seCorner.lat,seCorner.lng) / 2); 
	console.log(rad);
	if (app.map1.latitude !== "" && app.map1.longitude !== "")
    {
        var request = {
        	type: "GET",
            url: "https://api.openaq.org/v1/measurements?" + "coordinates=" + lat + "," + lng + "&radius="+ rad + "&date_from=2019-03-18&date_to=2019-04-17&limit=100",
            dataType: "json",
            success: function(data){
            	console.log(data);
	
				app.airDataResults = data;
				//console.log(data.coordinates);
				for (var m in data.results){
					var cur = data.results[m];
					var marker = L.marker([cur.coordinates.latitude, cur.coordinates.longitude]).addTo(map1);
	} 
            }
        };
        $.ajax(request);
    }
    else
    {
    	console.log("request failed");
        app.airDataResults = [];
    }
    
}

function retrieveParticleData2(){
	
	var lat = app.map2.latitude;
	var lng = app.map2.longitude;

	var nwCorner = map2.getBounds().getNorthWest();
	var seCorner = map2.getBounds().getSouthEast();
	var rad = Math.round(CalculateDistance(nwCorner.lat,nwCorner.lng,seCorner.lat,seCorner.lng) / 2); 
	console.log(rad);
	if (app.map2.latitude !== "" && app.map2.longitude !== "")
    {
        var request = {
        	type: "GET",
            url: "https://api.openaq.org/v1/measurements?" + "coordinates=" + lat + "," + lng + "&radius="+ rad + "&date_from=2019-03-20&date_to=2019-04-18&limit=100",
            dataType: "json",
            success: function(data){
            	console.log(data);
	
				app.airDataResults = data;
				//console.log(data.coordinates);
				for (var m in data.results){
					var cur = data.results[m];
					var marker = L.marker([cur.coordinates.latitude, cur.coordinates.longitude]).addTo(map2);
				}
            }
        };
        $.ajax(request);
    }
    else
    {
    	console.log("request failed");
        app.airDataResults = [];
    }
    
}

function CalculateDistance(lat1, lon1, lat2, lon2) {
    lat1 = lat1 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;

    var a = Math.pow(Math.sin((lat2 - lat1) / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon2 - lon1) / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var dist = 3959 * c;

    return dist*1000;
}

function addMarkersToMap(data){
	console.log(data.coordinates);
	for(m in data){
		console.log(m);
		var marker = L.marker([data.coordinates.latitude, data.coordinates.longitude]).addTo(map1);
	}
}

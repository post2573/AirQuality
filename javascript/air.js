var app;
var map1;
var map2;
function init(){
	app = new Vue({
	  el: '#app',
	  data: { 
	  		map1: {
	  			latitude: 51.509,
	  			longitude: -0.118,
	  			city: "London"
	   		},
	   		map2: {
	  			latitude: 44.954,
	  			longitude: -93.091,
	  			city: "St. Paul"
	   		},
	   		airDataResults: [],
	   		measurements: [],
	   		measurements2: [],
	   		locations1: [],
	   		locations2: [],
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
            ],
            goodClass: {
            	'background-color': 'rgb(0, 228, 0)'
            },
            moderateClass: {
            	'background-color': 'rgb(225,225,0)'
            },
            unhealthy1Class: {
            	'background-color': 'rgb(225,126,0)'
            },
            unhealthy2Class: {
            	'background-color': 'rgb(225,0,0)'
            },
            unhealthy3Class: {
            	'background-color': 'rgb(143,63,151)'
            },
            hazardousClass: {
            	'background-color': 'rgb(126,0,35)'
            }
	   }
	});

	//create the maps
	map1 = createMap('map1', app.map1.latitude, app.map1.longitude);
	map2 = createMap('map2', app.map2.latitude, app.map2.longitude);
	retrieveParticleData();
	retrieveParticleData2();

	//add event listeners
	$("#map1B").click(updateLatLong);
	$("#map2B").click(updateLatLong2);
	$("#citySearch").click(cityLookUp);
	$("#city2Search").click(cityLookUp2);
	$("#map1Full").click(fullScreen);
	$("#map2Full").click(fullScreen2);
	$("#map1Heat").click(getHeatOverlay);
	$("#map2Heat").click(getHeatOverlay2);
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

function fullScreen2(){
	console.log("requested");
	var map2 = document.getElementById("map2");
	if (map2.requestFullscreen) {
  		map2.requestFullscreen();
	}
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
	            	updateLatLongwPar(lat, lon);
	            }
	        };
	        $.ajax(request);
}

function updateLatLongwPar(lat, lng){
	app.map1.latitude = lat;

	app.map1.longitude = lng;
	//console.log(app.map1.latitude);
	map1.setView([lat, lng], 13);
	//console.log(app.map1.latitude);
	//app.map1.latitude = $("#lat1").value;
	retrieveParticleData();
}

function updateLatLong2wPar(lat, lng){
	app.map2.latitude = lat;

	app.map2.longitude = lng;
	//console.log(app.map1.latitude);
	map2.setView([lat, lng], 13);
	//console.log(app.map1.latitude);
	//app.map1.latitude = $("#lat1").value;
	retrieveParticleData();
}

function cityLookUp2(){
	//grab user input
	//look that city up in nominatim
	//grab the first entries lat and lon
	//setView of map to that lat lon
	var prevCity = app.map2.city;
	var city = $('#city2')[0].value;
	app.map2.city = city;
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
	            	updateLatLong2wPar(lat, lon);
	            }
	        };
	        $.ajax(request);
}

function onMap1Pan(e){
	setTimeout(function() {
		var center = map1.getCenter();
		rlat = Math.round(center.lat * 1000) / 1000;
		rlng = Math.round(center.lng * 1000) / 1000;
		app.map1.latitude = rlat;
		app.map1.longitude = rlng;
		retrieveParticleData();
		updateCityOnPan(rlat,rlng);

	}, 2000);
	
}

function onMap2Pan(e){
	setTimeout(function() {
		var center = map2.getCenter();
		rlat = Math.round(center.lat * 1000) / 1000;
		rlng = Math.round(center.lng * 1000) / 1000;
		app.map2.latitude = rlat;
		app.map2.longitude = rlng;
		retrieveParticleData2();
		updateCity2OnPan(rlat, rlng);
	}, 2000);
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

function updateLatLong(){
	//L.latLng($("#lat1").value, $("#long1").value)
	//console.log($("#lat1").target.value); 
	lat = $('#lat1')[0].value;
	app.map1.latitude = lat;
	lng = $('#long1')[0].value;
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
	//console.log(rad);
	if (app.map1.latitude !== "" && app.map1.longitude !== "")
    {
    	console.log(lat);
    	console.log(lng);
        var request = {
        	type: "GET",
            url: "https://api.openaq.org/v1/measurements?" + "coordinates=" + lat + "," + lng + "&radius="+ rad + "&date_from=2019-03-19&date_to=2019-04-19&limit=10000",
            dataType: "json",
            success: function(data){
            	app.measurements = [];
            	app.locations1 = [];
            	console.log(data.results);
				for(var i in data.results){
					var found = undefined;
					var foundLoc = undefined;
					var cur = data.results[i];
					var curLat = cur.coordinates.latitude;
					var curLon = cur.coordinates.longitude;
					var curDate = cur.date.utc;
					var curParticle = cur.parameter;
					var curValue = cur.value;
					//console.log(curValue);
					for(var m in app.measurements){
						var curMeas = app.measurements[m];
						if((curLat === curMeas.lat) && (curLon === curMeas.lon) && (curDate === curMeas.date)){
							found = m;
							break;
						}
					}

					for(var a in app.locations1){
						var curLoc = app.locations1[a];
						if((curLat === curLoc.lat) && (curLon === curLoc.lon)){
							foundLoc = a;
							break;
						}
					}
					if(found == undefined){
						var x = new PData(curLat, curLon, curDate);
						//console.log(x.particles[curParticle]);
						x.particles[curParticle] = curValue;
						app.measurements.push(x);
					}
					else{
						app.measurements[found].particles[curParticle] = curValue;
					}
					if(foundLoc == undefined){
						var y = new locationObj(curLat, curLon);
						app.locations1.push(y);
					}
				}
				console.log(app.measurements);
				console.log(app.locations1);
				findAverages();
				placeMarkers();
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
	console.log("Made it in Here!!!")
	var lat = app.map2.latitude;
	var lng = app.map2.longitude;

	var nwCorner = map2.getBounds().getNorthWest();
	var seCorner = map2.getBounds().getSouthEast();
	var rad = Math.round(CalculateDistance(nwCorner.lat,nwCorner.lng,seCorner.lat,seCorner.lng) / 2); 
	//console.log(rad);
	if (app.map2.latitude !== "" && app.map2.longitude !== "")
    {
    	console.log(lat);
    	console.log(lng);
        var request = {
        	type: "GET",
            url: "https://api.openaq.org/v1/measurements?" + "coordinates=" + lat + "," + lng + "&radius="+ rad + "&date_from=2019-03-19&date_to=2019-04-19&limit=10000",
            dataType: "json",
            success: function(data){
            	app.measurements2 = [];
            	app.locations2 = [];
            	console.log(data.results);
				for(var i in data.results){
					var found = undefined;
					var foundLoc = undefined;
					var cur = data.results[i];
					var curLat = cur.coordinates.latitude;
					var curLon = cur.coordinates.longitude;
					var curDate = cur.date.utc;
					var curParticle = cur.parameter;
					var curValue = cur.value;
					//console.log(curValue);
					for(var m in app.measurements2){
						var curMeas = app.measurements2[m];
						if((curLat === curMeas.lat) && (curLon === curMeas.lon) && (curDate === curMeas.date)){
							found = m;
							break;
						}
					}
					for(var a in app.locations2){
						var curLoc = app.locations2[a];
						if((curLat === curLoc.lat) && (curLon === curLoc.lon)){
							foundLoc = a;
							break;
						}
					}
					if(found == undefined){
						var x = new PData(curLat, curLon, curDate);
						//console.log(x.particles[curParticle]);
						x.particles[curParticle] = curValue;
						app.measurements2.push(x);
					}
					else{
						app.measurements2[found].particles[curParticle] = curValue;
					}
					if(foundLoc == undefined){
						var y = new locationObj(curLat, curLon);
						app.locations2.push(y);
					}
				}
				console.log(app.measurements2);
				findAverages2();
				placeMarkers2();	
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


function placeMarkers(){
	for(var a in app.locations1){
		var marker = L.marker([app.locations1[a].lat, app.locations1[a].lon]).addTo(map1);
		var averages = app.locations1[a].averages;
		var content = "<b>Lat: </b>" + app.locations1[a].lat + "<b> Lon: </b>" + app.locations1[a].lon + "</br>";
		for(var b in averages){
			if(averages[b] !== undefined){
				content = content + b + ": " + averages[b] + "</br>";
			}
		}
		marker.bindPopup(content);
	}
}

function placeMarkers2(){
	for(var a in app.locations2){
		var marker = L.marker([app.locations2[a].lat, app.locations2[a].lon]).addTo(map2);
		var averages = app.locations2[a].averages;
		var content = "<b>Lat: </b>" + app.locations2[a].lat + "<b> Lon: </b>" + app.locations2[a].lon + "</br>";
		for(var b in averages){
			if(averages[b] !== undefined){
				content = content + b + ": " + averages[b] + "</br>";
			}
		}
		marker.bindPopup(content);
	}
}

function findAverages(){
	//console.log("AVERAGES FOR MAP1")
	for (var b in app.locations1){
		var curLat = app.locations1[b].lat;
		var curLon = app.locations1[b].lon;
		var curMeas = app.locations1[b].measurements;
		for (var c in app.measurements){
			var curLat2 = app.measurements[c].lat;
			var curLon2 = app.measurements[c].lon;
			var curParticles = app.measurements[c].particles;
			if ((curLat === curLat2) && (curLon === curLon2)){
				for (var d in curMeas){
					if (curParticles[d] != undefined){
						var curValue = curParticles[d];
						curMeas[d].push(curValue);
					}
				}
			}
		}
	}
	for (var b in app.locations1){
		var curLat = app.locations1[b].lat;
		var curLon = app.locations1[b].lon;
		var curMeas = app.locations1[b].measurements;
		var curAve = app.locations1[b].averages;
		for(var c in curAve){
			var curPart = curMeas[c];
			if(curPart.length != 0){
				var ave = 0;
				for (var d in curPart){
					var curVal = curPart[d];
					ave = ave + curVal;
				}
				curAve[c] = ave/curPart.length;
				curAve[c] = Math.round(curAve[c] * 1000) / 1000;
			}
		}
	}
	console.log(app.locations1);
}

function findAverages2(){
	for (var b in app.locations2){
		var curLat = app.locations2[b].lat;
		var curLon = app.locations2[b].lon;
		var curMeas = app.locations2[b].measurements;
		for (var c in app.measurements2){
			var curLat2 = app.measurements2[c].lat;
			var curLon2 = app.measurements2[c].lon;
			var curParticles = app.measurements2[c].particles;
			if ((curLat === curLat2) && (curLon === curLon2)){
				for (var d in curMeas){
					if (curParticles[d] != undefined){
						var curValue = curParticles[d];
						curMeas[d].push(curValue);
					}
				}
			}
		}
	}
	for (var b in app.locations2){
		var curLat = app.locations2[b].lat;
		var curLon = app.locations2[b].lon;
		var curMeas = app.locations2[b].measurements;
		var curAve = app.locations2[b].averages;
		for(var c in curAve){
			var curPart = curMeas[c];
			if(curPart.length != 0){
				var ave = 0;
				for (var d in curPart){
					var curVal = curPart[d];
					ave = ave + curVal;
				}
				curAve[c] = ave/curPart.length;
				curAve[c] = Math.round(curAve[c] * 1000) / 1000;
			}
		}
	}
	console.log(app.locations2);

}

function getHeatOverlay(){
	var part = $('#hType')[0].value;
	console.log(part);
	if (part != ''){
		//var heat = L.redraw();
		for(var a in app.locations1){
			var curLoc = app.locations1[a];
			if(curLoc.averages[part] != undefined){
				var curpart = (curLoc.averages[part])/10;
				console.log(curpart);
				var heat = L.heatLayer([
				[curLoc.lat, curLoc.lon, (curpart)], // lat, lng, intensity
				], {radius: 30}).addTo(map1);
			}
		}
	}
}

function getHeatOverlay2(){
	var part = $('#hType2')[0].value;
	console.log(part);
	if (part != ''){
		//var heat = L.redraw();
		for(var a in app.locations2){
			var curLoc = app.locations2[a];
			if(curLoc.averages[part] != undefined){
				var curpart = (curLoc.averages[part])/10;
				console.log(curpart);
				var heat = L.heatLayer([
				[curLoc.lat, curLoc.lon, curpart], // lat, lng, intensity
				], {radius: 30}).addTo(map2);
			}
		}
	}
}

function PData(lat, lon, date){
	this.lat = lat;
	this.lon = lon;
	this.date = date;
	this.particles = {
		"pm25" : undefined,
    	"pm10" : undefined,
    	"so2" : undefined,
    	"no2" : undefined,
    	"o3" : undefined,
    	"co" : undefined,
    	"bc" : undefined
	}
}

function locationObj(lat, lon){
	this.lat = lat;
	this.lon = lon;
	this.measurements = {
		"pm25" : [],
    	"pm10" : [],
    	"so2" : [],
    	"no2" : [],
    	"o3" : [],
    	"co" : [],
    	"bc" : []
	}
	this.averages = {
		"pm25" : undefined,
    	"pm10" : undefined,
    	"so2" : undefined,
    	"no2" : undefined,
    	"o3" : undefined,
    	"co" : undefined,
    	"bc" : undefined
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


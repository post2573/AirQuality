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
            url: "https://api.openaq.org/v1/measurements?" + "coordinates=" + lat + "," + lng + "&radius="+ rad + "&date_from=2019-03-19&date_to=2019-04-19&limit=100",
            dataType: "json",
            success: function(data){
            	console.log(data.results);
				for(var i in data.results){
					var found = undefined;
					var cur = data.results[i];
					var curLat = cur.coordinates.latitude;
					var curLon = cur.coordinates.longitude;
					var curDate = cur.date.utc;
					var curParticle = cur.parameter;
					var curValue = cur.value;
					console.log(curValue);
					for(var m in app.measurements){
						var curMeas = app.measurements[m];
						if((curLat === curMeas.lat) && (curLon === curMeas.lon) && (curDate === curMeas.date)){
							found = m;
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
				}
				console.log(app.measurements);
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
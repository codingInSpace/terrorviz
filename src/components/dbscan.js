
const dbScan = data => {
    console.log(data.length);

    // todo! 23.6 med chrome
    // todo! 26 med safari


    // full_data
    // 3.36 utan if eps=2 minPts=500
    // 2.63 med if

    // 4.46 utan if eps=4 minPts=1000
    // 4.12 med if


    // 14.06 med full_full_data med if sats!!!!
    // 2min och 30.13 utan if

    var minPts = 10; //50 //1000
    var epsilon = 1; //2 //4

    var clusterIndex = 0;
    var inData = data;

    var indexArray = [], isVisitedArray = [], isNoiseArray = [], neighborPointIndices = [];

    //**** geoAreaIndices[] *****
    // index = 1, North + Central + South America
    // index = 2, Europe and North Africa
    // index = 3, Central and South Africa
    // index = 4, India and Oceania
    var geoAreaIndices = [];

    // Divide world into 4 areas, give items correct index
    for(var i = 0; i < inData.length; i++){

        var tempDataItem = inData[i];

        //console.log(typeof tempDataItem.latitude);

        if(+tempDataItem.longitude < -30 && +tempDataItem.longitude > -170 && +tempDataItem.latitude < 75 && +tempDataItem.latitude > -55){

            geoAreaIndices.push(1);
        }

        if(+tempDataItem.longitude < 58 && +tempDataItem.longitude > -20 && +tempDataItem.latitude < 72 && +tempDataItem.latitude > 18){

            geoAreaIndices.push(2);
        }

        if(+tempDataItem.longitude < 55 && +tempDataItem.longitude > -20 && +tempDataItem.latitude <= 18 && +tempDataItem.latitude > -35){

            geoAreaIndices.push(3);
        }

        if(+tempDataItem.longitude < 175 && +tempDataItem.longitude > 55 && +tempDataItem.latitude < 80 && +tempDataItem.latitude > -50){

            geoAreaIndices.push(4);
        }
    }

    // Initialize arrays
    for(var i = 0; i < inData.length; i++){

        indexArray.push(-1);
        isVisitedArray.push(false);
        isNoiseArray.push(false);
    }

    // main loop
    for(var j = 0; j < inData.length; j++){

        if(isVisitedArray[j] == false) {

            isVisitedArray[j] = true;

            neighborPointIndices = regionQuery(j);

            if (neighborPointIndices.length < minPts) {

                isNoiseArray[j] = true;
            }
            else {

                clusterIndex = clusterIndex + 1;
                expandCluster(j, neighborPointIndices, clusterIndex);
            }
        }
    }

    function expandCluster(indexOfCurrent, neighborIndices, clusterIdx){

        indexArray[indexOfCurrent] = clusterIdx;

        var newNeighborPointIndices = [];
        var k_value = 0;

        while(true){

            var l = neighborIndices[k_value];

            if(isVisitedArray[l] == false)
            {
                isVisitedArray[l] = true;

                newNeighborPointIndices = regionQuery(l);

                if(newNeighborPointIndices.length >= minPts){

                    neighborIndices = neighborIndices.concat(newNeighborPointIndices);
                }
            }

            if(indexArray[l] == -1){

                indexArray[l] = clusterIdx;
            }

            k_value = k_value + 1;

            if(k_value > neighborIndices.length){ break; }
        }
    }

    // Find points in neighborhood within epsilon distance of currentPoint
    function regionQuery(indexOfCurrentPoint){

        var neighborPoints = [];
        var currentLon = inData[indexOfCurrentPoint].longitude;
        var currentLat = inData[indexOfCurrentPoint].latitude;
        var currentGeoIndex = geoAreaIndices[indexOfCurrentPoint];
        var tempLon = 0, tempLat = 0, euclidDist = 0;

        for(var m = 0; m < inData.length; m++) { // indexOfCurrent + 1

            tempLon = +inData[m].longitude;
            tempLat = +inData[m].latitude;

            /////// SAVE THIS!!!!!!!!!!!!!!!!!!!
           ////// if( (((tempLon - currentLon) < 0 ? -(tempLon - currentLon) : (tempLon - currentLon)) < epsilon/2 ) &&
           /////      (((tempLat - currentLat) < 0 ? -(tempLat - currentLat) : (tempLat - currentLat)) < epsilon/2) ){

            if(geoAreaIndices[m] == currentGeoIndex){

                euclidDist = Math.sqrt(Math.pow((tempLon - currentLon), 2) + Math.pow((tempLat - currentLat), 2));

                //console.log("euclidD = " + euclidDist);
                if (euclidDist < epsilon) {

                    neighborPoints.push(m);
                }
            }
        }

        return neighborPoints;
    }

    return indexArray;
};

export default dbScan



/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function calculate_mileage(lat1, lat2, lon1, lon2){
    var lat1, lon1, lat2, lon2, delta_lat, delta_lon, temp, distance;
 
      // used internally, this function actually performs that calculation to
      // determine the mileage between 2 points defined by lattitude and
      // longitude coordinates.  This calculation is based on the code found
      // at http://www.cryptnet.net/fsp/zipdy/
       
      // Convert lattitude/longitude (degrees) to radians for calculations
      lat1 = deg2rad(lat1);
      lon1 = deg2rad(lon1);
      lat2 = deg2rad(lat2);
      lon2 = deg2rad(lon2);
      
      // Find the deltas
      delta_lat = lat2 - lat1;
      delta_lon = lon2 - lon1;
	
      // Find the Great Circle distance 
      temp = pow(sin(delta_lat/2.0),2) + cos(lat1) * cos(lat2) * pow(sin(delta_lon/2.0),2);
      distance = 3956 * 2 * atan2(sqrt(temp),sqrt(1-temp));

      return distance;
   };
   



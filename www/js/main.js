/*******************************************************************/
// main.js - logic and handlers - Holy Cross Urgentcare App
// Gary Peach at BPD Advertising
// http://www.bpdadvertising.com
// built with nb 7.4 dev build
// built with cordova 2.9
// built for android 4 and ios <=6
/*******************************************************************/

// declare vars 
var device, lat, lon, networkstate, feedData, fullData, locationId = 0;
var debug = 1, activated = 0, onlineState = null, message = null;

/**
 * hospital location feed data storage
 * @type {object|feed}
 */
var hospitals = {};
var geodata = {};
var listPageHTML = '';
var listLoop = null;
var googleLoop = null;

var imageWebsiteUrl = 'http://www.holycrosserapp.com/images/';
// google maps global vars 
var google;
var map;
var destination;

// call directions service constructor
/*******************************************************************/

/**
 * function onDeviceReady()
 * on document load, set event listener for deviceready
 * Cordova is loaded and it is now safe to make calls Cordova methods
 */
function onDeviceReady() {
    qM('onDeviceReady()');
    qM('uuid ' + device.uuid);
    setEventHandlers();
    googleAnalytics();
    fetchFeedAndPosition();
}//end onDeviceReady

function one(myArg){
     return myArg;
}

/**
 * function onload()
 * on document load, set event listener for deviceready event 
 * (means cordova is done initializing) and call onDeviceReady()
 */
function onLoad() {
    qM('onload()');
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        qM('Device provides ready');
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        qM('Sim provides ready');
        onDeviceReady();
    }
}//end onLoad()

/**
 * function setEventHandlers()
 * sets up event and click handlers
 */
function setEventHandlers() {
    qM('setEventHandlers()');

    ///////////////////////////////////////////////////////////////
    /////////////// Pageshow Handlers ////////////////////////
    ///////////////////////////////////////////////////////////////

    // pageshow handler
    $(document).on("pageshow", '[data-role=page]', function(event, data) {
        qM("locationId = " + locationId);
    });

    // home page pageshow handler
    $(document).on("pageshow", '[data-role=page]#home', function(event, data) {
        fetchFeedAndPosition();
    });

    // locations page pagebeforeshow handler
    $(document).on("pagebeforeshow", '[data-role=page]#locations-list', function(event, data) {
        //populate list page
        qM(listPageHTML);
        qM('before: ' + $('div.hch-location-list').html);
        $('div.hch-location-list').html(listPageHTML).trigger('create');
        qM('after: ' + $('div.hch-location-list').html);
    });

    // when page pagebeforeshow handler
    $(document).on("pagebeforeshow", '[data-role=page]#when', function(event, data) {
        //$('[data-role=page]#when div.content').css('visibility', 'hidden;');
        //$('#when').trigger('pagecreate');
        // $.mobile.fixedToolbars.show(true);
    });

    // detail page pagebeforeshow handler
    $(document).on("pagebeforeshow", '[data-role=page]#detail', function(event, data) {
        //populate detail page
        qM('populate detail photo selected: ' + locationId);
        if ($.isNumeric(locationId)) {
            qM('numeric');
        }
        if ($.isNumeric(locationId)) {
            $("[data-role=page]#detail div.detail-location-text > h1.name").html(hospitals.locations[locationId].name);
            $("[data-role=page]#detail div.display-operating-hours div.hours").html(hospitals.locations[locationId].openText);
            $("[data-role=page]#detail div.display-address span.address-1").html(hospitals.locations[locationId].address1);
            $("[data-role=page]#detail div.display-address span.address-2").html(hospitals.locations[locationId].address2);
            $("[data-role=page]#detail div.display-address span.city").html(hospitals.locations[locationId].city + ', ');
            $("[data-role=page]#detail div.display-address span.state").html(hospitals.locations[locationId].state);
            $("[data-role=page]#detail div.display-address span.zipcode").html(hospitals.locations[locationId].zipcode);
            $("[data-role=page]#detail div.display-phone span.phone").html(hospitals.locations[locationId].phone);
            $("[data-role=page]#detail div.display-phone span.phone").html(hospitals.locations[locationId].phone);
            $.ajax({
                url: 'images/' + locationId + '.png',
                type: 'HEAD',
                error:
                        function() {
                            //do something depressing
                        },
                success:
                        function() {
                            $('[data-role=page]#detail .photo img').attr("src", 'images/' + locationId + '-wide.png');
                            qM('images/' + locationId + '.png');
                        }
            });

        }
    });

    // pageshow handler for google analytics
    $(document).on('pageshow', '[data-role=page]', function() {
        hash = location.hash;
        if (hash) {
            ga('send', 'pageview', {'page': hash.substr(1)});
            qM("Google Analytics pageview triggered " + location.hash);
        } else {
            ga('send', 'pageview', {'page': 'index.html'});
            qM("Google Analytics pageview triggered " + 'index.html');
        }
    });

    ///////////////////////////////////////////////////////////////
    //////////////////////// Click Handlers /////////////////////
    ///////////////////////////////////////////////////////////////



    // click handler
    $('[data-role="page"]#home .detail-button a').on('click', function() {
        $.mobile.changePage('#detail', {
            changeHash: true,
            dataUrl: "detail", //the url fragment that will be displayed for the destination page
            transition: "fade"  //if not specified, uses the default one or the one defined in the default settings
        });//end mobile.changepage
        qM('[data-role="page"]#home .detail-button a');
        return false;
    });//end link handler
    //
    // holy cross website link handler
    $('.hchLink').on('click', function() {
        ga('send', 'event', 'button', 'click', 'website');
        var ref = window.open('http://m.holy-cross.com', '_blank', 'location=yes');
        qM('.hchlink clicked');
    });	//end link handler
    
        // location info refresh
    $('.photo img').on('click', function() {
        fetchFeedAndPosition();
        //ga('send', 'event', 'button', 'click', 'website');
        //var ref = window.open('http://m.holy-cross.com', '_blank', 'location=yes');
        qM('location ifo refresh');
       });	//end location info refresh

    // holy cross tel link handler 
    $('.tel.holycross').on('click', function() {
        ga('send', 'event', 'link', 'click', 'holycrosstel');
        qM('holy cross tel clicked');
    });	//end tel click link handler

    // urgentcare tel link handler 
    $('.tel.urgentcare').on('click', function() {
        ga('send', 'event', 'link', 'click', 'urgentcaretel');
        qM('urgentcare tel clicked');
    });	//end urgentcare tel click link handler

    // set google directions click handler
    $('.googleDir').on('click', function() {
        qM('.googleDir clicked' + hospitals.locations[locationId].google);
        var ref = window.open(hospitals.locations[locationId].google, '_blank', 'location=yes');
        return false;
    });//end google directions click handler
}
;//end setEventHandlers()

// promise objects info came from the url below
// http://odetocode.com/blogs/scott/archive/2012/06/18/geolocation-geocoding-and-jquery-promises.aspx

/**
 * function getFeed()
 * get feed form internet
 * @param {string} feedURL location of data feed
 * @return {object} deferred - feed object
 */
var getFeed = function(feedURL) {
    qM('getFeed Promise');
    var deferred = jQuery.Deferred();
    $.getJSON(feedURL).done(function(feed) {
        qM('feed resolved');
        deferred.resolve(feed);
    });
    setTimeout(function() {
        deferred.resolve(-1);
    }, 5000);
    return deferred.promise();
}
;//end getFeed()

/**
 * function getPosition()
 * get position from phone
 * {object} deferred - position object
 */
var getPosition = function(options) {
    qM('getPosition Promise');
    var deferred = jQuery.Deferred();
    navigator.geolocation.getCurrentPosition(function(position) {
        qM('position resolved');
        deferred.resolve(position);
    }, deferred.reject, options);
    setTimeout(function() {
        deferred.resolve(-1);
    }, 5000);
    return deferred.promise();
};//end getPosition()

/**
 * function fetchFeedAndPosition()
 * 
 * gets feed from holycrosserapp.com and position from phone
 * @returns {void}
 */
function fetchFeedAndPosition() {
    qM('fetchFeedAndPosition()');
    
    if(navigator.connection.type == Connection.NONE){
        navigator.notification.alert('This app requires network connectivity, please try later.', fetchFeedAndPosition, 'Network Required', 'OK');
    }
    
    //navigator.notification.alert(navigator.connection.type, fetchFeedAndPosition, 'Alert', 'oK');
    $.mobile.loading('show');
    
    $.when(getPosition(), getFeed('http://holycrosserapp.com/datafeed.php?action=wait_time'))
            .then(function(position, feed) {
                qM(position);
                $.mobile.loading('hide');
                calculateAndDisplay(position, feed);
            });
}//end fetchFeedAndPosition()

/**
 * calculateAndDisplay(position, feed)
 * monster method, for now, that waits for deferred objects to resolve, 
 * then calculates the closest location on every page change and updates all of the displays
 * @param {object} position - deferred object
 * @param {object } feed - deferred object
 * @return void
 */
function calculateAndDisplay(position, feed) {
    qM('calculateAndDisplay()');
    if (feed !== -1) {
        hospitals = feed;
    }
    if (position !== -1) {
        geodata = position;
        qM(position);
        var x, y, candidate, request;
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        qM(lat + ', ' + lon);
        var minDistance = 1000000000;
        var currentposition = null;
        destination = null;
        currentposition = new google.maps.LatLng(lat, lon);

        // location selection logic - find closest location from candidates
        for (x = 0; x < hospitals.locations.length; x++) {
            candidate = new google.maps.LatLng(hospitals.locations[x].lat, hospitals.locations[x].lon);
            distance = google.maps.geometry.spherical.computeDistanceBetween(currentposition, candidate);
            qM(x + ', ' + distance);
            hospitals.locations[x].distance = Math.round(distance * 0.00062137);
            if (distance < minDistance && $.isNumeric(hospitals.locations[x].wait)) {
                minDistance = distance;
                locationId = x;
            }//end if     
        }//end for
    }//end if
    if (position === -1) {
        locationId = 0;
    }
//debugging
    qM('loc=' + locationId + 'wait=' + hospitals.locations[locationId].wait);
    qM('display wait ' + hospitals.locations[locationId].wait);
    qM('closestlocationId=' + locationId);
    qM('display distance ' + hospitals.locations[locationId].distance);

//build list page array and process feed 
    listLoop = 0;
    listPageHTML = '';
    qM('# of facilities ' + hospitals.locations.length);
    for (listLoop = 0; listLoop < hospitals.locations.length; listLoop++) {
        
        //get hours
        hospitals.locations[listLoop].openText = getTodayHours(hospitals, listLoop);
        
        //debug
        qM('listLoop ' + listLoop);

        //time defaults
        if (feed === -1) {
            hospitals.locations[listLoop].wait = '--';
        }
             if (isNaN(hospitals.locations[listLoop].wait)) {
            displayMinutes = '';
        } else {
            var leadingZero = "";
            var hourLeadingZero= "";
            var processHours = Math.floor(hospitals.locations[listLoop].wait / 60);
            var processMin = hospitals.locations[listLoop].wait - (processHours*60);
            if(processMin <10){
                leadingZero = "0";
            }
             if(processHours <10){
                hourLeadingZero = "0";
            }
            
            hospitals.locations[listLoop].wait = hourLeadingZero + processHours + ":" + leadingZero + processMin;
            
            
            
            displayMinutes = ' hr / min';
        }
        
        if (position === -1) {
            hospitals.locations[listLoop].distance = '--';
        }
   

        listPageHTML += [
            '<ul id="locationsListbox" data-role="controlgroup"><li><a onClick="locationId = ' + listLoop + ';" href="#detail" data-role="button" data-icon="arrow-r" \
            data-iconpos="right" data-transition="fade">\
            <span class="location-list-item-title name">' + hospitals.locations[listLoop].name +
                    '</span><br><span class="location-list-item-wait">Wait: <span \
            class="wait">' + hospitals.locations[listLoop].wait + '</span><span class="displayminutes"> ' + displayMinutes + '</span></span>',
            '<span class="location-list-item-distance">Miles: <span \
            class="distance">' + hospitals.locations[listLoop].distance + '</span></span></a></li></ul>'
        ].join('');
    }
    qM(listPageHTML);

//google directions address
    googleLoop = 0;
    qM('# of facilities ' + hospitals.locations.length);
    for (googleLoop = 0; googleLoop < hospitals.locations.length; googleLoop++) {
        qM('googleLoop ' + googleLoop);
        hospitals.locations[googleLoop].google = 'http://www.maps.google.com/?q=' + (
                [
                    hospitals.locations[googleLoop].address1,
                    hospitals.locations[googleLoop].address2,
                    hospitals.locations[googleLoop].city,
                    hospitals.locations[googleLoop].state,
                    hospitals.locations[googleLoop].zipcode
                ].join(' ').split(' ').join('+'));
        qM(hospitals.locations[googleLoop].google);
    }

//populate home page
    if ($.isNumeric(locationId)) {

        if (position !== -1) {
            $('div.nearest-location-text span').html('Nearest location:');
        }
        if (position === -1) {
            $('div.nearest-location-text span').html('GPS Unavailable, showing:');
        }

        $("div#wait span.wait").html(hospitals.locations[locationId].wait);

        if (/^[^0-9:]/.test(hospitals.locations[locationId].wait)) {
            $("div#wait span.displayminutes").text('');
            $("span.display-wait-time").css("font-size", "2.5em");
        } else {
            $("div#wait span.displayminutes").text(' hr / minutes');
            $("span.display-wait-time").css("font-size", "2.5em");
        }

        $(".nearest-location-text > h1.name").html(hospitals.locations[locationId].name);
        //$("div.address span").html(hospitals.locations[locationId].address);
        $("div#distance span.distance").html(hospitals.locations[locationId].distance);
        $.ajax({
            url: 'images/' + locationId + '.png',
            type: 'HEAD',
            error:
                    function() {
                        //do something depressing
                    },
            success:
                    function() {
                        $('[data-role=page]#home .photo img').attr("src", 'images/' + locationId + '.png');
                        qM('images/' + locationId + '.png');
                    }
        });
    }

    //$('#when').trigger('create');
}//end function calculateAndDisplay()

/**
 * function fetchFail()
 * stub
 */
function fetchFail() {
}


/**
 * function onGeoError(error)
 * geolocation off or not working
 * @param {object} error - the error object
 */
function onGeoError(error) {
    qM('onGeoError()');

    if (error === 1) {


    }//end if
    else {
        qM('error code: ' + error.code);
    }
}
//end onGeoError

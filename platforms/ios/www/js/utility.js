/*******************************************************************/
// utility.js - utility functions - Holy Cross Urgentcare App
// Gary Peach at BPD Advertising
// http://www.bpdadvertising.com
/*******************************************************************/

/**
 * function qM(message)
 * logs quick message to console if debugging is on
 * @param {string} message
 * @returns {void}
 */
function qM(message) {
    if (debug === 1) {
        console.log(message);
        localmessage = message;
        message = null;
    }
}//end qM()


/** 
 * function googleAnalytics()
 * @returns {void}
 */
function googleAnalytics() {
    qM('googleAnalytics()');

    if (activated === 0) {
        ga('create', 'UA-15620885-9', {
            'storage': 'none',
            'clientId': device.uuid
        });

        ga('send', {
            'hitType': 'pageview',
            'page': '/index.html'
        });
        qM("Google Analytics initial pageview triggered " + 'index.html');
        activated = 1;
    }
}//end googleAnalytics()




/**
 * shouldRotateToOrientation(rotation)
 * force ios orientation - overrides cordova lib
 * http://stackoverflow.com/questions/17430763/detect-orientation-change-before-event-firing-with-phonegap/19001690#19001690
 * @param {int} rotation
 * @returns {boolean}
 */
function shouldRotateToOrientation(rotation) {
    switch (rotation) {
        case 0:
            return true;
        case 90:
            return false;
        case -90:
            return false;
        case 180:
            return false;
    }
}

function getTodayHours(hospitals, loop) {
    if (hospitals.locations[loop].range === -1) {
        return  hospitals.locations[loop].openText = 'Open 24 hrs/day 7 days a week.';
    }
    else {
        var dayNum = new Date();
        var todayNum = dayNum.getDay();
        var openHour, closedHour, openMin, closedMin, openAmPm, closedAmPm = '';
        openHour = hospitals.locations[loop].range[todayNum].open.substring(0, 2);
        openMin = hospitals.locations[loop].range[todayNum].open.substring(2, 4);
        if (parseInt(openHour, 10) > 12) {
            openHour = (parseInt((openHour - 12), 10)).toString();
            openAmPm = 'PM';
        } else {
            openHour = (parseInt(openHour, 10)).toString();
            openAmPm = 'AM';
        }
        closedHour = hospitals.locations[loop].range[todayNum].closed.substring(0, 2);
        closedMin = hospitals.locations[loop].range[todayNum].closed.substring(2, 4);
        if (parseInt(closedHour, 10) > 12) {
            closedHour = parseInt((closedHour - 12), 10).toString();
            closedAmPm = 'PM';
        }
        else {
            closedHour = parseInt(closedHour, 10).toString();
            closedAmPm = 'AM';
        }
        //hospitals.locations[loop].openText = "Open today " + openHour + ':' + openMin + openAmPm + ' until ' + closedHour + ':' + closedMin + closedAmPm;
        hospitals.locations[loop].openText = "Open today " + ' until ' + closedHour + ':' + closedMin + closedAmPm;
        return hospitals.locations[loop].openText;
    }
}

  
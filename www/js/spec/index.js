/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




describe("cordova.js availability tests", function() {
    
       it("cordova object is defined", function() {
        expect(cordova).toBeDefined();
    });
    
           it(" cordova version is 3.3.0-rc1", function() {
        expect(cordova.version).toBe('3.3.0-rc1');
    });
});

describe("main.js availability tests", function() {
      
    it("fetchFeedAndPosition() is defined", function() {
        expect(fetchFeedAndPosition).toBeDefined();
    });
  
});

describe("utility.js availability tests", function() {
      
    it("qM() is defined", function() {
        expect(qM).toBeDefined();
    });
});




xdescribe("device ready set", function() {

    it("test one function", function() {
        expect(one("goo")).toEqual('goo');
    });
});

describe("device geolocation testing for FL lon/lat", function() {
    
    test = {
            lon: 0,
            lat: 0,
            error: 0,

            success: function(pos) {
                test.lat = pos.coords.latitude;
                test.lon = pos.coords.longitude;
            },
            
            fail: function(err) {
                test.error = err.message;
            }
        };
        
        beforeEach(function(){
            test.lon = 0;
            test.lat = 0;
            test.error = 0;
        });
       

    it("returns 20 <  lat > 30 async", function() {
        runs(function() {
            spyOn(test, "success").andCallThrough();
            spyOn(test, "fail").andCallThrough();
            navigator.geolocation.getCurrentPosition(test.success, test.fail, {wait: 3000});
        });

        waitsFor(function() {
            return test.lat > 20;
        }, "waiting for lat", 5000);

        runs(function() {
            expect(test.success).toHaveBeenCalled();
            //alert("waited and got " + test.lat);
            expect(test.lat).toBeGreaterThan(20);
            expect(test.lat).toBeLessThan(30);
        });
    });
    
    
        it("returns -78 < lon > -82 async", function() {
        runs(function() {
            spyOn(test, "success").andCallThrough();
            spyOn(test, "fail").andCallThrough();
            navigator.geolocation.getCurrentPosition(test.success, test.fail, {wait: 3000});
        });

        waitsFor(function() {
            return test.lon < -78;
        }, "waiting for lon", 5000);

        runs(function() {
            expect(test.success).toHaveBeenCalled();
            //alert("waited and got " + test.lon);
            expect(test.lon).toBeGreaterThan(-82);
            expect(test.lon).toBeLessThan(-78);
        });
    });
    
    
    
});





xdescribe("spy tests", function(){

  it("one function defined", function() {
       expect(one).toBeDefined();
    });

it("test one function", function() {
       expect(one("goo")).toEqual('goo');
    });
    
     it("spy on one", function() {
            spyOn(window, "one");
            window.one("goo");
       expect(window.one).toHaveBeenCalledWith("goo");
    });
    
       it("spy on setEventHandlers", function() {
            spyOn(window, "setEventHandlers");
            window.setEventHandlers();
       expect(window.setEventHandlers).toHaveBeenCalled();
    });
});



xdescribe("exception handling", function(){}
        );




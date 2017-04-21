"use strict";
var geolocation = require("nativescript-geolocation");
var enums_1 = require("ui/enums");
var Observable = require("data/observable").Observable;
var page;

var viewModel = new Observable({
    coordinates: "lat:000, long:000",
});

exports.pageLoaded = function(args) {
    console.log("hello mada faca");
    page = args.object;
    page.bindingContext = viewModel;
};

function enableLocationTap(args) {
    if (!geolocation.isEnabled()) {
        geolocation.enableLocationRequest();
    }
}
exports.enableLocationTap = enableLocationTap;

function buttonGetLocationTap(args) {
    var location = geolocation.getCurrentLocation({ desiredAccuracy: enums_1.Accuracy.high, updateDistance: 0.1, maximumAge: 5000, timeout: 20000 }).
        then(function (loc) {
        if (loc) {
            viewModel.coordinates = `lat:${loc.latitude} long:${loc.longitude}`;
        }
    }, function (e) {
        console.log("Error: " + e.message);
    });
}
exports.buttonGetLocationTap = buttonGetLocationTap;
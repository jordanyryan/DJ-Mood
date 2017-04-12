var request = require("request"),
    assert = require('assert');
var base_url = "http://localhost:3000/"

describe("DJ Mood", function() {
    describe("GET /", function() {
        it("returns status code 200", function() {
            request.get(base_url, function(error, response, body) {

            });
        });
    });

    describe("GET /login", function() {
        it("returns status code 200", function() {
            request.get(base_url, function(error, response, body) {

            });
        });
    });

    describe("GET /profile", function() {
        it("returns status code 200", function() {
            request.get(base_url, function(error, response, body) {

            });
        });
    });
});

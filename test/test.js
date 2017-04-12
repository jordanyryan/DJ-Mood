var request = require("request"),
    assert = require('assert');
var base_url = "http://localhost:3000/"

describe("DJ Mood", function() {
    describe("GET /", function() {
        it("returns status code 200", function() {
            request.get(base_url, function(error, response, body) {
              response.render('index', {
                  title: 'Home',
                  user: request.user
              });
            });
        });
    });

    describe("GET /login", function() {
        it("returns status code 200", function() {
            request.get(base_url, function(error, response, body) {
              response.render('login',{
                title: 'Login',
                user: request.user
              })
            });
        });
    });

    describe("GET /profile", function() {
        it("returns status code 200", function() {
            request.get(base_url, function(error, response, body) {
              if (request.user) {
                  response.render('profile', {
                      title: 'Profile',
                      user: request.user
                  });
              } else {
                  response.redirect('/login');
              }

            });
        });
    });
    describe("POST", function(){
      it('returns status code 200', function(){
        request.post(base_url, function(error, response, body){
          let preferences = (Object.values(req.body))
          User.update({_id: request.user.id }, { $set: { preferences: preferences}}, function(req, res){
          })
          resquest.redirect('/profile')
        })
      })
    })
});

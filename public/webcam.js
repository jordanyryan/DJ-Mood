$(document).ready(function() {
  Recorder.configure({
    size: 'small', 
    bandwidth: 180, 
    fps: 10,
    duration: 3
  });

  Recorder.embed({
    target: 'webcam',
    complete: function(outputs){
      $("#recorder0").remove();
      $("#webcam-container").append("<h3>Please wait while we analyze your video.<h3>")
      $.post('/videos', outputs, function(response) {
        // doesnt get called
      });
      checkForDoneness();
    }
  });
});

var checkForDoneness = function() {
  var isDone = setInterval(function() {
    $.ajax({
      url: '/playlist',
      method: 'GET',
      statusCode: {
        202: function(data, textStatus, xhr) {
          console.log('Waiting');
        },
        200: function(data, textStatus, xhr) {
          clearInterval(isDone);
          console.log(data);
          $('iframe').attr('src', data);
        }
      }
    });
  }, 3000);
}
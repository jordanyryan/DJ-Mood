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
      $("#webcam-container").append("<h3 id='alert'>Please wait while we analyze your video.<h3>")
      $.ajax({
        url: '/videos',
        method: 'POST',
        data: outputs
      }).always(function() {
        // don't do anything
      })
      checkForDoneness();
    }
  });
});

var checkForDoneness = function() {
  var waits = 0;
  var isDone = setInterval(function() {
    $.ajax({
      url: '/playlist',
      method: 'GET',
      statusCode: {
        202: function(data, textStatus, xhr) {
          if (waits >= 20) {
            clearInterval(isDone);
            $('#alert').text('Something went wrong behind the scenes.  Please try again.')
          }
          console.log('Waiting');
          waits += 1;
        },
        200: function(data, textStatus, xhr) {
          clearInterval(isDone);
          $("#alert").text('Your playlist type: ' + data.type);
          $('iframe').attr('src', data.url);
        }
      }
    });
  }, 3000);
}
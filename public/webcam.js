$(document).ready(function() {
  Recorder.configure({
    size: 'small', // set the default size to small
    bandwidth: 180, // set the max upload bandwidth to 180 kbps
    fps: 10, // set the video capture to 15 frames per second
    duration: 3
    // see configuration section of docs for full list.
  });

  Recorder.embed({ // renders recorder in the page
    target: 'webcam', // pass the id of the div where you want to embed 
    complete: function(outputs){ // called when the video has been saved
      // e.g. ajax call to save video on server
      $.post('/videos', outputs, function(response) {
        alert('Video saved');
      });
    }
  });

  $('#snap').click(function(){
    Recorder.show({ // open snapper in an overlay window
      complete: function(outputs) { // called when the video has been saved
        // set the output values into form fields 
        $('#png_url').val(outputs['png']); // png thumbnail of video
        $('#flv_url').val(outputs['flv']); // used for playback in flash video player
        $('#mp4_url').val(outputs['mp4']); // used for iphone / android phones
        $('#3gp_url').val(outputs['3gp']); // used for older mobile phones
      }
    });
  });
});
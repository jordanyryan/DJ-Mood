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
        alert('Video saved');
      });
    }
  });

  $('#snap').click(function(){
    Recorder.show({ 
      complete: function(outputs) { 
        $('#png_url').val(outputs['png']); 
        $('#flv_url').val(outputs['flv']); 
        $('#mp4_url').val(outputs['mp4']); 
        $('#3gp_url').val(outputs['3gp']); 
      }
    });
  });
});
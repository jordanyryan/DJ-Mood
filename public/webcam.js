$(document).ready(function() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
  var localMediaStream = null;
  var video = document.getElementById('mirror');
  // webcam setup
  if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, function(stream) {
      localMediaStream = stream;
      video.src = window.URL.createObjectURL(stream);
    }, function() {
      $('#mirror, #video').remove();
      $('#webcam').html('<h3>You need a webcam to make this work.</h3>');
    });
  };

  function captureVideo() {

    if (localMediaStream) {
      var recorder = RecordRTC(localMediaStream, {type: video, recorderType: RecordRTC.WhammyRecorder})
      recorder.startRecording()
      setTimeout(function() {
        recorder.stopRecording(function() {
          console.log('GOT A VIDEO');
        })
      }, 10000);
      // send that ^ data to API via AJAX
      // catch response in .done and pass to express
      // clear canvas
    }
  };

  $('#snap').click(function() {
    var video = captureVideo();
  });
});

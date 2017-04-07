$(document).ready(function() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
  var localMediaStream = null;
  var video = document.getElementById('mirror');
  var canvas = document.getElementById('video');
  var ctx = canvas.getContext('2d');
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
      ctx.drawImage(video, 0, 0);
      // send that ^ data to API via AJAX
      // catch response in .done and pass to express
      // clear canvas
    }
  };

  $('#snap').click(function() {
    captureVideo();
  });
});

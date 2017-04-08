$(document).ready(function() {
  
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
  var localMediaStream = null;
  var video = document.getElementById('mirror');
  
  // record video & post to server
  function captureVideo() {
    if (localMediaStream) {
      var recorder = RecordRTC(localMediaStream, {type: video, recorderType: RecordRTC.WhammyRecorder})
      recorder.startRecording()
      setTimeout(function() {
        recorder.stopRecording(function() {
          recorder.getDataURL(function(dataURL) {
            var video = {
              blob: recorder.getBlob(),
              dataURL: dataURL
            };
            var fileName = function() {
              return (Math.floor(Math.random()*(99999-10000))+10000).toString() + '.' + video.blob.type.split('/')[1]
            };
            var postFile = {
              name: fileName,
              type: video.blob.type,
              contents: video.dataURL
            };
            $.ajax({
              url: '/videos',
              type: 'POST',
              data: JSON.stringify(postFile)
            }).done(function(response) {
              // update the player with new uri
            });
          });
        });
      }, 10000);
    };
  };

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

  $('#snap').click(function() {
    captureVideo();
  });
});
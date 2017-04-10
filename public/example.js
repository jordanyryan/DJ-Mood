// when btnStopRecording is clicked
function onStopRecording() {
    audioRecorder.getDataURL(function(audioDataURL) {
        var audio = {
            blob: audioRecorder.getBlob(),
            dataURL: audioDataURL
        };
        
        // if record both wav and webm
        if(!isRecordOnlyAudio) {
            audio.blob = new File([audio.blob], 'audio.wav', {
                type: 'audio/wav'
            });
            
            videoRecorder.getDataURL(function(videoDataURL) {
                var video = {
                    blob: videoRecorder.getBlob(),
                    dataURL: videoDataURL
                };
                
                postFiles(audio, video);
            });
            return;
        }
        
        // if record only audio (either wav or ogg)
        if (isRecordOnlyAudio) postFiles(audio);
    });
}
function postFiles(audio, video) {
    // getting unique identifier for the file name
    fileName = generateRandomString();

    // this object is used to allow submitting multiple recorded blobs
    var files = { };

    // recorded audio blob
    files.audio = {
        name: fileName + '.' + audio.blob.type.split('/')[1], // MUST be wav or ogg
        type: audio.blob.type,
        contents: audio.dataURL
    };

    if(video) {
        files.video = {
            name: fileName + '.' + video.blob.type.split('/')[1], // MUST be webm or mp4
            type: video.blob.type,
            contents: video.dataURL
        };
    }
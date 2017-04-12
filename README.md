# README

DJ MOOD is an application that takes a short, 3-second video of the user's face, analyzes the emotions it is displaying, and uses those emotions to generate a playlist from Spotify.

## EMOTIONS

We are using the Kairos Facial Recognition API to analyze the videos.  This returns information about all the faces in the video, including a reading of six basic emotions - joy, sadness, surprise, fear, contempt, and disgust - on a scale of 1 to 100.

Our algorithm then compares this output to our library of emotional states and determines which of those states it is 'closest' to - e.g. a face showing primarily 'joy' would be closest to our 'happy' state.

The closest state in our library then gets passed on to our music-picking algorithm and a playlist to suit this state is returned from there.

While there are only a few basic emotional states defined at the moment, this approach can be refined and expanded upon in the future.

## MUSIC

The music for our response playlists is found via a lastFM tag

Once the tracks have been picked, the app compiles them into a playlist on the users Spotify profile, and shows that playlist in an embedded player on the page.
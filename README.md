# README

DJ MOOD is an application that takes a short, 3-second video of the user's face, analyzes the emotions it is displaying, and uses those emotions to generate a playlist from Spotify.

## Link

http://dj-mood.herokuapp.com/
Click playlist to get started

## EMOTIONS

We are using the Kairos Facial Recognition API to analyze the videos.  This returns information about all the faces in the video, including a reading of six basic emotions - joy, sadness, surprise, fear, contempt, and disgust - on a scale of 1 to 100.

Our algorithm then compares this output to our library of emotional states and determines which of those states it is 'closest' to - e.g. a face showing primarily 'joy' would be closest to our 'happy' state.

The closest state in our library then gets passed on to our music-picking algorithm and a playlist to suit this state is returned from there.

While there are only a few basic emotional states defined at the moment, this approach can be refined and expanded upon in the future.

## MUSIC

DJ MOOD makes its selections via a lastFM tag search attuned to your emotional state.  This search will return a random subset from a large collection of the top tracks, so the user will get a different playlist every time.

Once the tracks have been selected, a playlist is built via Spotify.  This playlist is immediately displayed in an embedded player on the site, and it is added to the user's Spotify playlists for later playback.

Since the music is being sourced from Spotify, this app requires that users have a Spotify account and be logged into it.  This is handled via the ```passport-spotify``` node package.

## USER PREFERENCES

DJ MOOD also provides users with the ability to configure the app's responses to their emotional state.  These preferences alter the tag search that is triggered by each kind of emotional input - so for example, a user could request that the app play sad music when they are happy, or happy when they are sad.  These preferences are linked to the user's Spotify login and will be saved in between uses.

## TECHNOLOGIES

DJ MOOD is built out of pure Javascript.  The back end runs on an Express server which connects to a MongoDB database that stores user preferences.  The front end views are built with the Pug view engine.

## ABOUT US

DJ MOOD was the brain child of Jordany Rosas, and was built with the help of Tom Chang, La-Keisha Towner and Peter Menniti.  We are four sensitive and emotional appreciators of the arts and this is our final project at Dev Bootcamp, which we attended Feb-Apr 2017.

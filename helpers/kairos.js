var KariosHelper = {
	kairosBaseCases: {
		happy: {
			joy: 0,
			surprise: 0,
			sadness: 0,
			anger: 0,
			disgust: 0,
			fear: 0
		},
		excited: {
			joy: 0,
			surprise: 0,
			sadness: 0,
			anger: 0,
			disgust: 0,
			fear: 0
		},
		sad: {
			joy: 0,
			surprise: 0,
			sadness: 0,
			anger: 0,
			disgust: 0,
			fear: 0
		},
		angry: {
			joy: 0,
			surprise: 0,
			sadness: 0,
			anger: 0,
			disgust: 0,
			fear: 0
		},
		relaxed: {
			joy: 0,
			surprise: 0,
			sadness: 0,
			anger: 0,
			disgust: 0,
			fear: 0
		},
		bored: {
			joy: 0,
			surprise: 0,
			sadness: 0,
			anger: 0,
			disgust: 0,
			fear: 0
		},
		despondent: {
			joy: 0,
			surprise: 0,
			sadness: 0,
			anger: 0,
			disgust: 0,
			fear: 0
		}
	},

	kairosMatch: function(userData, baseCase) {
		var userCoordinates = [userData.joy, userData.surprise, userData.sadness, userData.anger, userData.disgust, userData.fear];
		var baseCoordinates = [baseCase.joy, baseCase.surprise, baseCase.sadness, baseCase.anger, baseCase.disgust, baseCase.fear];
		var squaredDiffs = []
		for (var i = 0; i < userCoordinates.length; i++) {
			squaredDiffs.push((userCoordinates[i] - baseCoordinates[i]) * (userCoordinates[i] - baseCoordinates[i]));
		}
		var sumOfSquaredDiffs = squaredDiffs.reduce(function(acc, val) {
			return acc + val;
		}, 0);
		return(Math.sqrt(sumOfSquaredDiffs));
	},

	findBestMatch: function(userData) {
		var keys = Object.keys(this.kairosBaseCases);
		var bestMatch = 999999999;
		var newMatch = 0;
		var matchingState;
		for (var i in keys) {
			newMatch = this.kairosMatch(userData, this.kairosBaseCases[i]);
		};
		if (newMatch < bestMatch) {
			bestMatch = newMatch;
			matchingState = i;
		};
		return matchingState;
	}
};

module.exports = KariosHelper;
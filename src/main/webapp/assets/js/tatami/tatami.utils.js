//cross site scripting defense ; http://ha.ckers.org/xss.html
var xssREG1 = new RegExp("(javascript:|<\s*script.*?\s*>)", "i");
var xssREG2 = new RegExp('\s+on\w+\s*=\s*["\'].+["\']', "i");

function isXSS(msg) {
    return (msg.match(xssREG1) || msg.match(xssREG2));
}

/* Functions called by *.js that are censed to be generic and reusable */

function assertStringNotEquals(stringOne, StringTwo){
    return stringOne != StringTwo;
}

function isAnEmptyTextArea(tweet){
	return tweet.val() === "";
}

function validateTweetContent(tweet){
	if (isAnEmptyTextArea(tweet)) {
		tweet.attr("data-content", "Please type a message to tweet.");
        tweet.popover('show');
		setTimeout(function() {
            tweet.popover('hide');
        }, 5000);
        return false;
    }
	return true;
}

function validateXSS(tweet){
	if (isXSS(tweet.val())) {
		tweet.attr("data-content", "Cross Site Scripting suspicion. Please check syntax.");
 		tweet.popover('show');
        setTimeout(function() {
            tweet.empty();
        }, 1000);
        return false;
    }
	return true;
}

function resetNbTweetsToDefaultNumber() {
	return DEFAULT_NUMBER_OF_TWEETS_TO_DISPLAY;
}

function incrementNbTweets(nbTweets, nbTweetsInMore) {
	return nbTweets += nbTweetsInMore;
}

function computeNbTweetsToDisplay(nbTweets, reset){
	if (reset){
        nbTweets = resetNbTweetsToDefaultNumber();
    }else{
        nbTweets = incrementNbTweets(nbTweets, DEFAULT_NUMBER_INCREMENTATION_OF_TWEETS_TO_DISPLAY);
    }
	return nbTweets;
}
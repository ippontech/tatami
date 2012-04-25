/* Functions called by jsp/html/etc.. */

// Constants
var DURATION_OF_FADE_TO 				= 400;
var DEFAULT_NUMBER_OF_TWEETS_TO_DISPLAY	= 20;
var DEFAULT_NUMBER_INCREMENTATION_OF_TWEETS_TO_DISPLAY	= 10;

var nbTweetsToDisplay;

var userlineURL = '<a href="/tatami/profile/LOGIN" style="text-decoration:none" title="Show LOGIN tweets">';
var userlineREG = new RegExp("LOGIN", "g");

var userrefREG = new RegExp("@(\\w+)", "g");
var userrefURL = '<a href="/tatami/profile/$1" style="text-decoration:none" title="Show $1 tweets"><em>@$1</em></a>';

var tagrefREG = new RegExp("#(\\w+)", "g");
var tagrefURL = '<a href="#" style="text-decoration:none" onclick="listTagTweets(\'$1\')" title="Show $1 related tweets"><em>#$1</em></a>';

function initTatami() {
    // left panel
    $('#profileTabContent').load('/assets/fragments/profile.html', function () {
        refreshProfile();
        $('#tweetContent').popover({
            trigger: 'manual',
            placement: 'bottom',
            title: 'Error',
            content: '<i class="icon-exclamation-sign"></i>&nbsp;Please type a message to tweet.'
        });
    });
    $('#updateProfileTabContent').load('/assets/fragments/updateProfile.html');
    $('#followUserContent').load('/assets/fragments/followUser.html', suggestUsersToFollow());
    // auto-refresh
    $('a[data-toggle="pill"]').on('show', function(e) {
        if (e.target.hash == '#profileTabContent') {
            refreshProfile();
        } else if (e.target.hash == '#updateProfileTabContent') {
            displayProfile();
        }
    });

    // right panel
    $('#timeLinePanel').load('/assets/fragments/timeline.html', function() {
        listTweets(true);
    });
    // browser's refresh shortcut override
    shortcut.add("Ctrl+R", function() {
        listTweets(true);
    });
    // infinite scroll
    $(window).scroll(function() {
        if ($('#timeline').is(':visible') && $(window).scrollTop() >= $(document).height() - $(window).height()) {
            listTweets(false);
        }
    });

    $('#favLinePanel').load('/assets/fragments/favline.html');
    $('#tagLinePanel').load('/assets/fragments/tagline.html');
    $('#searchLinePanel').load('/assets/fragments/searchline.html');

    $('#piechartPanel').load('/assets/fragments/piechart.html');
    $('#punchchartPanel').load('/assets/fragments/punchchart.html');
    // auto-refresh
    $('a[data-toggle="tab"]').on('show', function(e) {
        if (e.target.hash == '#favLinePanel') {
            favoriteTweets();
        } else if (e.target.hash == '#piechartPanel') {
            refreshPieChart();
        } else if (e.target.hash == '#punchchartPanel') {
            refreshPunchChart();
        }
    });

    // search form binding
    $('#global-tweet-search').submit(function() {
    	  var query = $(this).serialize();
    	  searchTweets(query);
          return false;
    });

}

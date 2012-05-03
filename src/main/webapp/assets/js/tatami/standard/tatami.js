/* Functions called by jsp/html/etc.. */

// Constants
var DURATION_OF_FADE_TO = 400;
var DEFAULT_NUMBER_OF_TWEETS_TO_DISPLAY = 20;
var DEFAULT_NUMBER_INCREMENTATION_OF_TWEETS_TO_DISPLAY = 10;

var nbTweetsToDisplay;

var userlineURL = '<a href="/tatami/profile/LOGIN" style="text-decoration:none" title="Show LOGIN tweets">';
var userlineREG = new RegExp("LOGIN", "g");

var userrefREG = new RegExp("@(\\w+)", "g");
var userrefURL = '<a href="/tatami/profile/$1" style="text-decoration:none" title="Show $1 tweets"><em>@$1</em></a>';

var tagrefREG = new RegExp("#(\\w+)", "g");
var tagrefURL = '<a href="#" style="text-decoration:none" onclick="listTagTweets(\'$1\')" title="Show $1 related tweets"><em>#$1</em></a>';

function initHome() {
    // left panel
    refreshProfile();
    $('#tweetContent').popover({
        trigger: 'manual',
        placement: 'bottom',
        title: 'Error',
        content: '<i class="icon-exclamation-sign"></i>&nbsp;Please type a message to tweet.'
    });
    $('#followUserContent').load('/assets/fragments/standard/followUser.html', suggestUsersToFollow());
    // auto-refresh
    $('a[data-toggle="pill"]').on('show', function(e) {
        if (e.target.hash == '#profileTabContent') {
            refreshProfile();
        } else if (e.target.hash == '#updateProfileTabContent') {
            displayProfile();
        }
    });

    // right panel
    $('#timeLinePanel').load('/assets/fragments/standard/timeline.html', function() {
        $('#refreshTweets').click(function() {
            listTweets(true);
        });
    });
    listTweets(true);

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

    $('#favLinePanel').load('/assets/fragments/standard/favline.html');
    $('#tagLinePanel').load('/assets/fragments/standard/tagline.html');
    $('#searchLinePanel').load('/assets/fragments/standard/searchline.html');

    $('#piechartPanel').load('/assets/fragments/standard/piechart.html');
    $('#punchchartPanel').load('/assets/fragments/standard/punchchart.html');
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

    if (tag != "") {
        listTagTweets(tag);
    }

    //Mustache.js templates
    $('#mustache').load('/assets/templates_mustache/templates.html');
}

function initProfile() {
    $('#tweetsPanel').load('/assets/fragments/standard/timeline.html', function() {
        listUserTweets(userLogin);
        $('#refreshTweets').click(function() {
            listUserTweets(userLogin);
        });
    });
    // browser's refresh shortcut override
    shortcut.add("Ctrl+R", function() {
        listUserTweets(userLogin);
    });
    $('a[data-toggle="tab"]').on('show', function(e) {
        if (e.target.hash == '#followingPanel') {
            makeFollowingList();
        } else if (e.target.hash == '#followersPanel') {
            makeFollowersList();
        }
    });

    //Mustache.js templates
    $('#mustache').load('/assets/templates_mustache/templates.html');
}

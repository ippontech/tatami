/* Functions called by jsp/html/etc.. */

// Constants
var DURATION_OF_FADE_TO = 400;
var DEFAULT_NUMBER_OF_TWEETS_TO_DISPLAY = 20;
var DEFAULT_NUMBER_INCREMENTATION_OF_TWEETS_TO_DISPLAY = 10;

var nbTweetsToDisplay;
var scrollLock = false;

var userlineURL = '<a href="/tatami/profile/LOGIN" style="text-decoration:none" title="Show LOGIN tweets">';
var userlineREG = new RegExp("LOGIN", "g");

var userrefREG = new RegExp("@(\\w+)", "g");
var userrefURL = '<a href="/tatami/profile/$1" style="text-decoration:none" title="Show $1 tweets"><em>@$1</em></a>';

var tagrefREG = new RegExp("#(\\w+)", "g");
var tagrefURL = '<a href="#" style="text-decoration:none" onclick="listTagTweets(\'$1\')" title="Show $1 related tweets"><em>#$1</em></a>';

var url1REG = new RegExp("(ftp|http|https|file):\\/\\/[a-zA-Z0-9-_\\/.]+(\\b|$)", "gim"); // URL starting with a protocol among these : ftp, http, https, file
var url1URL = '<a href="$&" style="text-decoration:none" title="Open $& link" target="_blank"><em>$&</em></a>';
var url2REG = new RegExp("([^\\/])(www[a-zA-Z0-9-_\\/.]+(\\b|$))", "gim"); // URL without protocol, starting with www. http is set as the default protocol
var url2URL = '$1<a href="http://$2" style="text-decoration:none" title="Open http://$2 link" target="_blank"><em>$2</em></a>';

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
        listTweets();
    });

    // infinite scroll
    $(window).scroll(function() {
        if ($('#timeline').is(':visible') && $(window).scrollTop() >= $(document).height() - $(window).height() - 200) {
            if (scrollLock == false) {
                scrollLock = true;
                listTweets(false);
            }
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

    if (searchQuery != "") {
        $("#searchQuery").val(searchQuery);
        var query = $('#global-tweet-search').serialize();
        searchTweets(query);
        return false;
    }
    autoUpdateTweetsList();
}

function autoUpdateTweetsList() {
    var topTweetId = $("#tweetsList .tweet:first").attr("tweetId");
    if (topTweetId != undefined) {
        updateTweetsList(topTweetId);
    }
    setTimeout("autoUpdateTweetsList()", 20000);
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

    // infinite scroll
    $(window).scroll(function() {
        if ($('#timeline').is(':visible') && $(window).scrollTop() >= $(document).height() - $(window).height() - 200) {
            if (scrollLock == false) {
                scrollLock = true;
                listUserTweets(userLogin);
            }
        }
    });

    $('a[data-toggle="tab"]').on('show', function(e) {
        if (e.target.hash == '#followingPanel') {
            makeFollowingList();
        } else if (e.target.hash == '#followersPanel') {
            makeFollowersList();
        }
    });

    // search form binding
    $('#global-tweet-search').submit(function() {
        var searchQuery = $("#searchQuery").val();
        window.location = "/tatami/?search=" + searchQuery;
        return false;
    });
}

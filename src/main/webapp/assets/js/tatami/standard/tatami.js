/* Functions called by jsp/html/etc.. */

// Constants
var DURATION_OF_FADE_TO = 400;

var scrollLock = false;

var userlineURL = '<a href="/tatami/profile/LOGIN/" style="text-decoration:none" title="Show LOGIN status">';
var userlineREG = new RegExp("LOGIN", "g");

var userrefREG = new RegExp("@(\\w+)", "g");
var userrefURL = '<a href="/tatami/profile/$1/" style="text-decoration:none" title="Show $1 status"><em>@$1</em></a>';

var tagrefREG = new RegExp("#(\\w+)", "g");
var tagrefURL = '<a href="#" style="text-decoration:none" onclick="listTagStatus(\'$1\')" title="Show $1 related status"><em>#$1</em></a>';

var url1REG = new RegExp("(ftp|http|https|file):\\/\\/[a-zA-Z0-9-_\\/.]+(\\b|$)", "gim"); // URL starting with a protocol among these : ftp, http, https, file
var url1URL = '<a href="$&" style="text-decoration:none" title="Open $& link" target="_blank"><em>$&</em></a>';

var url2REG = new RegExp("([^\\/])(www[a-zA-Z0-9-_\\/.]+(\\b|$))", "gim"); // URL without protocol, starting with www. http is set as the default protocol
var url2URL = '$1<a href="http://$2" style="text-decoration:none" title="Open http://$2 link" target="_blank"><em>$2</em></a>';

function initHome() {
    // left panel
    refreshProfile();
    $('#statusContent').popover({
        trigger: 'manual',
        placement: 'bottom',
        title: 'Error',
        content: '<i class="icon-exclamation-sign"></i>&nbsp;Please type a message to status.'
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
        $('#refreshStatus').click(function() {
            listStatus(true);
        });
    });
    listStatus(true);

    // browser's refresh shortcut override
    shortcut.add("Ctrl+R", function() {
        listStatus();
    });

    // infinite scroll
    $(window).scroll(function() {
        if ($('#timeline').is(':visible') && $(window).scrollTop() >= $(document).height() - $(window).height() - 200) {
            if (scrollLock == false) {
                scrollLock = true;
                listStatus(false);
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
            favoriteStatuses();
        } else if (e.target.hash == '#piechartPanel') {
            refreshPieChart();
        } else if (e.target.hash == '#punchchartPanel') {
            refreshPunchChart();
        }
    });

    // search form binding
    $('#global-status-search').submit(function() {
        var query = $(this).serialize();
        searchStatus(query);
        return false;
    });

    if (tag != "") {
        listTagStatus(tag);
    }

    if (searchQuery != "") {
        $("#searchQuery").val(searchQuery);
        var query = $('#global-status-search').serialize();
        searchStatus(query);
        return false;
    }
    autoUpdateStatusList();
}

function autoUpdateStatusList() {
    var topStatusId = $("#statusList .status:first").attr("statusId");
    if (topStatusId != undefined) {
        updateStatusList(topStatusId);
    }
    setTimeout("autoUpdateStatusList()", 20000);
}

function initProfile() {
    $('#statusPanel').load('/assets/fragments/standard/timeline.html', function() {
        listUserStatus(username);
        $('#refreshStatus').click(function() {
            listUserStatus(username);
        });
    });
    // browser's refresh shortcut override
    shortcut.add("Ctrl+R", function() {
        listUserStatus(username);
    });

    // infinite scroll
    $(window).scroll(function() {
        if ($('#timeline').is(':visible') && $(window).scrollTop() >= $(document).height() - $(window).height() - 200) {
            if (scrollLock == false) {
                scrollLock = true;
                listUserStatus(username);
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
    $('#global-status-search').submit(function() {
        var searchQuery = $("#searchQuery").val();
        window.location = "/tatami/?search=" + searchQuery;
        return false;
    });
}

function initStatus() {
    $('#statusPanel').load('/assets/fragments/standard/timeline.html', function() {
        getStatus(statusId);
        $('#refreshStatus').click(function() {
            getStatus(statusId);
        });
    });
    // browser's refresh shortcut override
    shortcut.add("Ctrl+R", function() {
        getStatus(statusId);
    });

    // search form binding
    $('#global-status-search').submit(function() {
        var searchQuery = $("#searchQuery").val();
        window.location = "/tatami/?search=" + searchQuery;
        return false;
    });
}


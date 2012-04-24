<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>
    </title>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.css"/>
    <style>
            /* App custom styles */
    </style>
    <script src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
    <script>!window.jQuery && document.write(unescape('%3Cscript src="/assets/js/CDN/jquery-1.6.4.min.js"%3E%3C/script%3E'))</script>
    <script src="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.js"></script>
    <script>!window.jQuery && document.write(unescape('%3Cscript src="/assets/js/CDN/jquery.mobile-1.1.0.min.js"%3E%3C/script%3E'))</script>

    <script src="/assets/js/CDN/jquery.mobile-css-CDN-fail.js"></script>

    <script src="/assets/js/tatami/tatami.constants.js"></script>
    <script src="/assets/js/tatami/tatami.mobile.js"></script>

    <style>
        .ui-li-desc {
            overflow: visible;
            white-space: pre-line;
        }
    </style>
</head>
<body>
<div data-role="page" id="timeline">
    <div data-theme="a" data-role="header">
        <a href="javascript:refreshTweet();" data-theme="a" data-iconshadow="false">Refresh</a>

        <h3>
            Timeline
        </h3>
    </div>
    <div data-role="content">
        <div data-role="collapsible" >
            <h3>Send </h3>

            <div>
                <textarea id="tweetText" placeholder="tweet me">
                </textarea>
                <input type="submit" value="Tweet" onclick="sendTweet()"/>

            </div>
        </div>
        <br/>

        <div>
            <ul id="tweetList" data-role="listview">
            </ul>
        </div>

    </div>

    <div data-theme="a" data-role="footer" data-position="fixed">
        <div data-role="navbar" data-iconpos="top">
            <ul>
                <li>
                    <a href="#timeline" data-transition="none" data-theme="" data-icon="" class="ui-btn-active">
                        Timeline
                    </a>
                </li>
                <li>
                    <a href="#favoriteTweets" data-transition="none" data-theme="" data-icon="">
                        Favorites
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
<div data-role="page" id="favoriteTweets">
    <div data-theme="a" data-role="header">
        <a href="javascript:listFavorite();" data-theme="a" data-iconshadow="false">Refresh</a>

        <h3>
            Favorites
        </h3>
    </div>
    <div data-role="content">

        <ul id="favoritesTweet" data-role="listview">
        </ul>
    </div>
    <div data-theme="a" data-role="footer" data-position="fixed">
        <div data-role="navbar" data-iconpos="top">
            <ul>
                <li>
                    <a href="#timeline" data-transition="none" data-theme="" data-icon="">
                        Timeline
                    </a>
                </li>
                <li>
                    <a href="#favoriteTweets" data-transition="none" data-theme="" data-icon="" class="ui-btn-active">
                        Favorites
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>


<script>

    var login = "<sec:authentication property="principal.username"/>";

    $(function () {

        refreshTweet();
        listFavorite();

    });

    function sendTweet() {
        postTheTweet($('#tweetText').val());
    }


</script>
</body>
</html>
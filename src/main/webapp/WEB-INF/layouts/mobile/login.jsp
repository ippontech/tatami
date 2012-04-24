<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>
    </title>
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.css"/>
    <style>
            /* App custom styles */
    </style>
    <script src="http://code.jquery.com/jquery-1.6.4.min.js"></script>
    <script>!window.jQuery && document.write(unescape('%3Cscript src="/assets/js/jquery/jquery-1.7.2.min.js"%3E%3C/script%3E'))</script>
    <script src="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.js"></script>
    <script>!window.jQuery && document.write(unescape('%3Cscript src="/assets/js/jquery/jquery.mobile-1.1.0.min.js"%3E%3C/script%3E'))</script>

    <script src="/assets/js/jquery/jquery.mobile-css-CDN-fail.js"></script>
</head>
<body>
<div data-role="page" id="page1">
    <div data-theme="a" data-role="header">
        <h3>
            Tatami
        </h3>
    </div>
    <div data-role="content">
        <form action="/tatami/authentication" method="POST" >
            <div data-role="fieldcontain">
                <fieldset data-role="controlgroup">
                    <label for="j_username">
                        Login
                    </label>
                    <input id="j_username" name="j_username" placeholder="" value="jdubois" type="text" />
                </fieldset>
            </div>
            <div data-role="fieldcontain">
                <fieldset data-role="controlgroup">
                    <label for="j_password">
                        Password
                    </label>
                    <input id="j_password" name="j_password" placeholder="" value="password" type="text" />
                </fieldset>
            </div>
            <input type="submit" data-icon="star" data-iconpos="left" value="Authenticate" />
        </form>
    </div>
    <div data-theme="a" data-role="footer" data-position="fixed">
        <h1>
            Copyright 2012 Ippon Technologies
        </h1>
    </div>
</div>
<script>
    //App custom javascript
</script>
</body>
</html>
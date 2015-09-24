<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <title>Tatami</title>
    <meta name="author" content="Ippon Technologies">
    <link rel="shortcut icon" type="image/x-icon" href="/assets/img/company-logo.ico">
    <%= cssTags %>
    <link href="/assets/css/tatami.css" rel="stylesheet" type="text/css">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1.0">
    <!--<meta name="description" content="">-->

    <!-- Touch Icons -->
    <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
    <link rel="apple-touch-startup-image" href="/assets/img/startup.png">
    <meta name="apple-mobile-web-app-capable" content="yes" />

    <!-- Needed if using HTML5 History API and relative links (Angular routing) -->
    <!--<base href="/">-->

    <!--[if IE]>
        <link rel="stylesheet" type="text/css" href="/assets/css/ie-only.css" />
    <![endif]-->
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 7]>
    <link rel="stylesheet" href="http://blueimp.github.com/cdn/css/bootstrap-ie6.min.css">
    <![endif]-->
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="/assets/vendor/js/respond/respond.js"></script>
    <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    
</head>
<body ng-app="TatamiApp" tour>
    <toast></toast>
    <div ui-view="topMenu"></div>
    <div ui-view></div>
    <div ui-view="footer"></div>
    <%= jsTags %>
</body>
</html>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <title><fmt:message key="tatami.title"/></title>
    <meta name="viewport" content="initial-scale = 1,user-scalable=no,maximum-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Ippon Technologies">

    <link href="/css/themes/bootstrap.css" rel="stylesheet">

    <c:if test="${wro4jEnabled eq false}">
        <link href="/css/reset.css" rel="stylesheet">
        <link href="/css/bootstrap-responsive.css" rel="stylesheet">
        <link href="/css/tatami.css" rel="stylesheet">
    </c:if>
    <c:if test="${wro4jEnabled eq true}">
        <link href="/tatami/static-wro4j/${version}/vendor.css" rel="stylesheet">
    </c:if>
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    <link rel="shortcut icon" href="/img/shortcut-icon.png">
    <link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
    <link rel="apple-touch-startup-image" href="/img/startup.png">
    <meta name="apple-mobile-web-app-capable" content="yes" />

    <script src="/js/vendor/jquery.js"></script>
    <script src="/js/vendor/bootstrap.js"></script>
    <script src="/js/vendor/d3.js"></script>
    <script src="/js/vendor/underscore.js"></script>
    <script src="/js/vendor/backbone.js"></script>
    <script src="/js/vendor/marked.js"></script>
    <script src="/js/vendor/backbone.marionette.js"></script>
    <script src="/js/vendor/modernizr.js"></script>

    <script src="/js/app/app.js"></script>
    <script src="/js/app/models/users.js"></script>
    <script type="text/javascript">
        var username = '${user.username}';
    </script>
</head>
<body>
</body>
</html>

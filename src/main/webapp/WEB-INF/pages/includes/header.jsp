<%@ page import="fr.ippon.tatami.config.Constants" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%
    String version = Constants.VERSION;
    request.setAttribute("version", version);
    String googleAnalyticsKey = Constants.GOOGLE_ANALYTICS_KEY;
    request.setAttribute("googleAnalyticsKey", googleAnalyticsKey);
    boolean wro4jEnabled = Constants.WRO4J_ENABLED;
    request.setAttribute("wro4jEnabled", wro4jEnabled);
%>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <title><fmt:message key="tatami.title"/></title>
    <meta name="viewport" content="initial-scale = 1,user-scalable=no,maximum-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Ippon Technologies">

    <sec:authorize ifNotGranted="ROLE_USER">
        <link href="/css/themes/bootstrap.css" rel="stylesheet">
    </sec:authorize>
    <sec:authorize ifAnyGranted="ROLE_USER">
        <link href="/css/themes/<sec:authentication property='principal.theme'/>.css" rel="stylesheet">
    </sec:authorize>
    <c:if test="${wro4jEnabled eq false}">
        <link href="/css/reset.css" rel="stylesheet">
        <link href="/css/bootstrap-responsive.css" rel="stylesheet">
        <link href="/css/tatami.css" rel="stylesheet">
    </c:if>
    <c:if test="${wro4jEnabled eq true}">
        <link href="/tatami/static-wro4j/${version}/all.css" rel="stylesheet">
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

    <c:if test="${googleAnalyticsKey ne ''}">
        <script type="text/javascript">
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', '${googleAnalyticsKey}']);
            _gaq.push(['_trackPageview']);
            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
        </script>
    </c:if>
        
    <sec:authorize ifAnyGranted="ROLE_USER">
        <c:if test="${not empty user.rssUid}">
            <link rel="alternate" type="application/rss+xml" title="RSS"
                  href="/tatami/syndic/${user.rssUid}" />
        </c:if>
    </sec:authorize>
                                      
</head>
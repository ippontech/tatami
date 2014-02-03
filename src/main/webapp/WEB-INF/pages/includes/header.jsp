<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="fr.ippon.tatami.config.Constants" %>
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
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><fmt:message key="tatami.title"/></title>
    <meta name="viewport" content="width=device-width, initial-scale = 1,user-scalable=no,maximum-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Ippon Technologies">

    <link href="/css/vendor/css/bootstrap.css" rel="stylesheet">
    <link href="/css/tatami.css" rel="stylesheet">
    <!--[if IE]>
        <link rel="stylesheet" type="text/css" href="/css/ie-only.css" />
    <![endif]-->
    <link href="/css/vendor/css/jQueryjGrowl.css" rel="stylesheet">



    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->

    <!--[if lt IE 7]>
    <link rel="stylesheet" href="http://blueimp.github.com/cdn/css/bootstrap-ie6.min.css">
    <![endif]-->
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="/js/vendor/respond.js"></script>
    <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->

    <link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
    <link rel="apple-touch-startup-image" href="/img/startup.png">
    <link rel="shortcut icon" type="image/png" href="/img/company-logo.ico">
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

    <script type="text/javascript">
        var username = "${user.username}";
        <c:if test="${ios == null}">
            var ios = false;
        </c:if>
        <c:if test="${ios != null}">
            var ios = ${ios};
        </c:if>
        var ie = (function(){
            var v = 3, div = document.createElement('div'), a = div.all || [];
            while (div.innerHTML = '<!--[if gt IE '+(++v)+']><br><![endif]-->', a[0]); 
            if (Function('/*@cc_on return document.documentMode===10@*/')()){
                v = 10;
            }
            return v > 4 ? v : !v;
        }());
    </script>

</head>
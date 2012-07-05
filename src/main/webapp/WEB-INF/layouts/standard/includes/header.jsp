<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String googleAnalyticsKey = fr.ippon.tatami.config.Constants.GOOGLE_ANALYTICS_KEY;
    request.setAttribute("googleAnalyticsKey", googleAnalyticsKey);
%>

<head>
    <meta charset="utf-8">
    <title><fmt:message key="tatami.title"/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Ippon Technologies">

    <!-- Le style -->
    <link href="/assets/css/bootstrap/2.0.4/bootstrap.css" rel="stylesheet">
    <link href="/assets/css/bootstrap/2.0.4/bootstrap-responsive.css" rel="stylesheet">
    <link href="/assets/css/tatami-custom.css" rel="stylesheet">
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    <link rel="shortcut icon" href="/assets/img/ippon.ico">

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
</head>
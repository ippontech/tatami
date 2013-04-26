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

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <title><fmt:message key="tatami.title"/></title>
    <meta name="viewport" content="width=device-width, initial-scale = 1,user-scalable=no,maximum-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Ippon Technologies">


    <c:if test="${wro4jEnabled eq false}">
        <link href="/css/vendor/css/bootstrap.css" rel="stylesheet">
        <link href="/css/new.css" rel="stylesheet">
    </c:if>
    <c:if test="${wro4jEnabled eq true}">
        <link href="/tatami/static-wro4j/${version}/vendor.css" rel="stylesheet">
    </c:if>
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!--[if lt IE 7]>
    <link rel="stylesheet" href="http://blueimp.github.com/cdn/css/bootstrap-ie6.min.css">
    <![endif]-->
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

    <script type="text/javascript">
        var username = "${user.username}";
        var ios = ${ios};
    </script>

    <c:if test="${wro4jEnabled eq false}">
        <script src="/js/vendor/jquery.js"></script>
        <script src="/js/vendor/bootstrap.js"></script>
        <script src="/js/vendor/underscore.js"></script>
        <script src="/js/vendor/backbone.js"></script>
        <script src="/js/vendor/marked.js"></script>
        <script src="/js/vendor/backbone.marionette.js"></script>
        <script src="/js/vendor/modernizr.js"></script>
        <script src="/js/vendor/jquery.ui.widget.js"></script>
        <script src="/js/vendor/jquery.iframe-transport.js"></script>
        <script src="/js/vendor/jquery.fileupload.js"></script>

        <script src="/js/app/app.js"></script>
        <script src="/js/app/plugins/tatami.search.js"></script>
        <script src="/js/app/plugins/suggester.js"></script>
        <script src="/js/app/models/users.js"></script>
        <script src="/js/app/collections/users.js"></script>
        <script src="/js/app/models/postStatus.js"></script>
        <script src="/js/app/models/statuses.js"></script>
        <script src="/js/app/collections/statuses.js"></script>
        <script src="/js/app/models/tags.js"></script>
        <script src="/js/app/collections/tags.js"></script>
        <script src="/js/app/models/groups.js"></script>
        <script src="/js/app/collections/groups.js"></script>
        <script src="/js/app/models/statusDetails.js"></script>
        <script src="/js/app/views/cardProfile.js"></script>
        <script src="/js/app/views/navbar.js"></script>
        <script src="/js/app/views/homeContainers.js"></script>
        <script src="/js/app/views/tagsContainers.js"></script>
        <script src="/js/app/views/profileContainers.js"></script>
        <script src="/js/app/views/groupsContainers.js"></script>
        <script src="/js/app/views/statuses.js"></script>
        <script src="/js/app/views/statusEdit.js"></script>
        <script src="/js/app/views/statusUpdateButton.js"></script>
        <script src="/js/app/views/userList.js"></script>
        <script src="/js/app/views/statusShares.js"></script>
        <script src="/js/app/views/tagTrends.js"></script>
        <script src="/js/app/views/groups.js"></script>
        <script src="/js/app/views/profileSide.js"></script>
        <script src="/js/app/factories/home.js"></script>
        <script src="/js/app/factories/profile.js"></script>
        <script src="/js/app/factories/status.js"></script>
        <script src="/js/app/factories/tags.js"></script>
        <script src="/js/app/factories/groups.js"></script>
        <script src="/js/app/router.js"></script>
    </c:if>
    <c:if test="${wro4jEnabled eq true}">
        <script src="/tatami/static-wro4j/${version}/vendor.js"></script>
    </c:if>

    <script type="text/template" id="stub">
    </script>

    <jsp:include page="includes/new.jsp"/>
</head>
<body>

<c:if test="${!ios}">
<div id="navbar" class="navbar">
    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-responsive-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="#timeline">
        <img src="/img/company-logo.png" alt="<fmt:message key="tatami.logo"/>">
        <fmt:message key="tatami.title"/>
    </a>
    <button type="button" class="editTatam navbar-toggle navbar-edit">
        <i class="close glyphicon glyphicon-pencil"></i>
    </button>
    <div class="nav-collapse navbar-responsive-collapse collapse">
        <ul class="nav">
            <li>
                <a href="#timeline">
                    <span>
                        <span class="glyphicon glyphicon-home"></span>
                        <span class="hidden-tablet">
                            <fmt:message key="tatami.home"/>
                        </span>
                    </span>
                </a>
            </li>
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown">
                    <span>
                        <span class="glyphicon glyphicon-info-sign"></span>
                        <span class="hidden-tablet">
                            <fmt:message key="tatami.menu.about"/>
                        </span>
                        <b class="caret"></b>
                    </span>
                </a>
                <ul class="dropdown-menu closed">
                    <li>
                        <a href="/tatami/presentation">
                            <span class="glyphicon glyphicon-eye-open"></span>
                            <fmt:message key="tatami.menu.presentation"/>
                        </a>
                    </li>
                    <li>
                        <a href="/tatami/tos">
                            <span class="glyphicon glyphicon-briefcase"></span>
                            <fmt:message key="tatami.menu.tos"/>
                        </a>
                    </li>
                    <li class="dropdown-submenu">
                        <a>
                            <span class="glyphicon glyphicon-flag"></span>
                            <fmt:message key="tatami.menu.language"/>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <a href="?language=en">
                                    <fmt:message key="tatami.menu.language.en"/>
                                </a>
                            </li>
                            <li>
                                <a href="?language=fr">
                                    <fmt:message key="tatami.menu.language.fr"/>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="/tatami/license">
                            <span class="glyphicon glyphicon-info-sign"></span>
                            <fmt:message key="tatami.menu.license"/>
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/ippontech/tatami/issues" target="_blank">
                            <span class="glyphicon glyphicon-inbox"></span>
                            <fmt:message key="tatami.github.issues"/>
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/ippontech/tatami" target="_blank">
                            <span class="glyphicon glyphicon-wrench"></span>
                            <fmt:message key="tatami.github.fork"/>
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="http://www.ippon.fr/" target="_blank">
                            <span class="glyphicon glyphicon-exclamation-sign"></span>
                            <fmt:message key="tatami.ippon.website"/>
                        </a>
                    </li>
                    <li>
                        <a href="http://blog.ippon.fr/" target="_blank">
                            <span class="glyphicon glyphicon-pencil"></span>
                            <fmt:message key="tatami.ippon.blog"/>
                        </a>
                    </li>
                    <li>
                        <a href="https://twitter.com/ippontech" target="_blank">
                            <span class="glyphicon glyphicon-bullhorn"></span>
                            <fmt:message key="tatami.ippon.twitter.follow"/>
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-question-sign"></span>
                            <fmt:message key="tatami.status.help.title"/>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
        <ul class="nav pull-right">
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown">
                <span>
                    <span class="glyphicon glyphicon-user"></span>
                    <span class="hidden-tablet">
                        <fmt:message key="tatami.menu.account"/>
                    </span>
                    <b class="caret"></b>
                </span>
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a href="/tatami/account/#/profile">
                            <span class="glyphicon glyphicon-user"></span>
                            <fmt:message key="tatami.menu.profile"/>
                        </a>
                    </li>
                    <li>
                        <a href="/tatami/account/#/preferences">
                            <span class="glyphicon glyphicon-picture"></span>
                            <fmt:message key="tatami.menu.preferences"/>
                        </a>
                    </li>
                    <li>
                        <a href="/tatami/account/#/password">
                            <span class="glyphicon glyphicon-lock"></span>
                            <fmt:message key="tatami.menu.password"/>
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="/tatami/account/#/files">
                            <span class="glyphicon glyphicon-file"></span>
                            <fmt:message key="tatami.menu.files"/>
                        </a>
                        <a href="/tatami/account/#/users">
                            <span class="glyphicon glyphicon-globe"></span>
                            <fmt:message key="tatami.menu.directory"/>
                        </a>
                        <a href="/tatami/account/#/groups">
                            <span class="glyphicon glyphicon-th-large"></span>
                            <fmt:message key="tatami.menu.groups"/>
                        </a>
                        <a href="/tatami/account/#/tags">
                            <span class="glyphicon glyphicon-tags"></span>
                            <fmt:message key="tatami.menu.tags"/>
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="/tatami/account/#/status_of_the_day">
                            <span class="glyphicon glyphicon-signal"></span>
                            <fmt:message key="tatami.menu.status.of.the.day"/>
                        </a>
                        <a href="/tatami/company">
                            <span class="glyphicon glyphicon-briefcase"></span>
                            <fmt:message key="tatami.menu.company.wall"/>
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="/tatami/logout">
                            <span class="glyphicon glyphicon-off"></span>
                            <fmt:message key="tatami.logout"/>
                        </a>
                    </li>
                </ul>
            </li>
            <li class="hidden-phone">
                <button class="editTatam btn navbar-form">
                    <i class="glyphicon glyphicon-pencil"></i>
                    <span class="visible-desktop">
                        <fmt:message key="tatami.tatam.publish"/>
                    </span>
                </button>
            </li>
        </ul>
        <form class="navbar-form pull-right col-span-5" action="">
            <input name="search" type="text" class="col-span-12" placeholder="<fmt:message key="tatami.search.placeholder"/>" autocomplete="off">
        </form>
    </div>
</div>
</c:if>

<div class="row">
    <div id="tatamiHeader" class="col-span-12">
    </div>
</div>

<div class="row">
    <aside id="tatamiSide" class="col-span-3">
    </aside>
    <section id="tatamiBody" class="col-span-9">
    </section>
</div>

<c:if test="${!ios}">
    <form id="tatamiEdit" class="modal fade">
    </form>
</c:if>

</body>
</html>
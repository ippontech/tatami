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

    <c:if test="${wro4jEnabled eq false}">
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
    </c:if>
    <c:if test="${wro4jEnabled eq true}">
        <script src="/tatami/static-wro4j/${version}/vendor.js"></script>
    </c:if>



    <script type="text/javascript">
        var username = '${user.username}';
    </script>

    <script type="text/template" id="stub">
    </script>
</head>
<body>
<div class="navbar">
    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-responsive-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="#">
        <img src="/img/company-logo.png" alt="Ippon Technologies Logo">
        Tatami
    </a>
    <button type="button" class="navbar-toggle navbar-edit" onclick="editModal()">
        <i class="close glyphicon glyphicon-pencil"></i>
    </button>
    <div class="nav-collapse navbar-responsive-collapse collapse">
        <ul class="nav">
            <li>
                <a href="#">
                    <span class="glyphicon glyphicon-home"></span>
            <span class="hidden-tablet">
              Accueil
            </span>
                </a>
            </li>
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                    <span class="glyphicon glyphicon-info-sign"></span>
            <span class="hidden-tablet">
              A Propos
            </span>
                    <b class="caret"></b>
                </a>
                <ul class="dropdown-menu closed">
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-eye-open"></span>
                            Présentation
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-briefcase"></span>
                            Conditions générales de vente
                        </a>
                    </li>
                    <li class="dropdown-submenu">
                        <a href="#">
                            <span class="glyphicon glyphicon-flag"></span>
                            Langue
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <a href="#">
                                    English
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    Français
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-info-sign"></span>
                            Licence du code source
                        </a>
                    </li>
                    <li>
                        <a href="#" target="_blank">
                            <span class="glyphicon glyphicon-inbox"></span>
                            Signaler un bug
                        </a>
                    </li>
                    <li>
                        <a href="#" target="_blank">
                            <span class="glyphicon glyphicon-wrench"></span>
                            Forker Tatami sur Github
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#" target="_blank">
                            <span class="glyphicon glyphicon-exclamation-sign"></span>
                            Site Web d'Ippon Technologies
                        </a>
                    </li>
                    <li>
                        <a href="#" target="_blank">
                            <span class="glyphicon glyphicon-pencil"></span>
                            Blog d'Ippon Technologies
                        </a>
                    </li>
                    <li>
                        <a href="#" target="_blank">
                            <span class="glyphicon glyphicon-bullhorn"></span>
                            Suivre @ippontech sur Twitter
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-question-sign"></span>
                            Aide
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
        <ul class="nav pull-right">
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown" href="#">
            <span>
              <span class="glyphicon glyphicon-user"></span>
              <span class="hidden-tablet">
                Compte
              </span>
              <b class="caret"></b>
            </span>
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-user"></span>
                            Profil
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-picture"></span>
                            Préférences
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-lock"></span>
                            Mot de passe
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-file"></span>
                            Fichiers
                        </a>
                        <a href="#">
                            <span class="glyphicon glyphicon-globe"></span>
                            Utilisateurs
                        </a>
                        <a href="#">
                            <span class="glyphicon glyphicon-th-large"></span>
                            Groupes
                        </a>
                        <a href="#">
                            <span class="glyphicon glyphicon-tags"></span>
                            Tags
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-signal"></span>
                            Statuts du jour
                        </a>
                        <a href="#">
                            <span class="glyphicon glyphicon-briefcase"></span>
                            Mur de l'entreprise
                        </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#">
                            <span class="glyphicon glyphicon-off"></span>
                            Déconnexion
                        </a>
                    </li>
                </ul>
            </li>
            <li class="hidden-phone">
                <button class="btn navbar-form" onclick="editModal()">
                    <i class="glyphicon glyphicon-pencil"></i>
            <span class="visible-desktop">
              Discuter
            </span>
                </button>
            </li>
        </ul>
        <form class="navbar-form pull-right" action="">
            <input name="search" type="text" class="col-span-12" placeholder="Search" autocomplete="off">
        </form>
    </div>
</div>
</body>
</html>

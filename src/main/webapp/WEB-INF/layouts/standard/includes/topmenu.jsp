<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div id="topmenu" class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <a class="brand" href="/tatami/"><img
                    src="${request.getContextPath}/assets/img/ippon-logo.png">&nbsp;<fmt:message
                    key="tatami.title"/></a>

            <div class="nav-collapse">
                <ul class="nav">
                    <li class="active"><a href="/tatami/"><i class="icon-home icon-white"></i>&nbsp;<fmt:message
                            key="tatami.home"/></a></li>
                    <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<fmt:message
                            key="tatami.about"/></a></li>
                </ul>
                <sec:authorize access="isAuthenticated()" >
                    <ul class="nav pull-right">
                        <li id="dropdownMenu" class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" data-target="#" href="#dropdownMenu">
                                <i class="icon-user icon-white"></i>&nbsp;Compte
                                <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a href="/tatami/account"><i class="icon-user"></i>&nbsp;<fmt:message
                                        key="tatami.menu.profile"/></a></li>
                                <li><a href="/tatami/account/password"><i class="icon-lock"></i>&nbsp;<fmt:message
                                        key="tatami.menu.password"/></a></li>
                                <li class="divider"></li>
                                <li><a href="/tatami/account/enterprise"><i class="icon-globe"></i>&nbsp;<fmt:message
                                        key="tatami.menu.enterprise"/></a></li>
                                <li class="divider"></li>
                                <li><a href="/tatami/logout"><i class="icon-off"></i>&nbsp;<fmt:message
                                        key="tatami.logout"/></a></li>
                            </ul>
                        </li>
                    </ul>
                    <ul class="nav pull-right">
                        <form id="global-status-search" class="well form-search" action="/tatami/rest/search"
                              method="post">
                            <input type="hidden" name="page" value="0"/>
                            <input type="hidden" name="rpp" value="20"/>
                            <input type="text" id="searchQuery" name="q" class="input-medium search-query"
                                   placeholder="<fmt:message key="tatami.search.placeholder"/>">
                            <button type="submit" class="btn"><fmt:message
                                    key="tatami.search.button"/></button>
                        </form>
                    </ul>
                </sec:authorize>
            </div>
        </div>
    </div>
</div>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <a class="brand" href="/tatami/">
                <img src="/assets/img/ippon-logo.png" alt="Ippon Technologies Logo">
                <fmt:message key="tatami.title"/>
            </a>
            <div class="nav-collapse">
                <ul class="nav">
                    <li>
                        <a href="/tatami/">
                            <i class="icon-home icon-white"></i> <fmt:message
                                key="tatami.home"/>
                        </a>
                    </li>
                    <li>
                        <a href="/tatami/about">
                            <i class="icon-info-sign icon-white"></i> <fmt:message
                                key="tatami.about"/>
                        </a>
                    </li>
                </ul>
                <sec:authorize access="isAuthenticated()" >
                    <ul class="nav pull-right">
                        <li class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                <i class="icon-user icon-white"></i> Account
                                <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a href="/tatami/account">
                                        <i class="icon-user"></i> <fmt:message
                                            key="tatami.menu.profile"/>
                                    </a>
                                </li>
                                <li>
                                    <a href="/tatami/account/password">
                                        <i class="icon-lock"></i> <fmt:message
                                            key="tatami.menu.password"/>
                                    </a>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a href="/tatami/account/enterprise">
                                        <i class="icon-globe"></i> <fmt:message
                                            key="tatami.menu.enterprise"/></a>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a href="/tatami/logout">
                                        <i class="icon-off"></i> <fmt:message
                                            key="tatami.logout"/>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <form class="navbar-search pull-right" id="searchHeader">
                        <input class="search-query span2" placeholder="Search" name="search" type="text">
                    </form>
                </sec:authorize>
            </div>
        </div>
    </div>
</div>
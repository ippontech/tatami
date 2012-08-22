<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <a class="brand" href="/tatami/">
                <img src="/img/ippon-logo.png" alt="Ippon Technologies Logo" width="22px" height="23px">
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
                    <li class="dropdown">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                            <i class="icon-info-sign icon-white"></i> <fmt:message key="tatami.menu.about"/>
                            <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <a href="/tatami/presentation">
                                    <i class="icon-eye-open"></i> <fmt:message
                                        key="tatami.menu.presentation"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/tos">
                                    <i class="icon-briefcase"></i> <fmt:message
                                        key="tatami.menu.tos"/>
                                </a>
                            </li>
                            <li>
                                <a href="/tatami/license">
                                    <i class="icon-info-sign"></i> <fmt:message
                                        key="tatami.menu.license"/>
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/ippontech/tatami" target="_blank">
                                    <i class="icon-wrench"></i> <fmt:message key="tatami.github.fork"/>
                                </a>
                            </li>
                            <li>
                                <a href="http://blog.ippon.fr" target="_blank">
                                    <i class="icon-pencil"></i> <fmt:message key="tatami.ippon.blog"/>
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com/ippontech" target="_blank">
                                    <i class="icon-bullhorn"></i> <fmt:message key="tatami.ippon.twitter.follow"/>
                                </a>
                            </li>
                            <li>
                                <a href="http://www.ippon.fr" target="_blank">
                                    <i class="icon-exclamation-sign"></i> <fmt:message key="tatami.copyright"/> <fmt:message key="tatami.ippon.technologies"/>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <sec:authorize access="isAuthenticated()">
                    <ul class="nav pull-right">
                        <li class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                                <i class="icon-user icon-white"></i> <fmt:message
                                    key="tatami.menu.account"/>
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
                                <sec:authorize access="hasRole('ROLE_ADMIN')">
                                    <li class="divider"></li>
                                    <li>
                                        <a href="/tatami/admin">
                                            <i class="icon-wrench"></i> Administration</a>
                                    </li>
                                </sec:authorize>
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
                        <input class="search-query span2" placeholder="<fmt:message key="tatami.menu.search"/>" name="search" type="text">
                    </form>
                </sec:authorize>
            </div>
        </div>
    </div>
</div>
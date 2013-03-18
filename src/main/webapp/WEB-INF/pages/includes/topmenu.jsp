<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<div id='tatami-topmenu' class="navbar navbar-inverse navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <a class="brand" href="/tatami/">
                <img src="/img/company-logo.png" alt="<fmt:message key="tatami.logo"/>" width="22px" height="23px">
                <fmt:message key="tatami.title"/>
            </a>

            <div class="nav-collapse collapse">
                <ul class="nav pull-left">
                    <li>
                        <a href="/tatami/">
                            <i class="icon-home icon-white"></i>
                            <fmt:message key="tatami.home"/>
                        </a>
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
                            <ul class="dropdown-menu closed">
                                <li>
                                    <a href="/tatami/account/#/profile">
                                        <i class="icon-user"></i> <fmt:message
                                            key="tatami.menu.profile"/>
                                    </a>
                                </li>
                                <li>
                                    <a href="/tatami/account/#/preferences">
                                        <i class="icon-picture"></i> <fmt:message
                                            key="tatami.menu.preferences"/></a>
                                </li>
                                <li>
                                    <a href="/tatami/account/#/password">
                                        <i class="icon-lock"></i> <fmt:message
                                            key="tatami.menu.password"/>
                                    </a>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a href="/tatami/account/#/files">
                                        <i class="icon-file"></i> <fmt:message
                                            key="tatami.menu.files"/></a>
                                </li>
                                <li>
                                    <a href="/tatami/account/#/users">
                                        <i class="icon-globe"></i> <fmt:message
                                            key="tatami.menu.directory"/></a>
                                </li>
                                <li>
                                    <a href="/tatami/account/#/groups">
                                        <i class="icon-th-large"></i> <fmt:message
                                            key="tatami.menu.groups"/></a>
                                </li>
                                <li>
                                    <a href="/tatami/account/#/tags">
                                        <i class="icon-tags"></i> <fmt:message
                                            key="tatami.menu.tags"/></a>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a href="/tatami/account/#/status_of_the_day">
                                        <i class="icon-signal"></i> <fmt:message
                                            key="tatami.menu.status.of.the.day"/></a>
                                </li>
                                <li>
                                    <a href="/tatami/company">
                                        <i class="icon-briefcase"></i> <fmt:message
                                            key="tatami.menu.company.wall"/></a>
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
                    <ul class="nav pull-right" style="display: none" id="help-menu">
                        <li>
                            <a href="#" id="help-tour">
                                <i class="icon-question-sign icon-white" ></i> <fmt:message
                                    key="tatami.help"/>
                            </a>
                        </li>
                    </ul>

                </sec:authorize>
                <ul class="nav pull-left">
                    <li class="dropdown">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                            <i class="icon-info-sign icon-white"></i> <fmt:message key="tatami.menu.about"/>
                            <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu closed">
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
                            <li class="dropdown-submenu">
                                <a tabindex="-1" href="#">
                                    <i class="icon-flag"></i>
                                    <fmt:message key="tatami.menu.language"/></a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a tabindex="-1" href="<%=request.getContextPath()%>?language=en">
                                            <fmt:message key="tatami.menu.language.en"/>
                                        </a>
                                    </li>
                                    <li>
                                        <a tabindex="-1" href="<%=request.getContextPath()%>?language=fr">
                                            <fmt:message key="tatami.menu.language.fr"/>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li class="divider"></li>
                            <li>
                                <a href="/tatami/license">
                                    <i class="icon-info-sign"></i> <fmt:message
                                        key="tatami.menu.license"/>
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/ippontech/tatami/issues" target="_blank">
                                    <i class="icon-inbox"></i> <fmt:message key="tatami.github.issues"/>
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/ippontech/tatami" target="_blank">
                                    <i class="icon-wrench"></i> <fmt:message key="tatami.github.fork"/>
                                </a>
                            </li>
                            <li class="divider"></li>
                            <li>
                                <a href="http://www.ippon.fr" target="_blank">
                                    <i class="icon-exclamation-sign"></i> <fmt:message
                                        key="tatami.ippon.website"/>
                                </a>
                            </li>
                            <li>
                                <a href="http://blog.ippon.fr" target="_blank">
                                    <i class="icon-pencil"></i> <fmt:message key="tatami.ippon.blog"/>
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com/ippontech" target="_blank">
                                    <i class="icon-bullhorn"></i> <fmt:message
                                        key="tatami.ippon.twitter.follow"/>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <sec:authorize access="isAuthenticated()">
                    <form class="navbar-search pull-right" id="searchHeader">
                        <input id="fullSearchText" class="search-query input-block-level" autocomplete="off" placeholder="<fmt:message key="tatami.menu.search"/>"
                               name="search" type="text">
                    </form>
                </sec:authorize>
            </div>
        </div>
    </div>
</div>

<jsp:include page="template-search-engine.jsp"/>

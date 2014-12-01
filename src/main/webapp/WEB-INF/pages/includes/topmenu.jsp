<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${ios == null || !ios}">
    <div id="navbar" class="navbar noRadius">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-responsive-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="/tatami/home">
            <img src="/img/company-logo.png" alt="<fmt:message key="tatami.logo"/>">
            <fmt:message key="tatami.title"/>
        </a>
    <c:if test="${currentPage != null && currentPage == 'home'}">
        <button type="button" class="editTatam btn btn-primary navbar-toggle navbar-edit">
            <i class="close glyphicon glyphicon-pencil"></i>
        </button>
    </c:if>
        <div class="nav-collapse navbar-responsive-collapse collapse">
            <ul class="nav">
                <li>
                    <c:if test="${currentPage != null && currentPage == 'home'}">
                      <a href="#/home/timeline">
                    </c:if>
                    <c:if test="${currentPage == null || currentPage != 'home'}">
                      <a href="/tatami/home/timeline">
                    </c:if>
                    <span>
                        <span class="glyphicon glyphicon-th-list"></span>
                        <span class="hidden-tablet">
                            <fmt:message key="tatami.timeline"/>
                        </span>
                    </span>
                    </a>
                </li>
                <li class="dropdown pointer">
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
                    </ul>
                </li>
            </ul>

            <c:if test="${currentPage != null && currentPage == 'home'}">
            <sec:authorize ifAnyGranted="ROLE_USER">
            <ul class="nav pull-right">
                <li class="dropdown pointer">
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
                            <a href="/tatami/home#company">
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
                    <button id="editTatam" class="editTatam btn btn-primary navbar-form">
                        <i class="glyphicon glyphicon-pencil"></i>
                        <span class="visible-desktop">
                            <fmt:message key="tatami.tatam.publish"/>
                        </span>
                    </button>
                </li>
            </ul>
            <ul class="nav pull-right">
                <li>
                    <a href="#" id="help-tour">
                        <span>
                            <span class="glyphicon glyphicon-question-sign"></span>
                            <span class="hidden-tablet">
                                <fmt:message key="tatami.status.help.title"/>
                            </span>
                        </span>
                    </a>
                </li>
            </ul>
            <form id="searchform" class="navbar-form pull-right col-span-4" action="">
                <input name="search" type="text" class="col-span-12" id="searchinput" placeholder="<fmt:message key="tatami.search.placeholder"/>" autocomplete="off">
                <span class="deleteicon"><i class="glyphicon glyphicon-remove-sign"></i></span>
            </form>
            </sec:authorize>
            </c:if>
        </div>
    </div>
</c:if>
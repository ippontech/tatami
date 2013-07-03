<%--
  Created by IntelliJ IDEA.
  User: Gregoire
  Date: 26/06/13
  Time: 15:08
  To change this template use File | Settings | File Templates.
--%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


    <div class="col-span-4">
        <div class="tabbable alert alert-status">
            <ul class="adminMenu nav nav-pills nav-stacked nomargin">
                <li class="active">
                    <a href="/tatami/account/#/profile">
                        <i class="glyphicon glyphicon-user"></i> <fmt:message key="tatami.menu.profile"/>
                    </a>
                </li>
                <li>
                    <a href="/tatami/account/#/preferences">
                        <i class="glyphicon glyphicon-picture"></i> <fmt:message key="tatami.menu.preferences"/>
                    </a>
                </li>
                <li>
                    <a href="/tatami/account/#/password">
                        <i class="glyphicon glyphicon-lock"></i> <fmt:message key="tatami.menu.password"/>
                    </a>
                </li>
                <li>
                    <a href="/tatami/account/#/files">
                        <i class="glyphicon glyphicon-file"></i> <fmt:message key="tatami.menu.files"/>
                    </a>
                </li>
                <li>
                    <a href="/tatami/account/#/users">
                        <i class="glyphicon glyphicon-globe"></i> <fmt:message key="tatami.menu.directory"/>
                    </a>
                </li>
                <li>
                    <a href="/tatami/account/#/groups">
                        <i class="glyphicon glyphicon-th-large"></i> <fmt:message key="tatami.menu.groups"/>
                    </a>
                </li>
                <li>
                    <a href="/tatami/account/#/tags">
                        <i class="glyphicon glyphicon-tags"></i> <fmt:message key="tatami.menu.tags"/>
                    </a>
                </li>
                <li>
                    <a href="/tatami/account/#/status_of_the_day">
                        <i class="glyphicon glyphicon-signal"></i> <fmt:message key="tatami.menu.status.of.the.day"/>
                    </a>
                </li>
            </ul>
        </div>
    </div>


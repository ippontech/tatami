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
                <sec:authorize access="hasRole('ROLE_USER')" >
                    <ul class="nav pull-right">
                        <li class="divider-vertical"></li>
                        <li><a href="/tatami/logout"><i class="icon-user icon-white"></i>&nbsp;<fmt:message
                                key="tatami.logout"/></a></li>
                    </ul>
                    <ul class="nav pull-right">
                        <form id="global-tweet-search" class="well form-search" action="/tatami/rest/search"
                              method="post">
                            <input type="hidden" name="page" value="0"/>
                            <input type="hidden" name="rpp" value="20"/>
                            <input type="text" id="searchQuery" name="q" class="input-medium search-query"
                                   placeholder="<fmt:message key="tatami.search.placeholder"/>">
                            <button type="submit" class="btn" style="margin-top:0px;"><fmt:message
                                    key="tatami.search.button"/></button>
                        </form>
                    </ul>
                </sec:authorize>
            </div>
        </div>
    </div>
</div>
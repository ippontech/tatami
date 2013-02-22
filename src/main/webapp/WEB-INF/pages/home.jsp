<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

    <jsp:include page="includes/topmenu.jsp"/>

    <div id="mainPanel" class="container">
        <div class="row">

            <div class="span4">

                <!-- Infos -->
                <div id="profileContent" class="alert alert-status">
                </div>

                <!-- Groups -->
                <div id="groupsList" class="alert alert-status">
                    <div>
                        <i class="icon-th"></i> <strong><fmt:message key="tatami.menu.groups"/></strong>
                        <div class="row-fluid" id="userGroups">

                        </div>
                    </div>
                </div>

                <div id="profileFollow" class="alert alert-status hidden-phone">
                </div>

                <div id="profileTrends" class="alert alert-status hidden-phone">
                    <div>
                        <i class="icon-fire"></i> <strong><fmt:message key="tatami.trends.title"/></strong>
                    </div>
                    <div class="row-fluid">
                        <div id="trends">

                        </div>
                    </div>
                </div>
            </div>

            <div class="span8">
                <div class="tabbable">
                    <ul class="nav nav-pills homeMenu">
                        <li class="active">
                            <a href="#/timeline">
                                <i class="icon-th-list"></i> <span class="hidden-phone"><fmt:message key="tatami.timeline"/></span>
                            </a>
                        </li>
                        <li>
                            <a href="#/mention">
                                <i class="icon-user"></i> <span class="hidden-phone"><fmt:message key="tatami.mentions"/></span>
                            </a>
                        </li>
                        <li>
                            <a href="#/tags">
                                <i class="icon-tags"></i> <span class="hidden-phone"><fmt:message key="tatami.tags"/></span>
                            </a>
                        </li>
                        <li>
                            <a href="#/favorite">
                                <i class="icon-star"></i> <span class="hidden-phone"><fmt:message key="tatami.user.favoritestatus"/></span>
                            </a>
                        </li>
                    </ul>
                    <div id="tab-content">
                    </div>  
                </div>
            </div>
        </div>
    </div>

    <jsp:include page="includes/templates-home.jsp"/>
    <jsp:include page="includes/footer.jsp"/>
<!-- Help tour -->
    <jsp:include page="includes/help-home.jsp"/>

    <script type="text/javascript">
        var isNew = ${user.isNew};
        var login = "<sec:authentication property="principal.username"/>";
        var username = "${user.username}";
        var authenticatedUsername = "${authenticatedUsername}";
        var tag = "${tag}";
        var searchQuery = "${search}";
        var page = "home";

        var text_characters_left="<fmt:message key="tatami.status.characters.left"/>";

        if(tag !== '')
            $('a[href="#tags"]').tab('show');
        else if(searchQuery !== '')
            $('a[href="#search"]').tab('show');

    </script>

    <c:if test="${wro4jEnabled eq false}">
        <script src="/js/tatami-home.js"></script>
    </c:if>
    <c:if test="${wro4jEnabled eq true}">
        <script src="/tatami/static/${version}/tatami-home.js"></script>
    </c:if>

</body>
</html>

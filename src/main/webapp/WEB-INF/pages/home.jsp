<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

    <jsp:include page="includes/topmenu.jsp"/>

    <div id="mainPanel" class="container">
        <div class="row">

            <div class="span3">

                <!-- Infos -->
                <div id="profileContent" class="alert alert-status">
                </div>

                <!-- Groups -->
                <div id="groupsList" class="alert alert-status">
                    <div>
                        <label><i class="icon-th"></i> <fmt:message key="tatami.menu.groups"/></label>
                        <div class="row-fluid" id="userGroups">

                        </div>
                    </div>
                </div>
            </div>

            <div class="span6">
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

            <div class="span3">
                <div id="profileFind" class="alert alert-status">
                </div>

                <div id="profileOnlineUsers" class="alert alert-status">
                </div>

                <div id="profileFollow" class="alert alert-status">
                </div>

                <div id="profileTrends" class="alert alert-status">
                    <div>
                        <label><i class="icon-fire"></i> <fmt:message key="tatami.trends.title"/></label>
                    </div>
                    <div class="row-fluid">
                        <div class="well">
                            <table class="table table-center" id="trends">

                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <jsp:include page="includes/templates-home.jsp"/>
    <jsp:include page="includes/templates-commons.jsp"/>
    <jsp:include page="includes/footer.jsp"/>

    <script type="text/javascript">
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

    <script src="/js/tatami-commons.js"></script>
    <script src="/js/tatami-home.js"></script>

</body>
</html>

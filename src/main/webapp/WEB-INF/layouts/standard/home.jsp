<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

    <jsp:include page="includes/topmenu.jsp"/>

    <div class="container mainPanel">
        <div class="row">

            <div class="span4">

                <!-- Infos -->
                <div id="profileContent" class="alert alert-info">
                </div>

                <!-- Follow -->
                <div id="profileFollow" class="alert alert-info hidden-phone">

                    

                </div>
            </div>

            <div class="span8">
                <div class="tabbable">
                    <ul class="nav nav-tabs homeMenu">
                        <li class="active">
                            <a href="#/timeline">
                                <i class="icon-th-list"></i> <fmt:message key="tatami.status"/>
                            </a>
                        </li>
                        <li>
                            <a href="#/favoris">
                                <i class="icon-star"></i> <fmt:message key="tatami.user.favoritestatus"/>
                            </a>
                        </li>
                        <li>
                            <a href="#/tags">
                                <i class="icon-tag"></i> <fmt:message key="tatami.tags"/>
                            </a>
                        </li>
                        <li>
                            <a href="#/search">
                                <i class="icon-search"></i> <fmt:message key="tatami.search"/>
                            </a>
                        </li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <i class="icon-signal"></i> <fmt:message key="tatami.status.stats"/> <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a href="#/daily">
                                        <fmt:message key="tatami.stats.status.piechart"/>
                                    </a>
                                </li>
                                <li>
                                    <a href="#/weekly">
                                        <fmt:message key="tatami.stats.status.punchchart"/>
                                    </a>
                                </li>
                            </ul>
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

    <script type="text/javascript" src="https://www.google.com/jsapi"></script>

    <script type="text/javascript">

        google.load("visualization", "1", {packages:["corechart"]});
        var login = "<sec:authentication property="principal.username"/>";
        var username = "${user.username}";
        var tag = "${tag}";
        var searchQuery = "${search}";
        var page = "home";


        if(tag !== '')
            $('a[href="#tags"]').tab('show');
        else if(searchQuery !== '')
            $('a[href="#search"]').tab('show');

    </script>
    
    <script src="/assets/js/tatami-home.js"></script>

</body>
</html>

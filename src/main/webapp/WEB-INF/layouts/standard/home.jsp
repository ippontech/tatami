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
                    <ul class="nav nav-tabs hidden-phone">
                        <li class="active">
                            <a href="#timeline" data-toggle="tab">
                                <i class="icon-th-list"></i> <fmt:message key="tatami.status"/>
                            </a>
                        </li>
                        <li>
                            <a href="#favoris" data-toggle="tab">
                                <i class="icon-star"></i> <fmt:message key="tatami.user.favoritestatus"/>
                            </a>
                        </li>
                        <li>
                            <a href="#tags" data-toggle="tab">
                                <i class="icon-tag"></i> <fmt:message key="tatami.tags"/>
                            </a>
                        </li>
                        <li>
                            <a href="#search" data-toggle="tab">
                                <i class="icon-search"></i> <fmt:message key="tatami.search"/>
                            </a>
                        </li>
                        <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <i class="icon-signal"></i> <fmt:message key="tatami.status.stats"/> <b class="caret"></b>
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a href="#daily" data-toggle="tab"><fmt:message key="tatami.stats.status.piechart"/></a>
                                </li>
                                <li>
                                    <a href="#weekly" data-toggle="tab"><fmt:message key="tatami.stats.status.punchchart"/></a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div id="timeline" class="tab-pane active">
                        </div>
                        <div id="favoris" class="tab-pane">
                            <img src="http://pilouite.p.i.pic.centerblog.net/kbwglrnk.jpg" alt="Canard">
                        </div>
                        <div id="tags" class="tab-pane">
                            <img src="http://ocean7.oiseaux.net/images/canard.colvert.phco.2g.jpg" alt="Canard">
                        </div>
                        <div id="search" class="tab-pane">
                            <img src="http://sebastienpokemon.s.e.pic.centerblog.net/g1f5xk7o.jpg" alt="Canard">
                        </div>
                        <div id="daily" class="tab-pane">
                            <img src="http://img25.imageshack.us/img25/4873/canardcarolinaixsponsa.jpg" alt="Canard">
                        </div>
                        <div id="weekly" class="tab-pane">
                            <img src="http://arpit.oiseaux.net/images/canard.siffleur.arde.3g.jpg" alt="Canard">
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <jsp:include page="includes/templates-home.jsp"/>
    <jsp:include page="includes/footer.jsp"/>

    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script src="/assets/js/tatami.js"></script>

    <script type="text/javascript">

        google.load("visualization", "1", {packages:["corechart"]});
        var login = "<sec:authentication property="principal.username"/>";
        var username = "${user.username}";
        var tag = "${tag}";
        var searchQuery = "${search}";
        var page = "home";

    </script>

</body>
</html>

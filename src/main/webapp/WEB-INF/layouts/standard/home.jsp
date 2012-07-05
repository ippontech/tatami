<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div class="container-fluid mainPanel">
    <div id="menuContent" class="span4">
        <div class="alert alert-info">
                <div class="row-fluid">
                    <div class="span4"><img id="picture"/></div>
                    <div class="span8">
                        <span id="profile_view"></span>
                    </div>
                </div>
                <div class="row-fluid well well-small">
                    <div class="span4">
                        <span id="statusCount" class="badge"></span><br/><fmt:message
                            key="tatami.badge.status"/>
                    </div>
                    <div class="span4">
                        <span id="friendsCount" class="badge"></span><br/><fmt:message
                            key="tatami.badge.followed"/>
                    </div>
                    <div class="span4">
                        <span id="followersCount" class="badge"></span><br/><fmt:message
                            key="tatami.badge.followers"/>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12">
                        <form class="form-inline" onsubmit="return status();">
                            <textarea id="statusContent" rel="popover" class="focused" maxlength="500"
                                      placeholder="<fmt:message key="tatami.status.update"/>..."></textarea>
                            <br/><br/>
                            <button type="submit" class="btn btn-primary"><fmt:message
                                    key="tatami.status.update"/></button>
                        </form>
                        <div class="error"></div>
                    </div>
                </div>
        </div>
        <div>
            <div class="alert alert-info" id="followUserContent"></div>
        </div>
    </div>

    <div id="mainContent" class="span8">
        <div class="tabbable">
            <ul class="nav nav-tabs">
                <li class="active"><a id="mainTab" href="#timeLinePanel" data-toggle="tab"><i
                        class="icon-th-list"></i>&nbsp;<fmt:message key="tatami.status"/></a></li>
                <li><a id="favTab" href="#favLinePanel" data-toggle="tab"><i
                        class="icon-star"></i>&nbsp;<fmt:message key="tatami.user.favoritestatus"/></a></li>
                <li><a id="tagTab" href="#tagLinePanel" data-toggle="tab"><i
                        class="icon-tag"></i>&nbsp;<fmt:message key="tatami.tags"/></a></li>
                <li><a id="searchTab" href="#searchLinePanel" data-toggle="tab"><i
                        class="icon-search"></i>&nbsp;<fmt:message key="tatami.search"/></a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i
                            class="icon-signal"></i>&nbsp;<fmt:message key="tatami.status.stats"/>&nbsp;<b
                            class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li><a id="piechartTab" href="#piechartPanel" data-toggle="tab"><fmt:message
                                key="tatami.stats.status.piechart"/></a></li>
                        <li><a id="punchchartTab" href="#punchchartPanel" data-toggle="tab"><fmt:message
                                key="tatami.stats.status.punchchart"/></a></li>
                    </ul>
                </li>
            </ul>
            <div class="tab-content alert alert-success">
                <div class="tab-pane active" id="timeLinePanel">
                    <section id="timeline">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th>
                                    <a href="#" id="refreshStatus" title="Refresh - shortcut : ctrl+R"><i
                                            class="icon-repeat icon-white"></i></a>
                                </th>
                            </tr>
                            </thead>
                            <tbody id="statusList" class="statusList"></tbody>
                        </table>
                    </section>
                </div>
                <div class="tab-pane" id="favLinePanel"></div>
                <div class="tab-pane" id="tagLinePanel"></div>
                <div class="tab-pane" id="searchLinePanel"></div>
                <div class="tab-pane" id="piechartPanel"></div>
                <div class="tab-pane" id="punchchartPanel"></div>
            </div>
        </div>
    </div>
</div>

<jsp:include page="includes/footer.jsp"/>

<script type="text/javascript" src="https://www.google.com/jsapi"></script>

<script src="/assets/js/tatami/standard/tatami.charts.js"></script>
<script type="text/javascript">
    google.load("visualization", "1", {packages:["corechart"]});
    var login = "<sec:authentication property="principal.username"/>";
    var username = "${user.username}";
    var tag = "${tag}";
    var searchQuery = "${search}";
    var page = "home";

    //Mustache.js templates
    $('#mustache').load('/assets/templates_mustache/templates.html');

    $(document).ready(function () {
        initHome();
    });
</script>
</body>
</html>

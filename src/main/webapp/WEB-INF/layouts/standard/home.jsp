<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <a class="brand" href="#"><img
                    src="${request.getContextPath}/assets/img/ippon-logo.png">&nbsp;<spring:message
                    code="tatami.title"/></a>

            <div class="nav-collapse">
                <ul class="nav">
                    <li class="active"><a href="#"><i class="icon-home icon-white"></i>&nbsp;<spring:message
                            code="tatami.home"/></a></li>
                    <li><a href="/tatami/about"><i class="icon-info-sign icon-white"></i>&nbsp;<spring:message
                            code="tatami.about"/></a></li>
                    <!-- <li><a href="?language=en"> English</a>|<a href="?language=fr"> Francais</a></li> -->
                </ul>
                <ul class="nav pull-right">
                    <li class="divider-vertical"></li>
                    <li><a href="/tatami/logout"><i class="icon-user icon-white"></i>&nbsp;<spring:message
                            code="tatami.logout"/></a></li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>
</div>

<div id="home" class="container-fluid">
    <div class="row-fluid">
        <div class="span4">
            <div class="tabbable">
                <ul class="nav nav-tabs">
                    <li class="active"><a id="profileTab" href="#profileTabContent" data-toggle="pill">
                        &nbsp;<spring:message code="tatami.show.profile"/></a></li>
                    <li><a id="updateProfileTab" href="#updateProfileTabContent" data-toggle="pill"><i class="icon-edit"></i>&nbsp;<spring:message
                            code="tatami.update.profile"/></a></li>
                </ul>
                <div class="tab-content alert alert-info profileview">
                    <div class="tab-pane active" id="profileTabContent"></div>
                    <div class="tab-pane" id="updateProfileTabContent"></div>
                </div>
            </div>
            <div>
                <div class="alert alert-info" id="followUserContent"></div>
            </div>
        </div>

        <div class="span8">
            <div class="tabbable">
                <ul class="nav nav-tabs">
                    <li class="active"><a id="mainTab" href="#timeLinePanel" data-toggle="tab"><i
                            class="icon-th-list"></i>&nbsp;<spring:message code="tatami.tweets"/></a></li>
                    <li><a id="favTab" href="#favLinePanel" data-toggle="tab"><i
                            class="icon-heart"></i>&nbsp;<spring:message code="tatami.user.favoritetweets"/></a></li>
                    <li><a id="userTab" href="#userLinePanel" data-toggle="tab"><i
                            class="icon-user"></i>&nbsp;<spring:message code="tatami.user.otheruser.tweets"/></a></li>
                    <li><a id="tagTab" href="#tagLinePanel" data-toggle="tab"><i
                            class="icon-tag"></i>&nbsp;<spring:message code="tatami.tags"/></a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i
                                class="icon-signal"></i>&nbsp;<spring:message code="tatami.tweets.stats"/>&nbsp;<b
                                class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a id="piechartTab" href="#piechartPanel" data-toggle="tab"><spring:message
                                    code="tatami.stats.tweets.piechart"/></a></li>
                            <li><a id="punchchartTab" href="#punchchartPanel" data-toggle="tab"><spring:message
                                    code="tatami.stats.tweets.punchchart"/></a></li>
                        </ul>
                    </li>
                </ul>
                <div class="tab-content alert alert-success">
                    <div class="tab-pane active" id="timeLinePanel"></div>
                    <div class="tab-pane" id="favLinePanel"></div>
                    <div class="tab-pane" id="userLinePanel"></div>
                    <div class="tab-pane" id="tagLinePanel"></div>
                    <div class="tab-pane" id="piechartPanel"></div>
                    <div class="tab-pane" id="punchchartPanel"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<jsp:include page="includes/footer.jsp"/>

<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script src="/assets/js/tatami/tatami.charts.js"></script>
<script type="text/javascript">
    google.load("visualization", "1", {packages:["corechart"]});
    var login = "<sec:authentication property="principal.username"/>";
    resetNbTweetsToDefaultNumber();

    $(document).ready(function() {
        initTatami();
    });
</script>
</body>
</html>

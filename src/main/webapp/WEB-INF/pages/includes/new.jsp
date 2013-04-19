<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="HomeHeader">
    <div class="text-center page-header">
        <h1 class="title">
            <img class="img-rounded pull-left" src="http://www.gravatar.com/avatar/77a3ff9479d623eaff6cba1f81231939?s=70">
          <span>
              <@= fullName @>
          </span>
            <br>
            <small>
                @<@= username @>
            </small>
        </h1>
    </div>
</script>
<script type="text/template" id="CardProfile">
    <div class="page-header">
        <h4 class="profile-card">
            <img class="img-rounded pull-left" src="http://www.gravatar.com/avatar/77a3ff9479d623eaff6cba1f81231939?s=40">
            <span>
                <@= fullName @>
            </span>
            <br>
            <small>
                @<@= username @>
            </small>
        </h4>
    </div>
</script>
<script type="text/template" id="TagTrends">
    <div class="page-header">
        <h4>
            <span class="glyphicon glyphicon-fire"></span>
            <fmt:message key="tatami.trends.user.title"/>
        </h4>
    </div>
    <div class="items">
    </div>
</script>
<script type="text/template" id="TagTrendItems">
    <span class="glyphicon glyphicon-arrow-<@= (trendingUp)? 'up': 'down' @>"></span>
    <a href="#">#<@= name @></a>
</script>
<script type="text/template" id="StatusItems">
    <img class="img-rounded pull-left" src="http://www.gravatar.com/avatar/77a3ff9479d623eaff6cba1f81231939?s=50">
    <header class="page-header">
        <h4>
            <@= fullName @>
            <small>
                @<@= username @>
            </small>
            <abbr class="pull-right" title="<@= prettyPrintStatusDate @>"><@= prettyPrintStatusDate @></abbr>
        </h4>
    </header>
    <div class="well well-small markdown">
        <@= marked(content) @>
    </div>
    <footer>
        <div class="tatams-share">
        </div>
        <aside class="text-right">
            <a class="status-action-reply">
                <span class="glyphicon glyphicon-comment"></span>
                <fmt:message key="tatami.user.status.reply"/>
            </a>
            <a class="status-action-share">
                <span class="glyphicon glyphicon-retweet"></span>
                <fmt:message key="tatami.user.status.share"/>
            </a>
            <a class="status-action-favorite">
                <span class="glyphicon glyphicon-pushpin"></span>
                <fmt:message key="tatami.user.status.favorite"/>
            </a>
        </aside>
        <div class="tatams-discute">
        </div>
    </footer>
</script>
<script type="text/template" id="StatusShares">
    <span class="glyphicon glyphicon-retweet"></span>
    <fmt:message key="tatami.user.status.shared.by"/>
</script>
<script type="text/template" id="StatusShareItems">
    <img class="img-rounded" src="http://www.gravatar.com/avatar/77a3ff9479d623eaff6cba1f81231939?s=25">
</script>
<script type="text/template" id="HomeSide">
    <section class='card-profile'></section>
    <section class='tag-trends'></section>
    <section class='groups'></section>
</script>

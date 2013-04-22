<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="HomeHeader">
    <div class="text-center page-header">
        <h1 class="title">
            <img class="img-rounded img-big pull-left" style="background-image: url(<@= avatarURL @>);">
            <strong>
                <@= fullName @>
            </strong>
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
            <img class="img-rounded img-medium pull-left" style="background-image: url(<@= avatarURL @>);">
            <strong>
                <@= fullName @>
            </strong>
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
    <div class='pull-left'>
        <img class="img-rounded img-medium" style="background-image: url(<@= avatarURL @>);">
    </div>
    <header class="page-header">
        <h4>
            <strong>
                <@= fullName @>
            </strong>
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
    </footer>
</script>
<script type="text/template" id="StatusFooters">
    <div class="tatams-share">
    </div>
    <aside class="text-right">
        <button class="btn btn-link status-action-reply">
            <span class="glyphicon glyphicon-comment"></span>
            <fmt:message key="tatami.user.status.reply"/>
        </button>
        <button class="btn btn-link status-action-share">
            <span class="glyphicon glyphicon-retweet"></span>
            <fmt:message key="tatami.user.status.share"/>
        </button>
        <button class="btn btn-link status-action-favorite">
            <span class="glyphicon glyphicon-pushpin"></span>
            <fmt:message key="tatami.user.status.favorite"/>
        </button>
    </aside>
    <div class="tatams-discute">
    </div>
</script>
<script type="text/template" id="StatusShares">
    <span class="glyphicon glyphicon-retweet"></span>
    <fmt:message key="tatami.user.status.shared.by"/>
</script>
<script type="text/template" id="StatusShareItems">
    <a>
        <img class="img-rounded img-small" style="background-image: url(<@= avatarURL @>);">
    </a>
</script>
<script type="text/template" id="HomeSide">
    <section class='card-profile'></section>
    <section class='tag-trends'></section>
    <section class='groups'></section>
</script>
<script type="text/template" id="HomeBody">
    <div class="page-header">
        <h4>
            <span class="glyphicon glyphicon-th-list"></span>
            Mur
        </h4>
    </div>
    <ul class="homebody-nav nav nav-tabs nav-justified">
        <li>
            <a href="#timeline">
                <fmt:message key="tatami.timeline"/>
            </a>
        </li>
        <li>
            <a href="#mentions">
                <fmt:message key="tatami.mentions"/>
            </a>
        </li>
        <li>
            <a href="#favorites">
                <fmt:message key="tatami.user.favoritestatus"/>
            </a>
        </li>
    </ul>
    <section class="tatams-container">
    </section>
</script>
<script type="text/template" id="StatusTimelineRegion">
    <section class='refresh-button'></section>
    <section class='timeline'></section>
</script>
<script type="text/template" id="StatusUpdateButton">
    <span class="glyphicon glyphicon-refresh"></span>
    Message(s) en attente :
    <span class="badge"><@= count @></span>
</script>
<script type="text/template" id="StatusEdit">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title"><fmt:message key="tatami.status.update"/></h4>
        </div>
        <div class="modal-body">
            <a class="edit-tatam-float-right">
                <i class="glyphicon glyphicon-edit close hide" title="<fmt:message key="tatami.status.editor"/>"></i><i class="glyphicon glyphicon-eye-open close" title="<fmt:message key="tatami.status.preview"/>"></i>
            </a>
            <fieldset class="edit-tatam row-fluid">
                <textarea placeholder="<fmt:message key="tatami.status.update"/>" rows="5"></textarea>
                <em>
                    <fmt:message key="tatami.status.characters.left"/>
                    <span class="countstatus badge"></span>
                </em>
            </fieldset>
            <fieldset class="preview-tatam row-fluid hide">
                <div class="well well-small markdown"/>
            </fieldset>
            <fieldset class="reply row-fluid">
                <legend>
                    <fmt:message key="tatami.status.reply"/>
                </legend>
                <div class="tatam-reply"/>
            </fieldset>
            <fieldset>
                <legend>
                    <fmt:message key="tatami.status.options"/>
                </legend>
                <label class="control-label" for="groupId">Groupe</label>
                 <div class="controls">
                    <select name="groupId">
                        <option value=""></option>
                        <option value="9ee2f010-75fb-11e2-80b4-00030a37001c">
                            Offre Formation
                        </option>
                    </select>
                </div>
                <label for="files">
                    <fmt:message key="tatami.menu.files"/>
                </label>
                <div>
                    <input name="files" type="file" class="col-span-12" multiple="multiple"/>
                </div>
            </fieldset>
        </div>
        <div class="modal-footer">
            <a class="btn" data-dismiss="modal" aria-hidden="true">
                <fmt:message key="tatami.form.cancel"/>
            </a>
            <a class="btn btn-primary">
                <fmt:message key="tatami.form.save"/>
            </a>
        </div>
    </div>
</script>
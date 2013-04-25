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
<script type="text/template" id="TagsHeader">
    <div class="text-center page-header">
        <h2 class="title">
            <span class="tagsHome pointer pull-left label label-info">
                <span class="glyphicon glyphicon-th-list"></span>
                &nbsp;<fmt:message key="tatami.timeline"/>
            </span>
            <span class="toggleTag pointer pull-right label <@= (followed)?'label-info':'' @>">
                <span class="glyphicon glyphicon-<@= (followed)?'minus':'plus' @>"></span>
                &nbsp;<@= (followed)?'<fmt:message key="tatami.user.followed"/>':'<fmt:message key="tatami.user.follow"/>' @>
            </span>
            #<@= name @>
        </h2>
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
            &nbsp;<fmt:message key="tatami.trends.title"/>
        </h4>
    </div>
    <div class="items">
    </div>
    <br/>
</script>
<script type="text/template" id="TagTrendItems">
    <span class="toggleTag pointer pull-right label <@= (followed)?'label-info':'' @>">
        <span class="glyphicon glyphicon-<@= (followed)?'minus':'plus' @>"></span>
    </span>
    <span class="glyphicon glyphicon-arrow-<@= (trendingUp)? 'up': 'down' @>"></span>
    <a href="#tags/<@= name @>">#<@= name @></a>
</script>
<script type="text/template" id="WhoToFollow">
    <div class="page-header">
        <h4>
            <span class="glyphicon glyphicon-random"></span>
            &nbsp;<fmt:message key="tatami.follow.suggestions"/>
        </h4>
    </div>
    <div class="items">
        TODO
    </div>
    <br/>
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
    <div class="well well-small markdown pointer">
        <@= marked(content) @>
    </div>
    <ul class="attachments"/>
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
        <@ if (Tatami.app.user.get('username') !== username) { @>
        <button class="btn btn-link status-action-share">
            <span class="glyphicon glyphicon-retweet"></span>
            <fmt:message key="tatami.user.status.share"/>
        </button>
        <@ } @>
        <button class="btn btn-link status-action-favorite">
            <span class="glyphicon glyphicon-pushpin"></span>
            <fmt:message key="tatami.user.status.favorite"/>
        </button>
        <@ if (Tatami.app.user.get('username') == username) { @>
        <button class="btn btn-link status-action-remove">
            <span class="glyphicon glyphicon-trash"></span>
            <fmt:message key="tatami.user.status.delete"/>
        </button>
        <@ } @>
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
    <section class='hidden-phone card-profile'></section>
    <section class='hidden-phone groups'></section>
    <section class='hidden-phone who-to-follow'></section>
    <section class='hidden-phone tag-trends'></section>
</script>
<script type="text/template" id="HomeBody">
    <ul class="homebody-nav nav nav-tabs nav-tabs-inverse nav-justified">
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
<script type="text/template" id="TagsBody">
    <div class="page-header">
    </div>
    <section class="tatams-container">
    </section>
</script>
<script type="text/template" id="StatusTimelineRegion">
    <section class='refresh-button'></section>
    <section class='timeline'></section>
</script>
<script type="text/template" id="StatusUpdateButton">
    <span class="glyphicon glyphicon-refresh"></span>
    <span class="badge">
        <@ if (count == 1) { @>
            1 <fmt:message key="tatami.timeline.message"/>
        <@ } else { @>
            <@= count @> <fmt:message key="tatami.timeline.messages"/>
        <@ } @>
    </span>
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
                <textarea name="content" placeholder="<fmt:message key="tatami.status.update"/>" rows="5"></textarea>
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
                 <div class="controls groups">
                    <label class="control-label" for="groupId"><fmt:message key="tatami.group.name"/></label>
                    <select name="groupId">
                        <option value=""></option>
                        <@ for (index in groups) { @>
                            <option value="<@= groups[index].groupId @>" <@ if(groupId === groups[index].groupId ){ @>selected="selected"<@ } @>>
                                <@= groups[index].name @>
                            </option>
                        <@ } @>
                    </select>
                </div>
                <div class="controls status-files">
                    <label for="files">
                        <fmt:message key="tatami.menu.files"/>
                    </label>
                    <div class=".attachmentBar progress progress-striped active" style="display: none;">
                        <div class="bar" style="width: 0%;"></div>
                    </div>
                    <div class="dropzone well"><fmt:message key="tatami.status.update.drop.file"/></div>
                    <input style="display: none;" class="updateStatusFileupload" type="file" name="uploadFile" data-url="/tatami/rest/fileupload" multiple/>
                    <div class="fileUploadResults">

                    </div>
                </div>
            </fieldset>
        </div>
        <div class="modal-footer">
            <a class="btn" data-dismiss="modal" aria-hidden="true">
                <fmt:message key="tatami.form.cancel"/>
            </a>
            <input type="submit" class="btn btn-primary" title="<fmt:message key="tatami.form.save"/>">
        </div>
    </div>
</script>
<script type="text/template" id="Groups">
    <div class="page-header">
        <h4>
            <span class="glyphicon glyphicon-list-alt"></span>
            &nbsp;<fmt:message key="tatami.account.groups.mygroups"/>
        </h4>
    </div>
    <div class="items">
    </div>
    <br/>
</script>
<script type="text/template" id="GroupItems">
    <a href="#"><@= name @></a>
</script>
<script type="text/template" id="StatusAttachmentItems">
    <span class="glyphicon glyphicon-file"></span>
    <a href="/tatami/file/<@= attachmentId @>/<@= filename @>" target="_blank">
        <@= filename @>
    </a>
</script>
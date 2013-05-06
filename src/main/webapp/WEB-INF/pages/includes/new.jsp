<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="TagsHeader">
    <div class="text-center page-header">
        <a href="#timeline" class="pull-left btn btn-info">
            <span class="glyphicon glyphicon-th-list"></span>
            &nbsp;<fmt:message key="tatami.timeline"/>
        </a>
        <a class="toggleTag pull-right btn <@= (followed)?'btn-info':'' @>">
            <span class="glyphicon glyphicon-<@= (followed)?'minus':'plus' @>"></span>
            &nbsp;<@= (followed)?'<fmt:message key="tatami.user.followed"/>':'<fmt:message key="tatami.user.follow"/>' @>
        </a>
        <h2 class="title">#<@= name @></h2>
    </div>
</script>
<script type="text/template" id="GroupsHeader">
    <div class="text-center page-header">
        <a href="#timeline" class="pull-left btn btn-info">
            <span class="glyphicon glyphicon-th-list"></span>
            &nbsp;<fmt:message key="tatami.timeline"/>
        </a>

        <a class="toggleGroup pull-right btn btn-info">
            <span class="glyphicon glyphicon-minus"></span>
            <!-- TODO -->
            &nbsp;<fmt:message key="tatami.user.followed"/>
        </a>

        <h2 class="title"><@= name @></h2>
    </div>
</script>
<script type="text/template" id="ProfileHeader">
    <div class="text-center page-header">
         <a href="#timeline" class="pull-left btn btn-info">
             <span class="glyphicon glyphicon-th-list"></span>
             &nbsp;<fmt:message key="tatami.timeline"/>
         </a>

         <@ if(!you) { @>
             <a class="toggleFriend pull-right btn <@ if(friend) { @>btn-info<@ } @>">
             <span class="glyphicon glyphicon-<@= (friend)?'minus':'plus' @>"></span>
             &nbsp;<@= (friend)?'<fmt:message key="tatami.user.followed"/>':'<fmt:message key="tatami.user.follow"/>' @>
             </a>
         <@ } @>

        <h2 class="title">@<@= username @></h2>
    </div>
</script>
<script type="text/template" id="CardProfile">
    <div class="page-header">
        <h4 class="profile-card">
            <img class="img-rounded img-medium pull-left" style="background-image: url(<@= avatarURL @>);">
            <a href="#users/<@= username @>">
                <strong>
                    <@= fullName @>
                </strong>
            </a>
            <br>
            <a href="#users/<@= username @>">
                <small>
                    @<@= username @>
                </small>
            </a>
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
<script type="text/template" id="StatusItems">
    <div class='pull-left'>
        <img class="img-rounded img-medium" style="background-image: url(<@= avatarURL @>);">
    </div>
    <header class="page-header">
        <div class="pull-right text-right">
            <@ if(groupId) { @>
                <a class="label label-info" href="#groups/<@= groupId @>">
                    <@= groupName @>
                </a>
                <br/>
            <@ } @>
            <abbr title="<@= prettyPrintStatusDate @>">
                <@= prettyPrintStatusDate @>
            </abbr>
        </div>
        <h4>
            <a href="#users/<@= username @>">
                <strong>
                    <@= fullName @>
                </strong>
            </a>
            <br>
            <a href="#users/<@= username @>">
                <small>
                    @<@= username @>
                </small>
            </a>
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
        <a href="#status/<@= statusId @>" class="btn btn-link">
            <span class="glyphicon glyphicon-eye-open"></span>
            <fmt:message key="tatami.user.status.show"/>
        </a>
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
    <section class='refresh-button pointer'></section>
    <section class='timeline'></section>
</script>
<script type="text/template" id="StatusUpdateButton">
    <span class="glyphicon glyphicon-refresh"></span>
    <span class="badge">
        <@= count @>
    </span>
    <@ if (count == 1) { @>
        <fmt:message key="tatami.timeline.message"/>
    <@ } else { @>
        <fmt:message key="tatami.timeline.messages"/>
    <@ } @>
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
                <div class="well markdown"/>
            </fieldset>
            <fieldset class="reply row-fluid">
                <legend>
                    <fmt:message key="tatami.status.reply"/>
                </legend>
                <div class="tatam-reply"/>
            </fieldset>
            <fieldset class="row-fluid">
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
                    <div class="fileUploadResults wrap">

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
    <a href="#groups/<@= groupId @>"><@= name @></a>
</script>
<script type="text/template" id="StatusAttachmentItems">
    <span class="glyphicon glyphicon-file"></span>
    <a href="/tatami/file/<@= attachmentId @>/<@= filename @>" target="_blank">
        <@= filename @>
    </a>
</script>
<script type="text/template" id="search-category">
    <@ if(cat.category == 'tags') {@>
        <li class="category <@= cat.category @>"><span class="glyphicon glyphicon-tags"></span></li>
    <@} else if(cat.category == 'users') { @>
        <li class="category <@= cat.category @>"><span class="glyphicon glyphicon-user"></span></li>
    <@} else { @>
        <li class="category <@= cat.category @>"><span class="glyphicon glyphicon-th-large"></span></i></li>
    <@}@>
</script>
<script type="text/template" id="search-category-item">
    <@ if(item.category == 'tags') {@>
        <li class="item tags" data-value="<@= item.label @>">
            <a href="#"><@= item.label @></a>
        </li>
    <@} else if(item.category == 'users') { @>
        <li class="item users" data-value="<@= item.label @>">
            <img class="img-rounded img-small" style="background-image: url(<@= item.avatarURL @>);">
            <h4><a href="#"><@= item.fullName @></a></h4>
            <p><@= item.label @></p>
        </li>
    <@} else { @>
        <li class="item groups" data-value="<@= item.label @>" rel="<@= item.id @>">
            <img class="img-rounded img-small" style="background-image: url(/img/default_image_profile.png);">
            <h4><a href="#"><@= item.label @></a></h4>
            <p><@= item.nb @> <fmt:message key="tatami.group.counter"/></p>
        </li>
    <@}@>
</script>
<script type="text/template" id="ProfileActions">
</script>
<script type="text/template" id="ProfileStats">
    <div class="page-header">
        <h4>
            <span class="glyphicon glyphicon-signal"></span>
            <fmt:message key="tatami.statistics"/>
        </h4>
    </div>
    <div>
        <p>
            <strong>
                <fmt:message key="tatami.badge.status"/> :
            </strong>
            <a href="#users/<@= username @>">
                <span class="badge"><@= statusCount @></span>
            </a>
        </p>
        <p>
            <strong>
                <fmt:message key="tatami.badge.followed"/> :
            </strong>
            <a href="#users/<@= username @>/friends">
                <span class="badge"><@= friendsCount @></span>
            </a>
        </p>
        <p>
            <strong>
                <fmt:message key="tatami.badge.followers"/> :
            </strong>
            <a href="#users/<@= username @>/followers">
                <span class="badge"><@= followersCount @></span>
            </a>
        </p>
        <br/>
    </div>
</script>
<script type="text/template" id="ProfileInformations">
    <h4 class="profile-card">
        <img class="img-rounded img-big" style="background-image: url(<@= avatarURL @>);"><br/>
        <strong><@= fullName @></strong>
    </h4>
    <br/>

    <div class="page-header">
        <h4>
            <span class="glyphicon glyphicon-user"></span>
            <fmt:message key="tatami.user.informations"/>
        </h4>
    </div>
    <p>
        <strong>
            <fmt:message key="tatami.user.firstName"/> :
        </strong>
        <@= firstName @>
    </p>
    <p>
        <strong>
            <fmt:message key="tatami.user.lastName"/> :
        </strong>
        <@= lastName @>
    </p>
    <p>
        <strong>
            <fmt:message key="tatami.user.email"/> :
        </strong>
        <@= login @>
    </p>
    <p>
        <strong>
            <fmt:message key="tatami.user.jobTitle"/> :
        </strong>
        <@= jobTitle @>
    </p>
    <p>
        <strong>
            <fmt:message key="tatami.user.phoneNumber"/> :
        </strong>
        <@= phoneNumber @>
    </p>
    <br/>
</script>
<script type="text/template" id="ProfileSide">
    <section class="actions"/>
    <section class="hidden-phone informations"/>
    <section class="hidden-phone stats"/>
    <section class="hidden-phone tagTrends"/>
</script>
<script type="text/template" id="TagTrendsProfile">
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
<script type="text/template" id="ProfileBody">
    <ul class="profilebody-nav nav nav-tabs nav-tabs-inverse nav-justified">
        <li class="timeline">
            <a href="#users/<@= user @>">
                <fmt:message key="tatami.badge.status"/>
            </a>
        </li>
        <li class="friends">
            <a href="#users/<@= user @>/friends">
                <fmt:message key="tatami.badge.followed"/>
            </a>
        </li>
        <li class="followers">
            <a href="#users/<@= user @>/followers">
                <fmt:message key="tatami.badge.followers"/>
            </a>
        </li>
    </ul>
    <section class="tatams-container">
    </section>
</script>
<script type="text/template" id="GroupsBody">
    <ul class="groupsbody-nav nav nav-tabs nav-tabs-inverse nav-justified">
        <li class="timeline">
            <a href="#groups/<@= group @>">
                <fmt:message key="tatami.badge.status"/>
            </a>
        </li>
        <li class="members">
            <a href="#groups/<@= group @>/members">
                <fmt:message key="tatami.group.members.list"/>
            </a>
        </li>
    </ul>
    <section class="tatams-container">
    </section>
</script>
<script type="text/template" id="UserItems">
    <div class='pull-left'>
        <img class="img-rounded img-medium" style="background-image: url(<@= avatarURL @>);">
    </div>
    <h4>
        <@ if(!you) { @>
            <span class="toggleFriend pointer pull-right label <@ if(friend) { @>label-info<@ } @>">
                <span class="glyphicon glyphicon-<@= (friend)? 'minus':'plus'@>"></span>
            </span>
        <@ } @>
        <a href="#users/<@= username @>">
            <strong>
                <@= fullName @>
            </strong>
        </a>
        <br>
        <a href="#users/<@= username @>">
            <small>
                @<@= username @>
            </small>
        </a>
    </h4>
</script>
<script type="text/template" id="UserItemsMini">
    <div class='pull-left'>
        <img class="img-rounded img-small" style="background-image: url(<@= avatarURL @>);">
    </div>
    <h6>
        <@ if(!you) { @>
            <span class="toggleFriend pointer pull-right label <@ if(friend) { @>label-info<@ } @>">
                <span class="glyphicon glyphicon-<@= (friend)? 'minus':'plus'@>"></span>
            </span>
        <@ } @>
        <@ if(fullName){ @>
            <a href="#users/<@= username @>">
                <strong>
                    <@= fullName @>
                </strong>
            </a>
            <br>
        <@ } @>
        <a href="#users/<@= username @>">
            <small>
                @<@= username @>
            </small>
        </a>
    </h4>
</script>
<script type="text/template" id="WhoToFollow">
    <div class="page-header">
        <h4>
            <span class="glyphicon glyphicon-random"></span>
            &nbsp;<fmt:message key="tatami.follow.suggestions"/>
        </h4>
    </div>
    <div class="items">
    </div>
    <br/>
</script>

<!-- Admin template -->

<script type="text/template" id="AdminSide">
    <div class="page-header">
        <h4>
            <span class="glyphicon glyphicon-wrench"></span>
            Actions
        </h4>
    </div>
    <ul class="adminbody-nav nav nav-pills nav-stacked">
        <li><a href="/tatami/new/admin/profile"><fmt:message key="tatami.menu.profile"/></a></li>
        <li><a href="/tatami/new/admin/preference"><fmt:message key="tatami.menu.preferences"/></a></li>
        <li><a href="/tatami/new/admin/password"><fmt:message key="tatami.menu.password"/></a></li>
        <li><a href="/tatami/new/admin/files"><fmt:message key="tatami.menu.files"/></a></li>
        <li><a href="/tatami/new/admin/users"><fmt:message key="tatami.menu.directory"/></a></li>
        <li><a href="/tatami/new/admin/groups"><fmt:message key="tatami.menu.groups"/></a></li>
        <li><a href="/tatami/new/admin/tags"><fmt:message key="tatami.menu.tags"/></a></li>
        <li><a href="/tatami/new/admin/statsofday"><fmt:message key="tatami.menu.status.of.the.day"/></a></li>
    </ul>
</script>

<script type="text/template" id="AdminBody">
    <div class="tab-pane" id="profile" />
    <div class="tab-pane" id="preferences" />
    <div class="tab-pane" id="password" />
    <div class="tab-pane" id="files" />
    <div class="tab-pane" id="users" />
    <div class="tab-pane" id="groups" />
    <div class="tab-pane" id="tags" />
    <div class="tab-pane" id="stats" />
    <section class="tatams-container"></section>
</script>
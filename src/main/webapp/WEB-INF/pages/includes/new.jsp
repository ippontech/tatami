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
        <h3>#<@= name @></h3>
    </div>
</script>
<script type="text/template" id="GroupsHeader">
    <div class="text-center page-header">
        <a href="#timeline" class="pull-left btn btn-info">
            <span class="glyphicon glyphicon-th-list"></span>
            &nbsp;<fmt:message key="tatami.timeline"/>
        </a>
        <@ if(publicGroup && !administrator) { @>
            <a class="toggleTag pull-right btn <@= (member)?'btn-info':'' @>">
                <span class="glyphicon glyphicon-<@= (member)?'minus':'plus' @>"></span>
                &nbsp;<@= (member)?'<fmt:message key="tatami.user.followed"/>':'<fmt:message key="tatami.user.follow"/>' @>
            </a>
        <@ } else if(administrator){ @>
            <a href="/tatami/account/#/groups" class="toggleTag pull-right btn btn-info">
                <span class="glyphicon glyphicon-th-large"></span>
                <fmt:message key="tatami.menu.groups"/>
            </a>
        <@ } @>

        <h3><@= name @></h3>
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

        <h3>@<@= username @></h3>
    </div>
</script>
<script type="text/template" id="CardProfile">
    <div class="page-header">
        <h4 class="profile-card background-image-fffix">
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
        <br/>
    </div>
</script>
<script type="text/template" id="TagTrends">
    <div class="well well-small">
        <h4>
            <span class="glyphicon glyphicon-fire"></span>
            &nbsp;<fmt:message key="tatami.trends.title"/>
        </h4>
        <div class="items">
        </div>
    </div>
</script>
<script type="text/template" id="TagTrendItems">
    <span class="toggleTag pointer pull-right label <@= (followed)?'label-info':'' @>">
        <span class="glyphicon glyphicon-<@= (followed)?'minus':'plus' @>"></span>
    </span>
    <span class="glyphicon glyphicon-arrow-<@= (trendingUp)? 'up': 'down' @>"></span>
    <a href="#tags/<@= name @>">#<@= name @></a>
</script>
<script type="text/template" id="StatusItem">
    <div>
        <div class='pull-left background-image-fffix'>
            <img class="img-rounded img-medium" style="background-image: url(<@= avatarURL @>);">
        </div>
        <div class="pull-right text-right">
            <abbr class="timeago" title="<@= iso8601StatusDate @>"><@= prettyPrintStatusDate @></abbr>
        </div>
        <h5>
            <a href="#users/<@= username @>"><strong><@= fullName @></strong></a>
            <a href="#users/<@= username @>"><small>@<@= username @></small></a>
        </h5>
        <div class="markdown">
            <@= marked(content) @>
        </div>
        <div class="attachments"/>
        <@ if (groupId) { @>
            <a class="label <@ if (publicGroup) { @>label-info<@ } else { @>label-warning<@ } @>" href="#groups/<@= groupId @>">
                <@= groupName @>
            </a>
            <br/>
        <@ } @>

        <small>
        <@ if (statusPrivate == true) { @>
            <span class="glyphicon glyphicon-lock"></span> <fmt:message key="tatami.status.private"/>&nbsp;
        <@ } @>

        <@ if (sharedByUsername != null && sharedByUsername != false) { @>
            <span class="glyphicon glyphicon-retweet"></span> <fmt:message key="tatami.user.status.shared.by"/> <a href="#users/<@= sharedByUsername @>">@<@= sharedByUsername @></a>
        <@ } @>

        <@ if (replyTo != '') { @>
            <span class="glyphicon glyphicon-share-alt"></span> <fmt:message key="tatami.user.status.replyto"/> <a href="#status/<@= replyTo @>">@<@= replyToUsername @></a>
        <@ } @>
        </small>
    </div>
    <footer></footer>
</script>
<script type="text/template" id="StatusFooters">
    <div class="text-center status-actions">
        <small>
            <a href="#status/<@= statusId @>" class="btn btn-link status-action hidden-phone">
                 <i class="glyphicon glyphicon-eye-open"></i> <fmt:message key="tatami.user.status.show"/>
            </a>
            <@ if (ios) { @>
            <a href="tatami://sendResponse?replyTo=<@= statusId @>&replyToUsername=<@= username @>" class="btn btn-link status-action">
                <i class="glyphicon glyphicon-comment"></i> <fmt:message key="tatami.user.status.reply"/>
            </a>
            <@ } else { @>
            <button class="btn btn-link status-action status-action-reply">
                <i class="glyphicon glyphicon-comment"></i> <fmt:message key="tatami.user.status.reply"/>
            </button>
            <@ } @>
            <@ if (Tatami.app.user.get('username') !== username) { @>
            <button class="btn btn-link status-action status-action-share" success-text="<fmt:message key="tatami.user.status.share.success"/>">
                <i class="glyphicon glyphicon-retweet"></i> <fmt:message key="tatami.user.status.share"/>
            </button>
            <@ } @>
            <button class="btn btn-link status-action status-action-favorite">
                <i class="glyphicon glyphicon-star"></i> <fmt:message key="tatami.user.status.favorite"/>
            </button>
            <@ if (Tatami.app.user.get('username') == username) { @>
            <button class="btn btn-link status-action status-action-delete"
                    confirmation-text='<p><fmt:message key="tatami.user.status.confirm.delete"/></p><p class="text-center">
                                         <a class="btn btn-default status-action-delete-cancel" href="#"><fmt:message key="tatami.form.cancel"/></a>
                                         <a class="btn btn-danger status-action-delete-confirm" href="#"><fmt:message key="tatami.user.status.delete"/></a>
                                         </p>'>
                <i class="glyphicon glyphicon-trash"></i> <fmt:message key="tatami.user.status.delete"/>
            </button>
            <@ } @>
        </small>
    </div>
    <div class="tatams-share">
    </div>
    <div class="tatams-discussion">
    </div>
</script>
<script type="text/template" id="StatusShares">
        <small><fmt:message key="tatami.user.status.shared.by"/></small>
        <span class="badge">
               <@= sharesCount @>
        </span> :
</script>
<script type="text/template" id="StatusShareItems">
    <img class="img-rounded img-small" style="background-image: url(<@= avatarURL @>);">
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
                <i class="glyphicon glyphicon-th-list"></i> <fmt:message key="tatami.timeline"/>
            </a>
        </li>
        <li>
            <a href="#mentions">
                <i class="glyphicon glyphicon-user"></i> <fmt:message key="tatami.mentions"/>
            </a>
        </li>
        <li>
            <a href="#favorites">
                <i class="glyphicon glyphicon-star"></i> <fmt:message key="tatami.user.favoritestatus"/>
            </a>
        </li>
    </ul>
    <section class="tatams-container">
    </section>
</script>
<script type="text/template" id="TagsBody">
    <section class="tatams-container">
    </section>
</script>
<script type="text/template" id="SearchBody">
    <h3><fmt:message key="tatami.search.result.title"/> : <strong><@= input @></strong></h3>
    <hr>
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
                <div class="well well-small markdown"/>
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
                    <label class="control-label"><fmt:message key="tatami.group.name"/></label>
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
                    <label>
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
                <div class="controls status-private">
                    <label class="checkbox">
                        <input id="statusPrivate" name="statusPrivate" type="checkbox" value="true"> <span class="glyphicon glyphicon-lock"></span> <fmt:message key="tatami.status.private"/>
                    </label>
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
    <div class=" well well-small">
        <h4>
            <span class="glyphicon glyphicon-list-alt"></span>
            &nbsp;<fmt:message key="tatami.account.groups.mygroups"/>
        </h4>
        <div class="items">
        </div>
    </div>
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
        <li class="item users background-image-fffix" data-value="<@= item.label @>">
            <img class="img-rounded img-small" style="background-image: url(<@= item.avatarURL @>);">
            <h4><a href="#"><@= item.fullName @></a></h4>
            <p><@= item.label @></p>
        </li>
    <@} else { @>
        <li class="item groups background-image-fffix" data-value="<@= item.label @>" rel="<@= item.id @>">
            <img class="img-rounded img-small" style="background-image: url(/img/default_image_profile.png);">
            <h4><a href="#"><@= item.label @></a></h4>
            <p><@= item.nb @> <fmt:message key="tatami.group.counter"/></p>
        </li>
    <@}@>
</script>
<script type="text/template" id="ProfileActions">
</script>
<script type="text/template" id="ProfileStats">
    <div class="well well-small">
        <h4>
            <span class="glyphicon glyphicon-signal"></span>
            <fmt:message key="tatami.statistics"/>
        </h4>

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
        </div>
    </div>
</script>
<script type="text/template" id="ProfileInformations">
    <h4 class="profile-card background-image-fffix">
        <img class="img-rounded img-big" style="background-image: url(<@= avatarURL @>);"><br/>
    </h4>
    <br/>

    <div class="well well-small">
        <h4>
            <span class="glyphicon glyphicon-user"></span>
            <fmt:message key="tatami.user.informations"/>
        </h4>

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
    </div>
</script>
<script type="text/template" id="ProfileSide">
    <section class="actions"/>
    <section class="hidden-phone informations"/>
    <section class="hidden-phone stats"/>
    <section class="hidden-phone tagTrends"/>
</script>
<script type="text/template" id="TagTrendsProfile">
    <div class="well well-small">
        <h4>
            <span class="glyphicon glyphicon-fire"></span>
            &nbsp;<fmt:message key="tatami.trends.title"/>
        </h4>
        <div class="items">
        </div>
    </div>
</script>
<script type="text/template" id="ProfileBody">
    <ul class="profilebody-nav nav nav-tabs nav-tabs-inverse nav-justified">
        <li class="timeline">
            <a href="#users/<@= user @>">
                <i class="glyphicon glyphicon-th-list"></i> <fmt:message key="tatami.badge.status"/>
            </a>
        </li>
        <li class="friends">
            <a href="#users/<@= user @>/friends">
                <i class="glyphicon glyphicon-upload"></i> <fmt:message key="tatami.badge.followed"/>
            </a>
        </li>
        <li class="followers">
            <a href="#users/<@= user @>/followers">
                <i class="glyphicon glyphicon-download"></i> <fmt:message key="tatami.badge.followers"/>
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
                <i class="glyphicon glyphicon-th-list"></i> <fmt:message key="tatami.badge.status"/>
            </a>
        </li>
        <li class="members">
            <a href="#groups/<@= group @>/members">
                <i class="glyphicon glyphicon-user"></i> <fmt:message key="tatami.group.members.list"/>
            </a>
        </li>
    </ul>
    <section class="tatams-container">
        
    </section>
</script>
<script type="text/template" id="UserItems">
    <div class='pull-left background-image-fffix'>
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
    <div class='pull-left background-image-fffix'>
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
    </h6>
</script>
<script type="text/template" id="WhoToFollow">
    <div class="well well-small">
        <h4>
            <span class="glyphicon glyphicon-random"></span>
            &nbsp;<fmt:message key="tatami.follow.suggestions"/>
        </h4>
        <div class="items">
        </div>
    </div>
</script>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="TagsHeader">
    <h3>
    <@ if (!ios) { @><fmt:message key="tatami.search.result.title"/> : <@ } @><strong>#<@= name @></strong>                    
    <a href="#timeline" class="btn-title toggleTag pull-right label label-info">
        <span class="glyphicon glyphicon-th-list"></span>
    </a>
    <a class="btn-title toggleTag pull-right label <@= (followed)?'label-info':'' @> ">
        <span class="glyphicon glyphicon-<@= (followed)?'minus':'plus' @>"></span>
    </a>
    </h3>
</script>
<script type="text/template" id="GroupsHeader">
    <h3>
        <@ if (!ios) { @><fmt:message key="tatami.search.result.title"/> : <@ } @><strong><@= name @><strong>
        <a href="#timeline" class="btn-title toggleTag pull-right label label-info">
            <span class="glyphicon glyphicon-th-list"></span>
        </a>

        <@ if(publicGroup && !administrator) { @>
            <a class="btn-title toggleTag pull-right label <@= (member)?'label-info':'' @>">
                <span class="glyphicon glyphicon-<@= (member)?'minus':'plus' @>"></span>
            </a>
        <@ } else if(administrator){ @>
            <a href="/tatami/account/#/groups" class="btn-title toggleTag pull-right label label-info">
                <span class="glyphicon glyphicon-th-large"></span>
            </a>
        <@ } @>
    </h3>
</script>
<script type="text/template" id="SearchHeader">
    <h3><@ if (!ios) { @><fmt:message key="tatami.search.result.title"/> : <@ } @><strong><@= input @></strong></h3>
</script>
<script type="text/template" id="ProfileHeader">
    <h3><fmt:message key="tatami.search.result.title"/> : <strong>@<@= username @><strong>
        <a href="#timeline" class="btn-title toggleTag pull-right label label-info">
            <span class="glyphicon glyphicon-th-list"></span>
        </a>
        <@ if(!you) { @>
            <a class="btn-title toggleFriend pull-right label <@= (friend)?'label-info':'' @>">
                <span class="glyphicon glyphicon-<@= (friend)?'minus':'plus' @>"></span>
            </a>
        <@ } @>
    </h3>
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
    </div>
</script>
<script type="text/template" id="TagTrends">
    <div class="well well-small">
        <h4 id="profile-trends-title">
            <span class="glyphicon glyphicon-fire"></span>
            &nbsp;<fmt:message key="tatami.trends.title"/>
        </h4>
        <div class="items">
        </div>
    </div>
</script>
<script type="text/template" id="TagTrendItems">
    <span class="little-padding toggleTag pointer pull-right label <@= (followed)?'label-info':'' @>">
        <span class="glyphicon glyphicon-<@= (followed)?'minus':'plus' @>"></span>
    </span>
    <span class="glyphicon glyphicon-arrow-<@= (trendingUp)? 'up': 'down' @>"></span>
    <a href="#tags/<@= name @>">#<@= name @></a>
</script>
<script type="text/template" id="StatusItem">
    <@if(root){ @>
        <div id="before">

        </div>
    <@ } @>
    <div id="current">
        <div class='pull-left background-image-fffix statusitem-img'>
            <@ if (type == 'MENTION_SHARE') { @>
                <span class="glyphicon glyphicon-retweet"></span>
            <@ } else if (type == 'MENTION_FRIEND') { @>
                <span class="glyphicon glyphicon-download"></span>
            <@ } else { @>
                <img class="img-rounded <@= root?'img-medium':'img-reply' @>" style="background-image: url(<@= avatarURL @>);">
            <@ } @>
        </div>
        <div id="status-content-container">
            <div class="pull-right text-right">
                <abbr class="timeago" title="<@= iso8601StatusDate @>"><@= prettyPrintStatusDate @></abbr>
            </div>
            <h5 class="statusitem-name">
                <strong><a href="#users/<@= username @>"><@= fullName @></a></strong>
                <small><a href="#users/<@= username @>">@<@= username @></a></small>
                <@ if (type == 'MENTION_SHARE') { @>
                    <fmt:message key="tatami.user.shared.you"/>
                <@ } else if (type == 'MENTION_FRIEND') { @>
                    <fmt:message key="tatami.user.followed.you"/>
                <@ } @>
            </h5>
            <div class="markdown <@ if (type == 'MENTION_SHARE') { @>mention-share<@ } @>">
                <@= marked(content) @>
            </div>
            <small> 
                <@ if (groupId) { @>
                    <a class="label <@ if (publicGroup) { @>label-info<@ } else { @>label-warning<@ } @>" href="#groups/<@= groupId @>">
                        <@= groupName @>
                    </a>
                    <br/>
                <@ } @>           
                <@ if (statusPrivate == true) { @>
                <span class="glyphicon glyphicon-lock"></span> <fmt:message key="tatami.status.private"/>&nbsp;
                <br/>
                <@ } @>
                <@ if (replyTo != '') { @>
                    <span class="glyphicon glyphicon-share-alt"></span> <fmt:message key="tatami.user.status.replyto"/> <a href="#status/<@= replyTo @>">@<@= replyToUsername @></a></br>
                <@ } @>
                <@ if ((type == 'STATUS' || type == 'SHARE') && sharedByUsername != null && sharedByUsername != false) { @>
                    <span class="glyphicon glyphicon-retweet"></span> <fmt:message key="tatami.user.status.shared.by"/> <a href="#users/<@= sharedByUsername @>">@<@= sharedByUsername @></a></br>
                <@ } @>

                <@ if ((type == 'ANNOUNCEMENT')) { @>
                    <span class="glyphicon glyphicon-bullhorn"></span> <fmt:message key="tatami.user.status.announced.by"/> <a href="#users/<@= sharedByUsername @>">@<@= sharedByUsername @></a></br>
                <@ } @>
                <div class="attachments"/>
                <div id="share">

                </div>
            </small>
        </div>        
    </div>
    <div id="buttons">

    </div>
    <@if(root){ @>      
        <div id="after">

        </div>
    <@ } @>
</script>
<script type="text/template" id="StatusFooters">
<@ if (ios) { @>
    <div class="statusitem-footer"> 
<@ } else { @>
    <small class="statusitem-footer"> 
<@ } @>  
        <a href="#status/<@= statusId @>" class="btn-link status-action button-ios" >
            <i class="glyphicon glyphicon-eye-open"></i> <fmt:message key="tatami.user.status.show"/>
        </a>
        <@ if (ios) { @>
            <button class="btn-link status-action button-ios">
                <a href="tatami://sendResponse?replyTo=<@= statusId @>&replyToUsername=<@= username @>">
                    <i class="glyphicon glyphicon-comment"></i> <fmt:message key="tatami.user.status.reply"/>
                </a>
            </button>
            <@ } else { @>
            <button class="btn-link status-action status-action-reply button-ios">
                <i class="glyphicon glyphicon-comment"></i> <fmt:message key="tatami.user.status.reply"/>
            </button>
            <@ } @>
            <!-- //TODO CodingParty : Afficher l'annulation du partage -->
            <@ if (Tatami.app.user.get('username') !== username && sharedByMe == false && statusPrivate == false && groupId == '' && type != 'ANNOUNCEMENT') { @>
            <button class="btn-link status-action status-action-share button-ios" success-text="<fmt:message key="tatami.user.status.share.success"/>">
                <i class="glyphicon glyphicon-retweet"></i> <fmt:message key="tatami.user.status.share"/>
            </button>
            <@ } @>
            <button class="btn-link status-action status-action-favorite button-ios">
                <i class="glyphicon glyphicon-star"></i> <fmt:message key="tatami.user.status.favorite"/>
            </button>
            <sec:authorize ifAnyGranted="ROLE_ADMIN">
                <@ if (statusPrivate == false && groupId == '') { @>
                <button class="btn-link status-action status-action-announce button-ios"
                        confirmation-text='<p><fmt:message key="tatami.user.status.confirm.announce"/></p><p class="text-center">
                                             <a class="btn btn-default status-action-announce-cancel" href="#"><fmt:message key="tatami.form.cancel"/></a>
                                             <a class="btn btn-danger status-action-announce-confirm" href="#"><fmt:message key="tatami.user.status.announce"/></a>
                                             </p>'>
                    <i class="glyphicon glyphicon-bullhorn"></i> <fmt:message key="tatami.user.status.announce"/>
                </button>
                <@ } @>
            </sec:authorize>
            <@ if (Tatami.app.user.get('username') == username) { @>
            <button class="btn-link status-action status-action-delete button-ios"
                    confirmation-text='<p><fmt:message key="tatami.user.status.confirm.delete"/></p><p class="text-center">
                                         <button class="btn btn-default status-action-delete-cancel" href="#"><fmt:message key="tatami.form.cancel"/></button>
                                         <button class="btn btn-danger status-action-delete-confirm" href="#"><fmt:message key="tatami.user.status.delete"/></button>
                                         </p>'>
                <i class="glyphicon glyphicon-trash"></i> <fmt:message key="tatami.user.status.delete"/>
            </button>
        <@ } @>
<@ if (ios) { @>
    </div> 
<@ } else { @>
    </small> 
<@ } @>
</script>
<script type="text/template" id="StatusShares">
        <fmt:message key="tatami.user.status.shared.by"/>
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
    <ul class="homebody-nav nav nav-justified">
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
    <section class="tatams-content tatams-margin">
    <@ if (!ios) { @>
        <div class="tatams-content-title">
            <h3>
                <@ if (tabName == 'timeline' ) { @><fmt:message key="tatami.timeline"/><@ } @>
                <@ if (tabName == 'mentions' ) { @><fmt:message key="tatami.mentions"/><@ } @>
                <@ if (tabName == 'favorites' ) { @><fmt:message key="tatami.user.favoritestatus"/><@ } @>
            </h3>
        </div>
    <@ } @>
        <section class="tatams-container">
        </section>
    </section>
</script>
<script type="text/template" id="TagsBody">
    <section class="tatams-content">
        <div class="tatams-content-title">

        </div>
        <section class="tatams-container">
        </section>
    </section>
</script>
<script type="text/template" id="SearchBody">
    <section class="tatams-content">
        <div class="tatams-content-title">

        </div>
        <section class="tatams-container">
        </section>
    </section>
</script>
<script type="text/template" id="StatusTimelineRegion">
    <section class='refresh-button pointer'></section>
    <section class='timeline'></section>
</script>
<script type="text/template" id="StatusUpdateButton">
    <span class="badge"><@= count @></span>
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
                <textarea name="content" placeholder="<fmt:message key="tatami.status.update"/>" maxlength="750" rows="5"></textarea>
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
    <div class="well well-small">
        <h4 id="groups-list-title">
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
        <a href="/tatami/file/<@= attachmentId @>/<@= filename @>" class="btn-link status-action" target="_blank">
            <i class="glyphicon glyphicon-file"></i> <@= filename @>
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
        <img class="img-rounded img-big" style="background-image: url(<@= avatarURL @>);">
    </h4>
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
    <ul class="homebody-nav nav nav-tabs-inverse nav-justified">
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
    <section class="tatams-content tatams-margin">
        <div class="tatams-content-title">

        </div>
        <section class="tatams-container">
        </section>
    </section> 
</script>
<script type="text/template" id="GroupsBody">
    <ul class="homebody-nav nav nav-tabs-inverse nav-justified">
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
    <section class="tatams-content tatams-margin">
        <div class="tatams-content-title">

        </div>
        <section class="tatams-container">
        </section>
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
        <h4 id="follow-suggest-title">
            <span class="glyphicon glyphicon-random"></span>
            &nbsp;<fmt:message key="tatami.follow.suggestions"/>
        </h4>
        <div class="items">
        </div>
    </div>
</script>

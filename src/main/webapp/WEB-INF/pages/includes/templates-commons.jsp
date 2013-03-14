<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="timeline-item">
  <div class="status alert  <@ if (discuss === true) { @> alert-discuss<@ } else { @> alert-status<@ } if (status.favorite === true) { @> favorite<@ } if (!discuss && status.detailsAvailable) { @> details-available <@ } @>">
    <div class="row-fluid">
      <div class="statuses">
      </div>
      
      <@ if (discuss !== true) { @>
      <div class="statuses-details">
        <div class="shares">
        </div>
        
        <div class="discuss-details">
          <div class="discuss-before">
          </div>
          <div class="discuss-current">
          </div>
          <div class="discuss-after">
          </div>
        </div>
      </div>
      <@} @>
    </div>
  </div>
</script>

<script type="text/template" id="timeline-item-inner">
  <tr>
    <th rowspan="6">
        <img class="avatar" src="https://www.gravatar.com/avatar/<@=status.gravatar@>?s=64&d=mm" alt="<@= [status.firstName,status.lastName].filter(function(value){return value;}).join(' ') @>">
    </th>
    <th>
      <a href="/tatami/profile/<@= status.username @>/" class="userStatus pull-left" title="<fmt:message key="tatami.user.profile.show"/> <@= ['@' + status.username,status.firstName,status.lastName].filter(function(value){return value;}).join(' ') @>">
        <@= [status.firstName,status.lastName].filter(function(value){return value;}).join(' ') @> <em>@<@= status.username @></em>
      </a>
      <p class="pull-right" style="width: 50px"><abbr class="timeago" title="<@= status.iso8601StatusDate @>"><@= status.prettyPrintStatusDate @></abbr></p>
      <div class="pull-right status-actions">
        <@ if (!discuss && status.detailsAvailable) { @>
        <a class="status-action-details">
           <i class="icon-search"></i><fmt:message key="tatami.user.status.details"/>
        </a>
        <@ } @>
        <a href="/tatami/profile/<@=status.username@>/#/status/<@= status.statusId @>">
          <i class="icon-eye-open"></i><fmt:message key="tatami.user.status.show"/>
        </a>
        <a class="status-action-reply">
              <i class="icon-share-alt"></i><fmt:message key="tatami.user.status.reply"/>
        </a>
          <@ if (status.username != authenticatedUsername && status.statusPrivate == false) { @>
            <a class="status-action-share" data-content="<fmt:message key="tatami.user.status.share.success"/>">
                <i class="icon-retweet"></i><fmt:message key="tatami.user.status.share"/>
            </a>
          <@ } @>
        <a class="status-action-favorite">
          <i class="icon-star<@ if (status.favorite === false) { @>-empty<@ } @>"></i><fmt:message key="tatami.user.status.favorite"/>
        </a>
          <@ if (status.username == authenticatedUsername) { @>
            <a class="status-action-remove">
                <i class="icon-trash"></i><fmt:message key="tatami.user.status.delete"/>
            </a>
          <@ } @>
      </div>
    </th>
  </tr>
  <tr>
      <td>
          <div class="well status-content fixFFmax-width"><@=status.markdown@></div>
      </td>
  </tr>
  <tr>
      <td>
          <@ if (status.attachments != null) { @>
              <@ _.each(status.attachments, function(attachment) { @>
                  <i class="icon-file"/> <a class="" href="/tatami/file/<@= attachment.attachmentId @>/<@= attachment.filename @>" target="_blank"><@= attachment.filename @></a>
                    (<@ if (attachment.size < 1000000) { @><@= (attachment.size / 1000).toFixed(0) @>K<@ } else { @><@= (attachment.size / 1000000).toFixed(2) @>M<@ } @>)<br/>
              <@ }); @>
          <@ } @>
      </td>
  </tr>
  <tr>
      <td>
          <@ if (status.groupId != null) { @>
              <a href="/tatami/#/groups/<@= status.groupId @>">
              <@ if (status.publicGroup === true) { @>
                          <span class="label label-warning"><@= status.groupName @></span>
              <@ } else { @>
                          <span class="label label-info"><@= status.groupName @></span>
              <@ } @>
              </a>
          <@ } @>

          <@ if (status.statusPrivate == true) { @>
            <span class="userStatus-info"><i class="icon-lock"></i> <fmt:message key="tatami.status.private"/></span>&nbsp;
          <@ } @>

          <@ if (status.sharedByUsername != null) { @>
                 <a href="/tatami/profile/<@= status.sharedByUsername @>/" class="userStatus-info"><i class="icon-retweet"></i> <fmt:message key="tatami.user.status.shared.by"/> <em>@<@= status.sharedByUsername @></em></a>
           <@ } @>

          <@ if (status.replyTo != '') { @>
                <a href="/tatami/profile/<@= status.replyToUsername @>/#/status/<@= status.replyTo @>" class="userStatus-info"><i class="icon-share-alt"></i> <fmt:message key="tatami.user.status.replyto"/> <em>@<@= status.replyToUsername @></em></a>
          <@ } @>
      </td>
  </tr>
  <tr>
      <td>
          <@ if (status.discuss === true) { @>
          <form class="reply-form">
              <div><fmt:message key="tatami.status.reply"/></div>
              <fieldset>
                  <div class="control-group">
		    <div class="tabbable">
		      <ul class="nav nav-tabs replyEditorTab" >
			<li class="active"><a data-pane=".replyEditPane" data-toggle="tab"><fmt:message key="tatami.status.editor"/></a></li>
			<li><a data-pane=".replyPreviewPane" data-toggle="tab"><fmt:message key="tatami.status.preview"/></a></li>
		     </ul>
		    <div class="tab-content fixFFmax-width">
		      <div class="tab-pane active replyEditPane">
	
			<textarea class="reply span12 replyEdit" required="required" maxlength="750"
                                name="content">@<@= status.username @> </textarea>
		      </div>
		      <div class="tab-pane replyPreviewPane">
			<p class="well status-content fixFFmax-width replyPreview"></p>
		      </div>
		    </div>  
                  </div>
                  <div>
                      <input type='submit' class="span12 btn btn-primary"
                             value="<fmt:message key="tatami.status.reply.action"/>"/>
                  </div>
              </fieldset>
          </form>
          <@ } else { @>
          <div></div>
          <@ } @>
      </td>
  </tr>
</script>

<script type="text/template" id="timeline-share">
  <div  class="alert-shares">
  <table>
  <tr>
    <td class="well" width="50px">
      <div class="share-title"><fmt:message key="tatami.timeline.shares"/></div>
      <div class="share-number"><@= count @></div>
    </td>
    <td class="well">
        <div class="shares-list"></div>
    </td>
  </tr>
  </table>
  </div>
</script>

<script type="text/template" id="timeline-share-item">
  <@ if (profile) { @>
    <a href="/tatami/profile/<@= profile.username @>/"><img class="avatar avatar-small" src="https://www.gravatar.com/avatar/<@= profile.gravatar @>?s=64&d=mm" alt="<@= [profile.firstName,profile.lastName].filter(function(value){return value;}).join(' ') @>"></a>
  <@ } else { @>
    <a href="/tatami/profile/<@= username @>/"><@= username @></a> 
  <@ } @>
</script>

<script type="text/template" id="timeline-new">
    <button type='submit' class="btn btn-block margin-bottom5"><fmt:message key="tatami.timeline.refresh"/><@ if(typeof status !== 'undefined' && status > 0) { @> (<@= status @>)<@ } @></button>
</script>

<script type="text/template" id="timeline-next">
    <button type='submit' class="btn btn-block margin-bottom5"><fmt:message key="tatami.timeline.next"/></button>
</script>

<script type="text/template" id="timeline-progress">
  <div class="status text-center alert alert-info">
    <div class="progress progress-striped active">
      <div class="bar" style="width: 100%;"></div>
    </div>
  </div>
</script>

<script type="text/template" id="follow-button">
  <span class="btn btn-block input-block-level"><fmt:message key="tatami.user.follow"/></span>
</script>

<script type="text/template" id="followed-button">
  <span class="btn btn-primary btn-block input-block-level"><fmt:message key="tatami.user.followed"/></span>
</script>

<script type="text/template" id="edit-profile">
  <span class="btn btn-primary btn-info input-block-level"><fmt:message key="tatami.user.profile.edit"/></span>
</script>

<script type="text/template" id="user-item">
  <div class="alert alert-status">
    <div class="row-fluid">
      <div class="span12">
        <a href="/tatami/profile/<@= user.username @>/" class="userStatus" title="Show profile of <@= ['@'+user.username,user.firstName,user.lastName].filter(function(value){return value;}).join(' ') @>"><img class="avatar avatar-small" src="https://www.gravatar.com/avatar/<@= user.gravatar @>?s=64&d=mm" alt="<@= [user.firstName,user.lastName].filter(function(value){return value;}).join(' ') @>">
            <@= user.firstName @> <@= user.lastName @> <em>@<@= user.username @></em>
        </a>
      </div>    
    </div>
  </div>
</script>

<script type="text/template" id="status-delete-popup">
  <fmt:message key="tatami.user.status.confirm.delete"/>
</script>

<script type="text/template" id="trends-template">

</script>

<script type="text/template" id="trends-template-item">
  <li>
     <a href="/tatami/#/tags/<@= trend.tag @>" class="trends">
     #<@= trend.tag @> <i class="<@ if (trend.trendingUp === true) { @>icon-arrow-up<@ } else { @>icon-arrow-down<@ } @>"/>
     </a>
  </li>
</script>

<script type="text/template" id="welcome">
  <div class="modal-header">
    </div>
    <div class="modal-body">
    </div>
    <div class="modal-footer">
      <@ if (previous) { @><input type="button" class="pull-left" value="<fmt:message key="tatami.form.previous"/>"/><@ } @>
      <@ if (next) { @><input type="button" class="pull-right" value="<fmt:message key="tatami.form.next"/>"/><@ } @>
      <@ if (finish) { @><input type="button" class="pull-right" value="<fmt:message key="tatami.form.finish"/>"/><@ } @>
    </div>
</script>

<script type="text/template" id="welcome-profile-header">
  <h2><fmt:message key="tatami.welcome.profile.header.title"/></h2>
  <p><fmt:message key="tatami.welcome.profile.header.description"/></p>
</script>

<script type="text/template" id="welcome-profile">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="firstName"><fmt:message key="tatami.user.firstName"/></label>
      <div class="controls">
        <input type="text" class="input-block-level" name="firstName" placeholder="<fmt:message key="tatami.user.firstName"/>" value="<@= firstName @>">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="lastName"><fmt:message key="tatami.user.lastName"/></label>
      <div class="controls">
        <input type="text" class="input-block-level" name="lastName" placeholder="<fmt:message key="tatami.user.lastName"/>" value="<@= lastName @>">
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="jobTitle"><fmt:message key="tatami.user.jobTitle"/></label>
      <div class="controls">
        <input type="text" class="input-block-level" name="jobTitle" placeholder="<fmt:message key="tatami.user.jobTitle"/>" value="<@= jobTitle @>">
      </div>
    </div>
  </fieldset>
</script>

<script type="text/template" id="welcome-profile-error">
  <div class="alert alert-error">
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    <fmt:message key="tatami.welcome.profile.error"/>
  </div>
</script>

<script type="text/template" id="welcome-tags-header">
  <h2><fmt:message key="tatami.welcome.tags.header.title"/></h2>
  <p><fmt:message key="tatami.welcome.tags.header.description"/></p>
</script>

<script type="text/template" id="welcome-tags-success">
  <div class="alert alert-success">
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    Success : <@= name @>
  </div>
</script>

<script type="text/template" id="welcome-tags-error">
  <div class="alert alert-error">
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    Error : <@= name @>
  </div>
</script>

<script type="text/template" id="welcome-friends-header">
  <h2><fmt:message key="tatami.welcome.friends.header.title"/></h2>
  <p><fmt:message key="tatami.welcome.friends.header.description"/></p>
</script>

<script type="text/template" id="welcome-friends-body">
  <fieldset>
    <div class="control-group">
      <label class="control-label" for="mails"><fmt:message key="tatami.welcome.friends.body.emails"/></label>
      <div class="controls">
        <textarea class="input-block-level" name="mails" placeholder="<fmt:message key="tatami.welcome.friends.body.emails"/>" />
      </div>
    </div>
    <ul>
    </ul>
  </fieldset>
</script>

<script type="text/template" id="welcome-friends-error">
  <div class="alert alert-error">
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    <@= email @> : <@ if(status === 400) { @>
      <fmt:message key="tatami.welcome.friends.error.400"/>
    <@ } else if (status === 404) { @>
      <fmt:message key="tatami.welcome.friends.error.404"/>
    <@ } else { @>
      <fmt:message key="tatami.welcome.friends.error.unknown"/>
    <@ } @>
  </div>
</script>

<script type="text/template" id="usergroup-header">
    <tr>
        <th><fmt:message key="tatami.username"/></th>
        <th><fmt:message key="tatami.user.lastName"/></th>
        <th><fmt:message key="tatami.group.role"/></th>
    </tr>
</script>

<script type="text/template" id="usergroup-item">
    <td style="text-align: left">
        <img class="avatar avatar-small" src="https://www.gravatar.com/avatar/<@=gravatar@>?s=32&d=mm" alt="<@= [firstName,lastName].filter(function(value){return value;}).join(' ') @>">
        <a href="/tatami/profile/<@= username @>/">
            <@= username @>
        </a>
    </td>
    <td>
        <@= [firstName,lastName].filter(function(value){return value;}).join(' ') @>
    </td>
    <td>
        <@ if(role === 'ADMIN'){ @>
            <fmt:message key="tatami.group.role.admin"/>
        <@ } else { @>
            <fmt:message key="tatami.group.role.member"/>
        <@ } @>
    </td>
    <@ if(admin){ @>
        <td>
            <@ if (window.username !== username) { @>
                <button type="button" class="btn btn-success input-block-level delete">
                    <fmt:message key="tatami.group.edit.member.delete"/>
                </button>
            <@ } @>
        </td>
    <@ } @>
</script>
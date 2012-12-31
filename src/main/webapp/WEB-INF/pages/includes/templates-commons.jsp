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
        <img class="avatar" src="https://www.gravatar.com/avatar/<@=status.gravatar@>?s=64&d=mm" alt="<@=status.firstName@> <@=status.lastName@>">
    </th>
    <th>
      <a href="/tatami/profile/<@= status.username @>/" class="userStatus pull-left" title="<fmt:message key="tatami.user.profile.show"/> <@= status.firstName @> <@=status.lastName@> @<@= status.username @>">
        <@= status.firstName @> <@= status.lastName @> <em>@<@= status.username @></em>
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
          <div class="well status-content"><@=status.markdown@></div>
      </td>
  </tr>
  <tr>
      <td>
          <@ if (status.attachments != null) { @>
              <@ _.each(status.attachments, function(attachment) { @>
                  <i class="icon-file"/> <a href="/tatami/file/<@= attachment.attachmentId @>/" target="_blank"><@= attachment.filename @></a>
                    (<@ if (attachment.size < 1000000) { @><@= (attachment.size / 1000).toFixed(0) @>K<@ } else { @><@= (attachment.size / 1000000).toFixed(2) @>M<@ } @>)
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
                      <textarea class="reply span12" required="required" maxlength="750"
                                name="content">@<@= status.username @> </textarea>
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
    <a href="/tatami/profile/<@= profile.username @>/"><img class="avatar avatar-small" src="https://www.gravatar.com/avatar/<@= profile.gravatar @>?s=64&d=mm" alt="<@= profile.firstName @> <@= profile.lastName @>"></a>
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
  <span class="btn btn-mini"><fmt:message key="tatami.user.follow"/></span>
</script>

<script type="text/template" id="followed-button">
  <span class="btn btn-mini btn-primary"><fmt:message key="tatami.user.followed"/></span>
</script>

<script type="text/template" id="edit-profile">
  <a href="/tatami/account"><fmt:message key="tatami.user.profile.edit"/></a>
</script>

<script type="text/template" id="user-item">
  <div class="alert alert-info">
    <div class="row-fluid">
      <div class="span12">
        <a href="/tatami/profile/<@= user.username @>/" class="userStatus" title="Show profile of @<@= user.username @> <@= user.firstName @> <@= user.lastName @>"><img class="avatar avatar-small" src="https://www.gravatar.com/avatar/<@= user.gravatar @>?s=64&d=mm" alt="<@= user.firstName @> <@= user.lastName @>">
          <@=user.firstName@> <@=user.lastName@> <em>@<@=user.username@></em>
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

<script type="text/template" id="search-tags">
    <li class="item tags" data-value="<@= tag @>"><a href="#"><@= tag @></a></li>
</script>

<script type="text/template" id="search-users">
    <li class="item users" data-value="<@= user @>"><img src="<@= img @>" width="30px" height="30px"><h4><a href="#"><@= fullname @></a></h4><p><@= user @></p></li>
</script>

<script type="text/template" id="search-groups">
    <li class="item groups" data-value="<@= group @>" rel="<@= id @>"><img src="<@= img @>" width="30px" height="30px"><h4><a href="#"><@= group @></a></h4><p><@= nb @> <fmt:message key="tatami.group.counter"/></p></li>
</script>

<script type="text/template" id="search-category">
    <li class="category <@= current @>"><@= category @></li>
</script>

<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="timeline-item">
  <div class="status alert  <@ if (discuss === true) { @> alert-discuss<@ } else { @> alert-info<@ } if (status.favorite === true) { @> favorite<@ } @>">
    <div class="row-fluid">
      <div class="statuses">
      </div>
      
      <div class="statuses-details">
        
        <blockquote class="discuss-details">
          <div class="discuss-before">
          </div>
          <div class="discuss-current">
          </div>
          <div class="discuss-after">
          </div>
        </blockquote>
        
        <blockquote class="shares">
        </blockquote>
      </div>
    </div>
  </div>
</script>

<script type="text/template" id="timeline-item-inner">
  <tr>
    <th rowspan="6">
        <img class="avatar" src="https://www.gravatar.com/avatar/<@=status.gravatar@>?s=64&d=mm" alt="<@=status.firstName@> <@=status.lastName@>">
    </th>
    <th>
      <a href="/tatami/profile/<@= status.username @>/" class="userStatus pull-left" title="<fmt:message key="tatami.user.profile.show"/><@= status.firstName @> <@=status.lastName@> @<@= status.username @>">
        <@= status.firstName @> <@= status.lastName @> <em>@<@= status.username @></em>
      </a>
      <p class="pull-right" style="width: 50px"><abbr class="timeago" title="<@= status.iso8601StatusDate @>"><@= status.prettyPrintStatusDate @></abbr></p>
      <div class="pull-right status-actions">
        <a href="/tatami/profile/<@=status.username@>/#/status/<@= status.statusId @>">
          <i class="icon-eye-open"></i><fmt:message key="tatami.user.status.show"/>
        </a>
        <@ if (!discuss && status.detailsAvailable) { @>
        <a class="status-action-details">
           <i class="icon-search"></i><fmt:message key="tatami.user.status.details"/>
        </a>
        <@ } @>
        <a class="status-action-reply">
              <i class="icon-share-alt"></i><fmt:message key="tatami.user.status.reply"/>
        </a>
          <@ if (status.username != authenticatedUsername) { @>
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
          <div class="well status-content"><@=status.content@></div>
      </td>
  </tr>
  <tr>
      <td>
          <@ if (status.sharedByUsername != null) { @>
            <div class="pull-right"><a href="/tatami/profile/<@= status.sharedByUsername @>/" class="userStatus-info"><i class="icon-retweet"></i> <fmt:message key="tatami.user.status.shared.by"/> <em>@<@= status.sharedByUsername @></em></a></div>
          <@ } @>
      </td>
  </tr>
  <tr>
      <td>
          <@ if (status.replyTo != '') { @>
          <div class="pull-right"><a href="/tatami/profile/<@= status.replyToUsername @>/#/status/<@= status.replyTo @>" class="userStatus-info"><i class="icon-share-alt"></i> <fmt:message key="tatami.user.status.replyto"/> <em>@<@= status.replyToUsername @></em></a></div>
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
                      <textarea class="span12" required="required" maxlength="500"
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
  <tr>
    <th class="well">
      <h5><fmt:message key="tatami.timeline.shares"/></h5>
      <h1><@= count @></h1>
    </th>
    <td class="well shares-list">
    </td>
  </tr>
</script>

<script type="text/template" id="timeline-share-item">
  <@ if (profile) { @>
    <a href="/tatami/profile/<@= profile.username @>/"><img class="avatar avatar-small" src="https://www.gravatar.com/avatar/<@= profile.gravatar @>?s=64&d=mm" alt="<@= profile.firstName @> <@= profile.lastName @>"></a>
  <@ } else { @>
    <a href="/tatami/profile/<@= username @>/"><@= username @></a> 
  <@ } @>
</script>

<script type="text/template" id="timeline-new">
    <div class="status text-center alert alert-info"><fmt:message key="tatami.timeline.refresh"/><@ if(typeof status !== 'undefined' && status > 0) { @> (<@= status @>)<@ } @></div>
</script>

<script type="text/template" id="timeline-next">
    <div class="status text-center alert alert-info"><fmt:message key="tatami.timeline.next"/></div>
</script>

<script type="text/template" id="timeline-progress">
  <div class="status text-center alert alert-info">
    <div class="progress progress-striped active">
      <div class="bar" style="width: 100%;"></div>
    </div>
  </div>
</script>

<script type="text/template" id="follow-button">
  <span class="btn"><fmt:message key="tatami.user.follow"/></span>
</script>

<script type="text/template" id="followed-button">
  <span class="btn btn-primary"><fmt:message key="tatami.user.followed"/></span>
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
    <td>
        <a href="/tatami/#/tags/<@= trend.tag @>" class="trends pull-left">
            #<@= trend.tag @> <i class="<@ if (trend.trendingUp === true) { @>icon-arrow-up<@ } else { @>icon-arrow-down<@ } @>"/>
        </a>
    </td>
</script>

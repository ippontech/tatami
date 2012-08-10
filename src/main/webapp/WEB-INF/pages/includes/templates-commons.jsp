<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="timeline-item">
  <@ if (status.favorite === true) { @>
    <div class="status alert alert-info favorite status-<@= status.statusId @>">
  <@ } else { @> 
    <div class="status alert alert-info status-<@= status.statusId @>">
  <@ } @>
    <div class="row-fluid">
      <table class="statuses">
          <tr>
            <th rowspan="3">
                <img class="span12 avatar" src="http://www.gravatar.com/avatar/<@=status.gravatar@>?s=64" alt="<@=status.firstName@> <@=status.lastName@>">
            </th>
            <th>
              <a href="/tatami/profile/<@= status.username @>/" class="userStatus pull-left" title="<fmt:message key="tatami.user.profile.show"/> @<@= status.username @> <@= status.firstName @> <@=status.lastName@>">
                <@= status.firstName @> <@= status.lastName @> <em>@<@= status.username @></em>
              </a>
              <p class="pull-right" style="width: 50px"><@= status.prettyPrintStatusDate @></p>
              <div class="pull-right status-actions">
                <a href="/tatami/profile/<@=status.username@>/#/status/<@= status.statusId @>" title="<fmt:message key="tatami.user.status.show"/>">
                  <i class="icon-eye-open"></i>
                </a>
                <a class="status-action-reply" title="<fmt:message key="tatami.user.status.reply"/>">
                      <i class="icon-pencil"></i>
                </a>
                <a class="status-action-share" title="<fmt:message key="tatami.user.status.share"/>">
                      <i class="icon-retweet"></i>
                </a>
                <a class="status-action-favorite" title="<fmt:message key="tatami.user.status.favorite"/>">
                  <i class="icon-star<@ if (status.favorite === false) { @>-empty<@ } @>"></i>
                </a>
                <a class="status-action-remove" title="<fmt:message key="tatami.user.status.delete"/>">
                  <i class="icon-remove"></i>
                </a>
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
                  <@ if (status.discuss === true) { @>
                  <div>
                      <div><fmt:message key="tatami.status.reply"/></div>
                      <fieldset>
                          <div class="control-group">
                              <textarea class="span12" required="required" maxlength="500"
                                        name="reply-content"><@= status.replyContent @></textarea>
                          </div>
                          <div>
                              <input type='submit' class="span12 btn btn-primary discussion-reply-button"
                                     value="<fmt:message key="tatami.status.reply.action"/>"/>
                          </div>
                      </fieldset>
                  </div>
                  <@ } else { @>
                  <div></div>
                  <@ } @>
              </td>
          </tr>
      </table>
    </div>
  </div>
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
  <span class="btn">Follow</span>
</script>

<script type="text/template" id="followed-button">
  <span class="btn btn-primary">Followed</span>
</script>

<script type="text/template" id="user-item">
  <div class="alert alert-info">
    <div class="row-fluid">
      <div class="span12">
        <a href="/tatami/profile/<@= user.username @>/" class="userStatus" title="Show profile of @<@= user.username @> <@= user.firstName @> <@= user.lastName @>"><img class="avatar avatar-small" src="http://www.gravatar.com/avatar/<@= user.gravatar @>?s=64" alt="<@= user.firstName @> <@= user.lastName @>">
          <@=user.firstName@> <@=user.lastName@> <em>@<@=user.username@></em>
        </a>
      </div>    
    </div>
  </div>
</script>

<script type="text/template" id="status-delete-popup">
  <fmt:message key="tatami.user.status.confirm.delete"/>
</script>
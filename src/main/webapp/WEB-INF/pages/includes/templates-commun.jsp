<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="timeline-item">
  <div class="nopadding nomargin">
    <a href="/tatami/profile/<@= status.username @>/" class="userStatus"  title="<fmt:message key="tatami.user.profile.show"/> @<@= status.username @> <@= status.firstName @> <@=status.lastName@>"><img class="avatar avatar-small" src="http://www.gravatar.com/avatar/<@=status.gravatar@>?s=64" alt="<@=status.firstName@> <@=status.lastName@>"/>
      <@=status.firstName@> <@=status.lastName@> <em>@<@=status.username@></em>
    </a>
    <p class="pull-right"><@=status.prettyPrintStatusDate@></p>
    <div class="pull-right status-actions">
      <a href="/tatami/profile/<@=status.username@>/#/status/<@= status.statusId @>">
        <i class="icon-eye-open"></i>
      </a>
      <a class="status-action-favoris">
      <i class="icon-star<@ if (status.favorite === false) { @>-empty<@ } @>"></i>
      </a>
      <a class="status-action-remove">
      <i class="icon-remove"></i>
      </a>
    </div>
  </div>
  <div class="well nopadding nomargin status-content"><@=status.content@></div>
</script>

<script type="text/template" id="timeline-new">
  <div class="text-center alert alert-info">New</div>
</script>

<script type="text/template" id="timeline-next">
  <div class="text-center alert alert-info">Next</div>
</script>

<script type="text/template" id="timeline-progress">
  <div class="text-center alert alert-info">
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
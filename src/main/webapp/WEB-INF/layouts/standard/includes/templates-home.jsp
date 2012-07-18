<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<script type="text/template" id="profile-infos">
  <div class="span12 text-center">
    <a href="/tatami/profile/<@= profile.username @>/" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
      <img class="pull-left nomargin avatar" src="http://www.gravatar.com/avatar/<@= profile.gravatar @>?s=64" alt="<@= profile.firstName @> <@= profile.lastName @>"/>
      <@=profile.firstName@> <@=profile.lastName@>
      <br/>
      @<@=profile.username@>
    </a>
  </div>
</script>

<script type="text/template" id="profile-stats">
<div class="well nopadding">
  <!-- For desktop -->
  <table class="table table-center visible-desktop nomargin">
  <thead>
  <tr>
  <th><fmt:message key="tatami.badge.status"/></th>
  <th><fmt:message key="tatami.badge.followed"/></th>
  <th><fmt:message key="tatami.badge.followers"/></th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td><span class="badge badge-info"><@= profile.statusCount @></span></td>
  <td><span class="badge badge-info"><@= profile.friendsCount @></span></td>
  <td><span class="badge badge-info"><@= profile.followersCount @></span></td>
  </tr>
  </tbody>
  </table>
  <!-- For tablet -->
  <table class="table table-right hidden-desktop nomargin">
    <thead>
      <tr>
        <th><fmt:message key="tatami.badge.status"/></th>
        <td><span class="badge badge-info"><@= profile.statusCount @></span></td>
      </tr>
    </thead>
    <tr>
      <th><fmt:message key="tatami.badge.followed"/></th>
      <td><span class="badge badge-info"><@= profile.friendsCount @></span></td>
    </tr>
    <tr>
      <th><fmt:message key="tatami.badge.followers"/></th>
      <td><span class="badge badge-info"><@= profile.followersCount @></span></td>
    </tr>
  </table>
</div>
</script>

<script type="text/template" id="profile-update">
  <fieldset class="span12 stretch">
    <div class="control-group">
      <textarea class="span12 stretch" required="required" placeholder="Update your status..." maxlength="500" name="content"></textarea>
    </div>
    <div>
      <input type='submit' class="span12 btn btn-primary" value="Update your status" />
    </div>
  </fieldset>
</script>

<script type="text/template" id="profile-follow-form">
  <!-- Follow another user -->
  <fieldset class="span12 stretch">
    <div>
      <label class="control-label"><i class="icon-zoom-in icon-white"></i>Follow another user...</label>
    </div>
    <div class="control-group">
      <input class="span12 input-xlarge" type="text" required="required" placeholder="Type the user name to follow..." name="username" />
    </div>
    <div>
      <input type='submit' class="span12 btn btn-primary" value="Follow" />
    </div>
  </fieldset>
</script>
<script type="text/template" id="profile-follow-suggest">
  <!-- Follow another user -->
  <div class="row-fluid">
      <div class="well nopadding">
          <table class="table nomargin">
              <thead>
                  <tr>
                      <th>
                          <i class="icon-random icon-white"></i> <strong>Who to follow</strong>
                      </th>
                  </tr>
              </thead>
              <tbody id="follow-suggest">
              </tbody>
          </table>
      </div>
  </div>
</script>

<script type="text/template" id="profile-follow-suggest-empty">
  <td>No new user to follow today.</td>
</script>

<script type="text/template" id="profile-follow-suggest-item">
  <a href="/tatami/profile/<@= follow.username @>/" class="userStatus"  title="<fmt:message key="tatami.user.profile.show"/> @<@= follow.username @> <@= follow.firstName @> <@= follow.lastName @>"><img class="avatar avatar-small" src="http://www.gravatar.com/avatar/<@= follow.gravatar @>?s=64" alt="<@= follow.firstName @> <@= follow.lastName @>"/>
    <@= follow.firstName @> <@= follow.lastName @> <em>@<@= follow.username @></em>
  </a>
</script>

<script type="text/template" id="timeline-new">
  <div class="text-center alert alert-info">New</div>
</script>

<script type="text/template" id="favoris-refresh">
  <div class="text-center alert alert-info">Refresh</div>
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

<script type="text/template" id="tag-search-form">
  <div class="row-fluid">
    <input class="span12" name="search" value="<@= tag @>" type="text" placeholder="tag">
  </div>
</script>

<script type="text/template" id="search-search-form">
  <div class="row-fluid">
    <input class="span12" name="search" value="<@= search @>" type="text" placeholder="search">
  </div>
</script>
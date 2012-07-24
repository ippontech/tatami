<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<script type="text/template" id="profile-infos">
  <div class="span12 text-center">
    <a href="/tatami/profile/<@= profile.username @>/" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
      <img class="pull-left nomargin avatar" src="http://www.gravatar.com/avatar/<@= profile.gravatar @>?s=64" alt="<@= profile.firstName @> <@= profile.lastName @>"/>
      <h3><@=profile.firstName@> <@=profile.lastName@></h3>
      @<@=profile.username@>
    </a>
  </div>
</script>

<script type="text/template" id="profile-stats">
<div class="row-fluid hidden-phone">
  <div class="well nopadding">
    <!-- For desktop -->
    <table class="table table-center visible-desktop nomargin">
      <thead>
        <tr>
          <th>
            <a href="/tatami/profile/<@= profile.username @>/#/status" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
              <fmt:message key="tatami.badge.status"/>
            <a>
          </th>
          <th>
            <a href="/tatami/profile/<@= profile.username @>/#/followed" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
              <fmt:message key="tatami.badge.followed"/>
            <a>
            </th>
          <th>
            <a href="/tatami/profile/<@= profile.username @>/#/followers" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
              <fmt:message key="tatami.badge.followers"/>
            <a>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <a href="/tatami/profile/<@= profile.username @>/#/status" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
              <span class="badge badge-info"><@= profile.statusCount @></span>
            <a>
          </td>
          <td>
            <a href="/tatami/profile/<@= profile.username @>/#/followed" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
              <span class="badge badge-info"><@= profile.friendsCount @></span>
            </a>
          </td>
          <td>
            <a href="/tatami/profile/<@= profile.username @>/#/followers" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
              <span class="badge badge-info"><@= profile.followersCount @></span>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- For tablet -->
    <table class="table table-right hidden-desktop nomargin">
      <thead>
        <tr>
          <th>
            <a href="/tatami/profile/<@= profile.username @>/#/status" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
              <fmt:message key="tatami.badge.status"/>
            </a>
          </th>
          <td>
            <a href="/tatami/profile/<@= profile.username @>/#/status" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
              <span class="badge badge-info"><@= profile.statusCount @></span>
            </a>
          </td>
        </tr>
      </thead>
      <tr>
        <th>
          <a href="/tatami/profile/<@= profile.username @>/#/followed" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
            <fmt:message key="tatami.badge.followed"/>
          </a>
        </th>
        <td>
          <a href="/tatami/profile/<@= profile.username @>/#/followed" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
            <span class="badge badge-info"><@= profile.friendsCount @></span>
          </a>
        </td>
      </tr>
      <tr>
        <th>
          <a href="/tatami/profile/<@= profile.username @>/#/followers" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
            <fmt:message key="tatami.badge.followers"/>
          </a>
        </th>
        <td>
          <a href="/tatami/profile/<@= profile.username @>/#/followers" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
            <span class="badge badge-info"><@= profile.followersCount @></span>
          </a>
        </td>
      </tr>
    </table>
  </div>
</div>
</script>

<script type="text/template" id="profile-update">
  <fieldset class="span12">
    <div class="control-group">
      <textarea class="span12" required="required" placeholder="Update your status..." maxlength="500" name="content"></textarea>
    </div>
    <div>
      <input type='submit' class="span12 btn btn-primary" value="Update your status" />
    </div>
  </fieldset>
</script>

<script type="text/template" id="profile-follow-form">
  <!-- Follow another user -->
  <fieldset class="span12">
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
  <div class="status text-center alert alert-info">New</div>
</script>

<script type="text/template" id="favoris-refresh">
  <div class="status text-center alert alert-info">Refresh</div>
</script>

<script type="text/template" id="timeline-next">
  <div class="status text-center alert alert-info">Next</div>
</script>

<script type="text/template" id="timeline-progress">
  <div class="status text-center alert alert-info">
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
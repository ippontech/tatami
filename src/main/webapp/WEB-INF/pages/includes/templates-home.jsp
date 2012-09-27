<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<script type="text/template" id="profile-infos">
  <div class="span12 text-center">
    <a href="/tatami/profile/<@= profile.username @>/" title="<fmt:message key="tatami.user.profile.show"/> @<@= profile.username @> <@= profile.firstName @> <@= profile.lastName @>">
      <img class="pull-left avatar" src="https://www.gravatar.com/avatar/<@= profile.gravatar @>?s=64&d=mm" alt="<@= profile.firstName @> <@= profile.lastName @>"/>
      <h4><@=profile.firstName@> <@=profile.lastName@></h4>
      @<@=profile.username@>
    </a>
  </div>
</script>

<script type="text/template" id="profile-stats">
<div class="row-fluid hidden-phone">
  <div class="well">
    <div class="row-fluid">
      <table class="table table-center">
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
    </div>
  </div>
</div>
</script>

<script type="text/template" id="update-template">
  <fieldset class="span12">
    <div class="control-group">
      <textarea id="updateStatusContent" class="span12" required="required" placeholder="<fmt:message key="tatami.status.update"/>..." maxlength="500" name="content"></textarea>
      <span id="contentHelp" class="pull-right" title="<fmt:message key="tatami.status.help.title"/>" data-content="<fmt:message key="tatami.status.help"/>"><i class="icon-question-sign"></i> <fmt:message key="tatami.status.help.title"/></span>
    </div>
    <div>
      <button id="updateStatusBtn" type='submit' class="btn btn-primary btn-block" data-content="<fmt:message key="tatami.status.update.success"/>"><fmt:message key="tatami.status.update"/></button>
    </div>
  </fieldset>
</script>

<script type="text/template" id="profile-find-form">
  <!-- Find another user -->
  <fieldset class="span12">
    <div>
      <label><i class="icon-zoom-in"></i> <fmt:message key="tatami.find.title"/></label>
    </div>
    <div class="control-group">
      <input id="findUsername" class="span12 input-xlarge" type="text" required="required" placeholder="<fmt:message key="tatami.find.username"/>..." name="username" data-provide="typeahead"  autocomplete="off"/>
    </div>
    <div>
      <button type='submit' class="btn btn-primary btn-block"><fmt:message key="tatami.find.action"/></button>
    </div>
  </fieldset>
</script>

<script type="text/template" id="profile-follow-suggest">
  <div class="row-fluid">
      <div class="well">
          <table class="table table-center" id="follow-suggest">
              <thead>
                  <tr>
                      <th>
                          <i class="icon-random"></i> <strong><fmt:message key="tatami.follow.suggestions"/></strong>
                      </th>
                  </tr>
              </thead>
          </table>
      </div>
  </div>
</script>

<script type="text/template" id="profile-follow-suggest-empty">
  <tr>
    <td><span class="pull-left"><fmt:message key="tatami.follow.nobody"/></span></td>
  </tr>
</script>

<script type="text/template" id="profile-follow-suggest-item">
  <td>
    <a href="/tatami/profile/<@= follow.username @>/" class="userStatus pull-left" title="<fmt:message key="tatami.user.profile.show"/> @<@= follow.username @> <@= follow.firstName @> <@= follow.lastName @>"><img class="avatar avatar-small" src="https://www.gravatar.com/avatar/<@= follow.gravatar @>?s=64&d=mm" alt="<@= follow.firstName @> <@= follow.lastName @>"/>
      <@= follow.firstName @> <@= follow.lastName @> <em>@<@= follow.username @></em>
    </a>
  </td>
</script>

<script type="text/template" id="favorite-refresh">
  <div class="status text-center alert alert-info"><fmt:message key="tatami.timeline.refresh"/></div>
</script>

<script type="text/template" id="mention-refresh">
    <div id="mentionRefresh" class="status text-center alert alert-info"><fmt:message key="tatami.timeline.refresh"/></div>
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
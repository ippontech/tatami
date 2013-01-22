<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="profile-update">
  <fieldset class="span12">
    <div class="control-group">
      <textarea id="updateStatusContent" class="span12" required="required" placeholder="<fmt:message key="tatami.status.update"/>..." maxlength="750" name="content">@${user.username} </textarea>
    </div>
      <div id="statusUpdate" data-content="<fmt:message key="tatami.status.update.success"/>"/>
    <div>
      <button id="updateStatusBtn" type='submit' class="btn btn-primary btn-block"><fmt:message key="tatami.status.update.to"/></button>
    </div>
  </fieldset>
</script>

<script type="text/template" id="user-follow-me">
    <span class="label"><fmt:message key="tatami.user.follows.you"/></span>
</script>

<script type="text/template" id="profile-stats-template">
  <thead>
    <tr>
      <th>
        <a href="/tatami/profile/<@= profile.username @>/#/status" title="<fmt:message key="tatami.user.profile.show"/> <@= ['@'+profile.username,profile.firstName,profile.lastName].filter(function(value){return value;}).join(' ') @>">
          <fmt:message key="tatami.badge.status"/>
        <a>
      </th>
      <th>
        <a href="/tatami/profile/<@= profile.username @>/#/followed" title="<fmt:message key="tatami.user.profile.show"/> <@= ['@'+profile.username,profile.firstName,profile.lastName].filter(function(value){return value;}).join(' ') @>">
          <fmt:message key="tatami.badge.followed"/>
        <a>
      </th>
      <th>
        <a href="/tatami/profile/<@= profile.username @>/#/followers" title="<fmt:message key="tatami.user.profile.show"/> <@= ['@'+profile.username,profile.firstName,profile.lastName].filter(function(value){return value;}).join(' ') @>">
          <fmt:message key="tatami.badge.followers"/>
        <a>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <a href="/tatami/profile/<@= profile.username @>/#/status" title="<fmt:message key="tatami.user.profile.show"/> <@= ['@'+profile.username,profile.firstName,profile.lastName].filter(function(value){return value;}).join(' ') @>">
            <@ if(profile.statusCount != 0) { @>
            <span class="badge badge-info"><@= profile.statusCount @></span>
            <@ } else { @>
            <span class="badge"><@= profile.statusCount @></span>
            <@ } @>
        <a>
      </td>
      <td>
        <a href="/tatami/profile/<@= profile.username @>/#/followed" title="<fmt:message key="tatami.user.profile.show"/> <@= ['@'+profile.username,profile.firstName,profile.lastName].filter(function(value){return value;}).join(' ') @>">
            <@ if(profile.friendsCount != 0) { @>
            <span class="badge badge-info"><@= profile.friendsCount @></span>
            <@ } else { @>
            <span class="badge"><@= profile.friendsCount @></span>
            <@ } @>
        </a>
      </td>
      <td>
        <a href="/tatami/profile/<@= profile.username @>/#/followers" title="<fmt:message key="tatami.user.profile.show"/> <@= ['@'+profile.username,profile.firstName,profile.lastName].filter(function(value){return value;}).join(' ') @>">
            <@ if(profile.followersCount != 0) { @>
            <span class="badge badge-info"><@= profile.followersCount @></span>
            <@ } else { @>
            <span class="badge"><@= profile.followersCount @></span>
            <@ } @>
        </a>
      </td>
    </tr>
  </tbody>
</script>
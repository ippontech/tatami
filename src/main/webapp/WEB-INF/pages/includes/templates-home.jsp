<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<script type="text/template" id="profile-infos-template">
  <div class="span12 profile-infos avatar-float-left-container">
    <a href="/tatami/profile/<@= profile.username @>/" title="<fmt:message key="tatami.user.profile.show"/> <@= ['@'+profile.username].filter(function(value){return value;}).join(' ') @>">
      <img class="pull-left avatar avatar-float-left" src="https://www.gravatar.com/avatar/<@= profile.gravatar @>?s=64&d=mm" alt="<@= [profile.firstName,profile.lastName].filter(function(value){return value;}).join(' ') @>"/>
      <h4><@= [profile.firstName,profile.lastName].filter(function(value){return value;}).join(' ') @></h4>
      @<@=profile.username@>
    </a>
  </div>
</script>

<script type="text/template" id="profile-stats-template">
<div class="row-fluid hidden-phone">
  <div class="well box-info">
    <div class="row-fluid">
      <table class="table profile-infos">
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
      </table>
    </div>
  </div>
</div>
</script>

<script type="text/template" id="update-template">
  <fieldset class="span12">
    <div class="control-group">
      <div class="tabbable">
        <ul id="updateStatusEditorTab" class="nav nav-tabs" >
	  <li class="active"><a href="#updateStatusEditPane" id="updateStatusEditTab" data-toggle="tab"><fmt:message key="tatami.status.editor"/></a></li>
	  <li><a href="#updateStatusPreviewPane" id="updateStatusPreviewTab" data-toggle="tab"><fmt:message key="tatami.status.preview"/></a></li>
	</ul>
	<div class="tab-content fixFFmax-width">
	  <div class="tab-pane active" id="updateStatusEditPane">
	    <textarea id="updateStatusContent" class="span12" required="required" placeholder="<fmt:message key="tatami.status.update"/>..." maxlength="750" name="content"></textarea>
	    <span id="contentHelp" class="pull-right" title="<fmt:message key="tatami.status.help.title"/>" data-content="<fmt:message key="tatami.status.help"/>"><i class="icon-question-sign"></i> <fmt:message key="tatami.status.help.title"/></span>
	  </div>
	  <div class="tab-pane fixFFmax-width" id="updateStatusPreviewPane">
	    <p id="updateStatusPreview" class="well status-content"></p>
	  </div>
	</div>
      </div>
    </div>
    <div id="statusUpdate" data-content="<fmt:message key="tatami.status.update.success"/>"/>
    <div id="contentGroup" class="control-group"><i class="icon-th"/> <fmt:message key="tatami.group.name"/> :&nbsp;
        <select class="btn-block" id="updateStatusGroup" name="groupId">
            <option value=""></option>
            <@ groupsCollection.each(function(group) { @>
                <@ if (group.get('archivedGroup') == false) { @>
                  <option value="<@= group.get('groupId') @>"><@= group.get('name') @></option>
                <@ } @>
            <@ }); @>
        </select>
    </div>
    <div>
        <div id="attachmentBar" class="progress progress-striped active" style="display: none;">
            <div class="bar" style="width: 0%;"></div>
        </div>
        <div id="dropzone" class="fade well"><fmt:message key="tatami.status.update.drop.file"/></div>
        <input id="updateStatusFileupload" type="file" name="uploadFile" data-url="/tatami/rest/fileupload" multiple/>
        <div id="fileUploadResults">

        </div>
    </div>
    <div id="updateStatusPrivate" class="control-group">
      <label class="checkbox">
          <input id="statusPrivate" name="statusPrivate" type="checkbox" value="true"> <i class="icon-lock"></i> <fmt:message key="tatami.status.private"/>
      </label>
    </div>
    <div class="control-group" id="updateStatusBtns">
        <button id="updateStatusBtn" type='submit' class="btn btn-primary btn-block"><fmt:message key="tatami.status.update"/></button>
    </div>
  </fieldset>
</script>

<script type="text/template" id="profile-find-form">
  <fieldset class="span12">
    <div>
      <label><i class="icon-zoom-in"></i> <fmt:message key="tatami.find.title"/></label>
    </div>
    <div class="control-group">
      <input id="findUsername" class="span12 input-xlarge" type="text" required="required" placeholder="<fmt:message key="tatami.find.username"/>..." name="username" data-provide="typeahead"  autocomplete="off"/>
    </div>
    <div>
      <button type='submit' class="btn btn-block"><fmt:message key="tatami.find.action"/></button>
    </div>
  </fieldset>
</script>

<script type="text/template" id="profile-online-users">
    <div class="row-fluid">
        <i class="icon-map-marker"></i> <strong><fmt:message key="tatami.who.is.online.title"/></strong>
        <div class="row-fluid">
            <div class="well">
                <table class="table" id="online-users-list">
                </table>
            </div>
        </div>
    </div>
</script>

<script type="text/template" id="profile-follow-suggest">
  <div class="row-fluid">
      <i class="icon-random"></i> <strong><fmt:message key="tatami.follow.suggestions"/></strong>
      <div class="row-fluid">
          <div class="well">
              <table class="table" id="follow-suggest">
              </table>
          </div>
      </div>
  </div>
</script>

<script type="text/template" id="profile-user-list-empty">
  <tr>
    <td><span class="pull-left"><fmt:message key="tatami.follow.nobody"/></span></td>
  </tr>
</script>

<script type="text/template" id="profile-user-list-item">
  <td>
    <a href="/tatami/profile/<@= follow.username @>/" class="userStatus pull-left">
      <em>@<@= follow.username @></em>
    </a>
  </td>
</script>

<script type="text/template" id="favorite-refresh">
    <button type='submit' class="btn btn-block"><fmt:message key="tatami.timeline.refresh"/></button>
</script>

<script type="text/template" id="mention-refresh">
    <button id="mentionRefresh" type='submit' class="btn btn-block margin-bottom5"><fmt:message key="tatami.timeline.refresh"/></button>
</script>

<script type="text/template" id="tag-refresh">
    <button id="tagRefresh" type='submit' class="btn btn-block margin-bottom5"><fmt:message key="tatami.timeline.refresh"/></button>
</script>

<script type="text/template" id="timeline-progress">
  <div class="status text-center alert alert-info">
    <div class="progress progress-striped active">
      <div class="bar" style="width: 100%;"></div>
    </div>
  </div>
</script>

<script type="text/template" id="group-details">
    <div class="well" style="padding: 0px;">
        <@ if (group.get('name') != undefined) { @>
        <div class="row-fluid">
          <h2 class="text-center">
            <@= group.get('name') @>
          </h2>
          <table class="table profile-infos">
              <tr>
                  <th>
                      <fmt:message key="tatami.group.add.access"/>
                  </th>
                  <th>
                      <a data-toggle="modal" data-target="#group-list-member" data-background=false class="btn-link">
                        <fmt:message key="tatami.group.counter"/>
                      </a>
                  </th>
                  <th>
                      Status
                  </th>
              </tr>
              <tr>
                  <td>
                      <@ if (group.get('publicGroup') === true) { @>
                          <span class="label label-warning"><fmt:message
                                  key="tatami.group.add.public"/></span>
                                      <@ } else { @>
                          <span class="label label-info"><fmt:message
                                  key="tatami.group.add.private"/></span>
                      <@ } @>
                  </td>
                  <td>
                      <a data-toggle="modal" data-target="#group-list-member" data-background=false class="btn-link">
                          <span class="badge badge-info">
                              <@= group.get('counter') @>
                          </span>
                      </a>
                      <div id="group-list-member" class="modal hide fade">
                          <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>
                              <h3 id="myModalLabel"><fmt:message
                                  key="tatami.group.members.list"/></h3>
                          </div>
                          <div class="modal-body">
                          </div>
                          <div class="modal-footer">
                              <button class="btn" data-dismiss="modal" aria-hidden="true"><fmt:message key="tatami.login.modal.timeout.close"/></button>
                          </div>
                      </div>
                  </td>
                  <td class="bouton-join-group"/>
              </tr>
          </table>
        </div>
        <@ } else { @>
           <h5>&nbsp;<fmt:message key="tatami.group.select"/></h5>
        <@ } @>
    </div>
</script>

<script type="text/template" id="group-list">
    <div class="row-fluid">
        <ul class="nav nav-stacked nav-pills">
            <@ groupsCollection.each(function(group) { @>
              <@ if (group.get('archivedGroup') == false) { @>
                <li id="group-list-<@= group.get('groupId') @>" class="<@= group.get('isActive') @>"><a href="#/groups/<@= group.get('groupId') @>"><i class="icon-chevron-right pull-right"/> <@= group.get('name') @></a></li>
              <@ } @>
            <@ }); @>
        </ul>
    </div>
</script>

<script type="text/template" id="tag-search-form-follow">
  <div class="row-fluid">
    <input class="span10" name="search" value="<@= tag @>" type="text" placeholder="<fmt:message key="tatami.tag"/>">
	<span id="tag-follow" class="btn pull-right"><fmt:message key="tatami.user.follow"/><span>
  </div>
</script>

<script type="text/template" id="tag-search-form-followed">
  <div class="row-fluid">
    <input class="span10" name="search" value="<@= tag @>" type="text" placeholder="<fmt:message key="tatami.tag"/>">
	<span id="tag-followed" class="btn btn-primary pull-right"><fmt:message key="tatami.user.followed"/><span>
  </div>
</script>

<script type="text/template" id="search-search-form">
  <div class="row-fluid">
    <input class="span12" name="search" value="<@= search @>" type="text" placeholder="search">
  </div>
</script>

<script type="text/template" id="button-join-group-join">
  <fmt:message key="tatami.group.join.group"/>
</script>
<script type="text/template" id="button-join-group-left">
  <fmt:message key="tatami.group.edit.quit"/>
</script>
<script type="text/template" id="button-join-group-admin">
  <fmt:message key="tatami.group.edit.link"/>
</script>
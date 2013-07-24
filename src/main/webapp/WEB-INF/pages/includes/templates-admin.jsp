<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>



<!--script type="text/template" id="form-success">
    <div class="alert alert-success">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <!fmt:message key="tatami.form.success"/>
    </div>
</script-->

<script type="text/template" id="form-success-label">
    <fmt:message key="tatami.form.success"/>
</script>

<!--script type="text/template" id="form-error">
    <div class="alert alert-danger">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <!fmt:message key="tatami.form.error"/>
    </div>
</script-->



<script type="text/template" id="form-error-label">
    <fmt:message key="tatami.form.error"/>
</script>

<script type="text/template" id="form-ldap">
    <fmt:message key="tatami.user.password.ldap"/>
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

<script type="text/template" id="account-profile" >
     <h2>
        <fmt:message key="tatami.account.update.title"/>
    </h2>
             </br>
    <fieldset class="form-horizontal row-fluid">
    <div class="control-group dashed">
        <label class="control-label">

        </label>

        <div class="controls">

            <div id="updateAvatar" class="dropzone well">
                <img class="nomargin avatar" src="<@= avatar @>" alt=""/>
                <p class=little-padding-top><fmt:message key="tatami.user.picture.button" /></p>
                <input id="avatarFile" type="file" name="uploadFile" data-url="/tatami/rest/fileupload/avatar"/>
            </div>
        </div>
    </div>
    </fieldset>

    <fieldset class="form-horizontal row-fluid">
        <legend>
            <fmt:message key="tatami.account.update.legend"/>
        </legend>

        <div class="control-group">
            <label class="control-label">
                <fmt:message key="tatami.user.email"/>
            </label>

            <div class="controls">
                <input name="login" type="text" disabled="true" class="col-span-12" value="<@= login @>"/>
            </div>
        </div>


        <div class="control-group">
            <label class="control-label" for="firstName">
                <fmt:message key="tatami.user.firstName"/>
            </label>

            <div class="controls">
                <input name="firstName" type="text" size="15" maxlength="40" class="input-xlarge col-span-12" value="<@= firstName @>"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="lastName">
                <fmt:message key="tatami.user.lastName"/>
            </label>

            <div class="controls">
                <input name="lastName" type="text" id="lastName" size="15" maxlength="40" class="input-xlarge col-span-12" value="<@= lastName @>"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="jobTitle">
                <fmt:message key="tatami.user.jobTitle"/>
            </label>

            <div class="controls">
                <input name="jobTitle" type="text" size="15" maxlength="100" class="input-xlarge col-span-12" value="<@= jobTitle @>"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="phoneNumber">
                <fmt:message key="tatami.user.phoneNumber"/>
            </label>

            <div class="controls">
                <input name="phoneNumber" type="text" size="10" maxlength="20" class="input-xlarge col-span-12" value="<@= phoneNumber @> "/>
            </div>
        </div>

        <div class="return"/>

        <div class="form-actions">
            <button type="submit" class="input-xlarge btn btn-primary btn-block">
                <fmt:message key="tatami.form.save"/>
            </button>
        </div>
    </fieldset>
</script>

<script type="text/template" id="account-destroy">
    <fieldset class="form-horizontal row-fluid">
        <legend><fmt:message key="tatami.user.suppress"/></legend>
        <div class="return"/>
        <div class="form-actions">
            <button type="submit" class="input-xlarge btn btn-danger btn-block" onclick="return(confirm('<fmt:message key="tatami.user.suppress.confirmation"/>'));">
                <fmt:message key="tatami.user.suppress"/>
            </button>
        </div>
    </fieldset>
</script>

<script type="text/template" id="account-users-menu">
    <h2>Annuaire des utilisateurs</h2>
    <div class="row-fluid">
        <button></button>
    </div>
</script>

<script type="text/template" id="account-preferences">
    <h2>
        <fmt:message key="tatami.menu.preferences"/>
    </h2>

        <legend>
            <fmt:message key="tatami.preferences.notifications"/>
        </legend>

        <div class="control-group">
            <div class="controls">
                <label class="checkbox">
                    <input name="mentionEmail" type="checkbox" <@   if(mentionEmail){ @> checked="true" <@ } @>/> <fmt:message key="tatami.preferences.notifications.email.mention"/>
                </label>
            </div>
            <div class="controls">
                <label class="checkbox">
                    <input name="dailyDigest" type="checkbox" <@ if(dailyDigest){ @> checked="true" <@ } @>/> <fmt:message key="tatami.preferences.notifications.email.dailyDigest"/>
                </label>
            </div>
            <div class="controls">
                <label class="checkbox">
                    <input name="weeklyDigest" type="checkbox" <@ if(weeklyDigest){ @> checked="true" <@ } @>/> <fmt:message key="tatami.preferences.notifications.email.weeklyDigest"/>
                </label>
            </div>
            <div class="controls">
                <label class="checkbox">
                    <input name="rssUidActive" type="checkbox" <@ if (rssUidActive) {@> checked="true" <@ } @>/>  <fmt:message key="tatami.preferences.notifications.rss.timeline"/>
                </label>
                <@ if (rssUidActive) { @> <a href="/tatami/syndic/<@=rssUid@>" ><fmt:message key="tatami.preferences.notifications.rss.timeline.link"/> </a><@ } @>
            </div>
        </div>
    </fieldset>

    <fieldset>
        <div class="return"/>
        <div class="form-actions">
            <button type="submit" class="input-xlarge btn btn-primary btn-block">
                <fmt:message key="tatami.form.save"/>
            </button>
        </div>
    </fieldset>

</script>

<script type="text/template" id="account-password-newPasswordConfirmation">
    <fmt:message key="tatami.user.new.password.confirmation.error"/>
</script>

<script type="text/template" id="account-password">
    <h2>
        <fmt:message key="tatami.menu.password"/>
    </h2>

    <fieldset>
        <legend>
            <fmt:message key="tatami.user.password.legend"/>
        </legend>

        <div class="control-group">
            <label class="control-label" for="oldPassword">
                <fmt:message key="tatami.user.old.password"/>
            </label>

            <div class="controls">
                <input name="oldPassword" type="password" required="required" size="15" maxlength="40" class="input-xlarge col-span-12" />
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="newPassword">
                <fmt:message key="tatami.user.new.password"/>
            </label>

            <div class="controls">
                <input name="newPassword" type="password" required="required" ize="15" maxlength="40" class="input-xlarge col-span-12"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="newPasswordConfirmation">
                <fmt:message key="tatami.user.new.password.confirmation"/>
            </label>

            <div class="controls">
                <input name="newPasswordConfirmation" type="password" required="required" size="15" maxlength="40" class="input-xlarge col-span-12"/>
            </div>
        </div>
        <div class="return"/>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-block">
                <fmt:message key="tatami.form.save"/>
            </button>
        </div>
    </fieldset>

</script>

<script type="text/template" id="users-menu">
    <ul class="nav nav-tabs">
        <li>
            <a href ="#users">
                <fmt:message key="tatami.account.users.myfriends"/>
            </a>
        </li>
        <li>
            <a href ="#users/recommended">
                <fmt:message key="tatami.account.users.recommended"/>
            </a>
        </li>
        <li>
            <a href ="#users/search">
                <fmt:message key="tatami.search.placeholder"/>
            </a>
        </li>
    </ul>
</script>

<script type="text/template" id="users-header">
    <tr>
        <th><fmt:message key="tatami.username"/></th>
        <th><fmt:message key="tatami.user.lastName"/></th>
        <th/>
    </tr>
</script>

<script type="text/template" id="users-item">
    <td>
        <img class="avatar img-small" src="<@= avatar @>"
         alt="<@= [firstName,lastName].filter(function(value){return value;}).join(' ') @>">
        <a href="/tatami/home/users/<@= username @>" title="<fmt:message key="tatami.user.profile.show"/> <@= ['@' + username,firstName,lastName].filter(function(value){return value;}).join(' ') @>">
            <@= username @>
        </a>
    </td>
    <td>
        <@= [firstName,lastName].filter(function(value){return value;}).join(' ') @>
    </td>
    <td class="follow"/>
</script>

<script type="text/template" id="groups-menu">
    <ul class="nav nav-tabs">
        <li>
            <a href ="#groups">
                <fmt:message key="tatami.account.groups.mygroups"/>
            </a>
        </li>
        <li>
            <a href ="#groups/recommended">
                <fmt:message key="tatami.account.groups.recommended"/>
            </a>
        </li>
        <li>
            <a href ="#groups/search">
                <fmt:message key="tatami.search.placeholder"/>
            </a>
        </li>
    </ul>
</script>

<script type="text/template" id="groups-form">
    <h2>
        <fmt:message key="tatami.group.name"/>
    </h2>
    <@ if (typeof groupId === 'undefined') { @>
        <button class="show btn btn-xlarge btn-block btn-primary" type="button">
            <fmt:message key="tatami.group.add"/>
        </button>
    <@ } @>
    <fieldset <@ if (typeof groupId === 'undefined') { @>class="hide" <@ } @>>
        <legend>
            <@ if (typeof groupId === 'undefined') { @>
                <fmt:message key="tatami.group.add"/>
            <@ } else { @>
                <fmt:message key="tatami.group.edit.details"/>
            <@ } @>
        </legend>
        <div class="control-group">
            <label class="control-label" for="name">
                <fmt:message key="tatami.group.add.title"/>
            </label>

            <div class="controls">
                <input name="name" type="text" required="required" size="30" maxlength="50" class="input-xlarge col-span-12" value="<@= name @>" />
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="description">
                <fmt:message key="tatami.group.add.description"/>
            </label>

            <div class="controls">
                <textarea name="description" class="input-xlarge col-span-12"><@= description @></textarea>
            </div>
        </div>

        <@ if (typeof groupId === 'undefined') { @>
            <div class="control-group">
                <label class="control-label" for="publicGroup">
                    <fmt:message key="tatami.group.add.access"/>
                </label>

                <div class="controls">
                    <label class="radio">
                    <input type="radio" name="publicGroup" value="public" <@ if (publicGroup) { @> checked<@ } @> required>
                    <fmt:message key="tatami.group.add.public"/>
                    </label>
                    <label class="radio">
                    <input type="radio" name="publicGroup" value="private" <@ if (!publicGroup) { @> checked<@ } @> required>
                    <fmt:message key="tatami.group.add.private"/>
                    </label>
                </div>
            </div>

            <div class="alertColor">
                <i class="glyphicon glyphicon-warning-sign"></i>
                <fmt:message key="tatami.group.add.public.alert"/>
            </div>
        <@ } else { @>
            <div class="control-group">
                <label class="control-label" for="archivedGroup">
                    <fmt:message key="tatami.group.archive"/>
                </label>

                <div class="controls">
                    <label class="radio">
                        <input type="radio" name="archivedGroup" value="true" <@ if (archivedGroup) { @> checked<@ } @> required>
                        <fmt:message key="tatami.group.archive.true"/>
                    </label>
                    <label class="radio">
                        <input type="radio" name="archivedGroup" value="false" <@ if (!archivedGroup) { @> checked<@ } @> required>
                        <fmt:message key="tatami.group.archive.false"/>
                    </label>
                </div>
            </div>

            <div class="alert">
                <i class="icon-warning-sign"></i>
                <fmt:message key="tatami.group.archive.alert"/>
            </div>
        <@ } @>

        <br/>
        <div class="return"/>
        <br/>
        <div class="form-actions">
            <@ if (typeof groupId === 'undefined') { @>
                <button type="submit" class="btn btn-success col-span-7 little-marge-right">
                    <fmt:message key="tatami.form.save"/>
                </button>
                <button type="reset" class="btn btn-danger col-span-4">
                    <fmt:message key="tatami.form.cancel"/>
                </button>
            <@ } else { @>
                <button type="submit" class="btn btn-success col-span-12">
                    <fmt:message key="tatami.form.save"/>
                </button>
            <@ } @>
        </div>

    </fieldset>



</script>

<script type="text/template" id="groups-form-adduser">
    <fieldset>
        <legend>
                <fmt:message key="tatami.group.edit.member.add"/>
        </legend>
        <div class="control-group">
            <label class="control-label" for="username">
                <fmt:message key="tatami.username"/>
            </label>

            <div class="controls">
                <input name="username" type="text" autocomplete="off" required="required" class="input-xlarge col-span-12"/>
            </div>
        </div>
        <br/>
        <div class="return"/>
        <br/>
        <div class="form-actions">
            <button type="submit" class="btn btn-success col-span-12">
                <fmt:message key="tatami.form.save"/>
            </button>
        </div>

    </fieldset>


</script>

<!--script type="text/template" id="groups-form-adduser-success">
    <div class="alert alert-success">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <!fmt:message key="tatami.group.edit.member.add.success"/>
    </div>
</script-->

<script type="text/template" id="groups-form-adduser-success-label">
    <fmt:message key="tatami.group.edit.member.add.success"/>
</script>

<!--script type="text/template" id="groups-form-adduser-error">
    <div class="alert alert-danger">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <!fmt:message key="tatami.group.edit.member.add.error"/>
    </div>

</script-->

<script type="text/template" id="groups-form-adduser-error-label">
    <fmt:message key="tatami.group.edit.member.add.error"/>
</script>

<script type="text/template" id="groups-header">
    <tr>
        <th><fmt:message key="tatami.group.name"/></th>
        <th><fmt:message key="tatami.group.add.access"/></th>
        <th><fmt:message key="tatami.group.counter"/></th>
        <th/>
    </tr>
</script>

<script type="text/template" id="groups-item">
    <td>
        <a href="/tatami/home/groups/<@= groupId @>" title="<@= description @>"><@= name @></a>
    </td>
    <td>
        <@ if(publicGroup && !archivedGroup) { @>
            <span class="label label-warning"><fmt:message key="tatami.group.add.public"/></span>
        <@ } else if(publicGroup && archivedGroup || !publicGroup && archivedGroup) { @>
            <span class="label"><fmt:message key="tatami.group.add.archived"/></span>
        <@ } else {@>
            <span class="label label-info"><fmt:message key="tatami.group.add.private"/></span>
        <@ } @>
    </td>
    <td>
        <@= counter  @>
    </td>
      <td>
          <@ if(publicGroup && !administrator) { @>
          <a class="btn-title toggleGroup pull-right label <@= (member)?'label-info':'' @>">
              <@ if(member) { @>
              <span class="glyphicon glyphicon-minus"> <span class="hidden-phone"><fmt:message key="tatami.user.followed"/></span></span>
              <@ } else { @>
              <span class="glyphicon glyphicon-plus"> <span class="hidden-phone"><fmt:message key="tatami.user.follow"/></span></span>
              <@ } @>
          </a>
          <@ } else if(administrator) { @>
          <a href="/tatami/account/#/groups/<@= groupId @>"  class="btn-title toggleTag pull-right label label-info hidden-phone">
              <span class="glyphicon glyphicon-th-large"> <span><fmt:message key="tatami.group.edit.link"/></span></span>
          </a>
          <@ } @>
      </td>
</script>

<script type="text/template" id="groups-admin">
    <a class="btn btn-primary btn-block" href="#/groups/<@= groupId@>">
        <fmt:message key="tatami.group.edit.link"/>
    </a>
</script>

<script type="text/template" id="groups-join">
    <button type="button" class="btn btn-block">
        <fmt:message key="tatami.group.join.group"/>
    </button>
</script>

<script type="text/template" id="groups-leave">
    <button type="button" class="btn btn-danger btn-block">
        <fmt:message key="tatami.group.edit.quit"/>
    </button>
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
        <img class="avatar img-small" src="<@=avatar@>" alt="<@= [firstName,lastName].filter(function(value){return value;}).join(' ') @>">
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

<script type="text/template" id="tags-menu">
    <ul class="nav nav-tabs">
        <li>
            <a href ="#tags">
                <fmt:message key="tatami.account.tags.mytags"/>
            </a>
        </li>
        <li>
            <a href ="#tags/recommended">
                <fmt:message key="tatami.account.tags.recommended"/>
            </a>
        </li>
        <li>
            <a href ="#tags/search">
                <fmt:message key="tatami.search.placeholder"/>
            </a>
        </li>
    </ul>
</script>

<script type="text/template" id="tags-header">
    <tr>
        <th><fmt:message key="tatami.tag"/></th>
        <th/>
    </tr>
</script>

<script type="text/template" id="tags-item">
    <td>
        <a href="/tatami/home/#/tags/<@= name @>" title="<@= name @>">#<@= name @></a>
    </td>
    <td class="follow">
        <a class="btn-title toggleTag pull-right label labelSizeNormal <@= (followed)?'label-info':'' @> ">
            <@ if(followed) { @>
            <span class="glyphicon glyphicon-minus"> <span class="hidden-phone"><fmt:message key="tatami.user.followed"/></span></span>
            <@ } else { @>
            <span class="glyphicon glyphicon-plus"> <span class="hidden-phone"><fmt:message key="tatami.user.follow"/></span></span>
            <@ } @>
        </a>
    </td>


</script>

<script type="text/template" id="files-quota">

    <div class="progress">
        <@ if(quota < 50){@>
        <div class="progress-bar progress-bar-success" style="width: <@= quota @>%;">
        <@ }else if(quota > 50 && quota < 80) {@>
        <div class="progress-bar progress-bar-warning" style="width: <@= quota @>%;">
        <@ }else{@>
        <div class="progress-bar progress-bar-danger" style="width: <@= quota @>%;">
        <@ }@>
        <span class="quota"><@=  quota @>%</span>
    </div>          </div>
</script>

<script type="text/template" id="files-menu">
    <h2><fmt:message key="tatami.menu.files"/></h2>
    <span class="file-infos"></span>
</script>

<script type="text/template" id="files-header">
<div>
     <span class="col-span-5"><b><fmt:message key="tatami.user.file.name"/></b></span>
     <span class="col-span-3"><b><fmt:message key="tatami.user.file.size"/></b></span>
     <span class="col-span-2"><b><fmt:message key="tatami.user.file.creation.date"/></b></span>
     <span class="col-span-2">  </span>
</div>
    </br>
</script>

<script type="text/template" id="files-item">


    <span class="col-span-5 file-table"><a href="/tatami/file/<@= attachmentId @>/<@= filename @>" target="_blank"><@= filename @></a></span>
    <span class="col-span-3"><@= (size/1000) @> kb</span>   </tr>
    <span class="col-span-2"><@= prettyPrintCreationDate @> </span>
    <span class="col-span-2">
        <span class="btn btn-primary btn-block">
            <fmt:message key="tatami.user.status.delete"/>
        </span>
    </span>

</script>


<!--script type="text/template" id="delete-file-success">
    <div class="alert alert-success">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <!fmt:message key="tatami.user.file.delete.success"/>
    </div>
</script-->

<script type="text/template" id="delete-file-success-label">
    <fmt:message key="tatami.user.file.delete.success"/>
</script>

<!--script type="text/template" id="delete-file-error">
    <div class="alert alert-danger">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <!fmt:message key="tatami.user.file.delete.error"/>
    </div>
</script-->

<script type="text/template" id="delete-file-error-label">
    <fmt:message key="tatami.user.file.delete.error"/>
</script>

<script type="text/template" id="search-filter">
    <input id="block_filter" type="text" class="search-query col-span-12" name="result_filter" autocomplete="off" placeholder="<fmt:message key="tatami.search.filter"/>">
</script>
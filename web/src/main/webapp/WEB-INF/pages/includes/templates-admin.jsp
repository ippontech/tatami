<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="accountProfile" >
     <h2>
        <fmt:message key="tatami.account.update.title"/>
    </h2>
             </br>
    <fieldset class="form-horizontal row-fluid">
    <@ if (!ie || ie>9){ @>
    <div class="control-group dashed">
        <label class="control-label">

        </label>

          <div class="controls">
            <div id="updateAvatar" class="dropzone well">
                <img class="nomargin avatar" src="<@= avatar @>" alt=""/>
                <p class=little-padding-top><fmt:message key="tatami.user.picture.button" /></p>
                <input id="avatarFile" type="file" name="uploadFile" data-url="/tatami/rest/fileupload/avatar"/>
            </div>
            <div class="attachmentBar progress progress-striped active" style="display: none;">
                <div class="bar progress-bar progress-bar-info" style="width: 0%;"></div>
            </div>
        </div>
    </div>
    <@ } else { @>
         <label class="control-label">

        </label>
          <div class="controlsIE">
            <p><fmt:message key="tatami.user.picture.buttonIE" /></p>
            <input id="avatarFile" type="file" name="uploadFile" data-url="/tatami/rest/fileupload/avatarIE" class="filestyle" data-classButton="btn btn-primary" data-input="false" data-buttonText="Photo" data-icon="false"/>
            <span class="glyphicon glyphicon-search"></span>
            <span class="upload-ok"><fmt:message key="tatami.user.picture.buttonIE-ok" /></span>
            <span class="upload-ko"><fmt:message key="tatami.user.picture.buttonIE-ko" /></span>
          </div>
    <@ } @>

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

<script type="text/template" id="accountDestroy">
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

<script type="text/template" id="accountPreferences">
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

<script type="text/template" id="accountNewPasswordConfirmation">
    <fmt:message key="tatami.user.new.password.confirmation.error"/>
</script>

<script type="text/template" id="accountPassword">
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

<script type="text/template" id="form-ldap">
    <fmt:message key="tatami.user.password.ldap"/>
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

<script type="text/template" id="groups-menu">
    <ul class="nav nav-tabs">
        <li>
            <a href ="#groups">
                <fmt:message key="tatami.account.groups.mygroups"/>
            </a>
        </li>
        <li>
            <a href ="#groups/recommended">
                <fmt:message key="tatami.trends.title"/>
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


<script type="text/template" id="groups-item">
    <@ if(name) { @><!-- Afin que les groupes privés dont le nom est caché n apparaissent pas -->
    <td>
        <a href="/tatami/home/groups/<@= groupId @>" title="<@= description @>"><@= name @></a>
    </td>
    <td>
        <@ if(publicGroup && !archivedGroup) { @>
            <span class="label labelSizeNormal label-warning"><fmt:message key="tatami.group.add.public"/></span>
        <@ } else if(publicGroup && archivedGroup || !publicGroup && archivedGroup) { @>
            <span class="label labelSizeNormal"><fmt:message key="tatami.group.add.archived"/></span>
        <@ } else {@>
            <span class="label labelSizeNormal label-info"><fmt:message key="tatami.group.add.private"/></span>
        <@ } @>
    </td>
    <td>
        <@= counter  @>
    </td>
      <td>
          <@ if(publicGroup && !administrator) { @>
          <a class="btn-title toggleGroup pull-right label labelSizeNormal <@= (member)?'label-info':'' @>">
              <@ if(member) { @>
              <span class="glyphicon glyphicon-minus"> <span class="hidden-phone"><fmt:message key="tatami.user.followed"/></span></span>
              <@ } else { @>
              <span class="glyphicon glyphicon-plus"> <span class="hidden-phone"><fmt:message key="tatami.user.follow"/></span></span>
              <@ } @>
          </a>
          <@ } else if(administrator) { @>
          <a href="/tatami/account/#/groups/<@= groupId @>"  class="btn-title toggleTag pull-right label labelSizeNormal label-info hidden-phone">
              <span class="glyphicon glyphicon-th-large"> <span><fmt:message key="tatami.group.edit.link"/></span></span>
          </a>
          <@ } @>
      </td>
    <@ } @>
</script>

<script type="text/template" id="usergroup-item">
    <td style="text-align: left">
        <div class='pull-left background-image-fffix little-marge-right'>

            <img class="img-rounded img-medium" style="background-image: url(<@= avatarURL @>);"></img>
        </div>
        <h4>
            <@  if(!activated) { @>
            <span>
                <span class="glyphicon glyphicon-off">
                   <fmt:message key="tatami.user.desactivate.msg"/>
                </span>
            </span>
            <@ } @>
            <a href="/tatami/home/#/users/<@= username @>">
                <strong>
                    <@= fullName @>
                </strong>
            </a>
            <br>
            <a href="/tatami/home/#/users/<@= username @>">
                <small>
                    @<@= username @>
                </small>
            </a>
        </h4>

    </td>

    <td>
        <@ if(role === 'ADMIN'){ @>
        <fmt:message key="tatami.group.role.admin"/>
        <@ } else { @>
        <fmt:message key="tatami.group.role.member"/>
        <@ } @>
    </td>
    <td>
       
            <@ if (window.username !== username) { @>
                <button type="button" class="btn btn-success input-block-level delete">
                    <fmt:message key="tatami.group.edit.member.delete"/>
                </button>
            <@ } @>
       
    </td>
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
                <fmt:message key="tatami.trends.title"/>
            </a>
        </li>
        <li>
            <a href ="#tags/search">
                <fmt:message key="tatami.search.placeholder"/>
            </a>
        </li>
    </ul>
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

<script type="text/template" id="FilesListTemplate">
    <table class="table noCollapse">
        <tr>
            <th style="border-top :0">  </th>
            <th style="border-top :0"><b><fmt:message key="tatami.user.file.name"/></b></th>
            <th style="border-top :0"><b><fmt:message key="tatami.user.file.size"/></b></th>
            <th style="border-top :0"><b><fmt:message key="tatami.user.file.creation.date"/></b></th>
            <th style="border-top :0">  </th>
        </tr>
        <tbody class="items">
        </tbody>
    </table>

</script>

<script type="text/template" id="FileItemTemplate">
    <td><@ if(hasThumbnail) { @>
			<a href="/tatami/file/<@= attachmentId @>/<@= filename @>" target="_blank"><img src="/tatami/thumbnail/<@= attachmentId @>/<@= filename @>" /></a>
		<@ } else { @>
			<a href="/tatami/file/<@= attachmentId @>/<@= filename @>" target="_blank"><img src="/img/document_icon.png" /></a>
		<@ } @>
	</td>
    <td><a href="/tatami/file/<@= attachmentId @>/<@= filename @>" target="_blank"><@= filename @></a></td>
    <td><@= (size/1000) @> kb</td>
    <td><@= prettyPrintCreationDate @> </td>
    <td>
        <span class="btn btn-primary btn-block">
            <fmt:message key="tatami.user.status.delete"/>
        </span>
    </td>
</script>

<script type="text/template" id="search-filter">
    <input id="block_filter" type="text" class="search-query col-span-12" name="result_filter" autocomplete="off" placeholder="<fmt:message key="tatami.search.filter"/>">
</script>


<script type="text/template" id="form-success-label">
    <fmt:message key="tatami.form.success"/>
</script>

<script type="text/template" id="form-error-label">
    <fmt:message key="tatami.form.error"/>
</script>

<script type="text/template" id="groups-form-adduser-success-label">
    <fmt:message key="tatami.group.edit.member.add.success"/>
</script>

<script type="text/template" id="groups-form-adduser-error-label">
    <fmt:message key="tatami.group.edit.member.add.error"/>
</script>

<script type="text/template" id="delete-file-success-label">
    <fmt:message key="tatami.user.file.delete.success"/>
</script>

<script type="text/template" id="delete-file-error-label">
    <fmt:message key="tatami.user.file.delete.error"/>
</script>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="form-success">
    <div class="alert alert-success">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <fmt:message key="tatami.form.success"/>
    </div>
</script>

<script type="text/template" id="form-error">
    <div class="alert alert-error">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <fmt:message key="tatami.form.error"/>
    </div>
</script>

<script type="text/template" id="form-ldap">
    <div class="alert alert-error">
        <fmt:message key="tatami.user.password.ldap"/>
    </div>
</script>

<script type="text/template" id="account-profile">
    <h2>
        <fmt:message key="tatami.account.update.title"/>
    </h2>


    <fieldset>
        <legend>
            <fmt:message key="tatami.account.update.legend"/>
        </legend>

        <div class="control-group">
            <label class="control-label">
                <fmt:message key="tatami.user.email"/>
            </label>

            <div class="controls">
                <input name="login" type="text" disabled="true" class="span12" value="<@= login @>"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label">
                <fmt:message key="tatami.user.picture"/>
            </label>

            <div class="controls">
                <img class="nomargin avatar" src="https://www.gravatar.com/avatar/<@= user.gravatar @>?s=64&d=mm"/>
                <br/>
                <fmt:message
                        key="tatami.user.picture.legend"/><br/><a
                    href="https://www.gravatar.com"
                    target="_blank">https://www.gravatar.com</a>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="firstName">
                <fmt:message key="tatami.user.firstName"/>
            </label>

            <div class="controls">
                <input name="firstName" type="text" size="15" maxlength="40" class="input-xlarge span12" value="<@= user.firstName @>"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="lastName">
                <fmt:message key="tatami.user.lastName"/>
            </label>

            <div class="controls">
                <input name="lastName" type="text" id="lastName" size="15" maxlength="40" class="input-xlarge span12" value="<@= user.lastName @>"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="jobTitle">
                <fmt:message key="tatami.user.jobTitle"/>
            </label>

            <div class="controls">
                <input name="jobTitle" type="text" size="15" maxlength="100" class="input-xlarge span12" value="<@= user.jobTitle @>"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="phoneNumber">
                <fmt:message key="tatami.user.phoneNumber"/>
            </label>

            <div class="controls">
                <input name="phoneNumber" type="text" size="10" maxlength="20" class="input-xlarge span12" value="<@= user.phoneNumber @>"/>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="input-xlarge btn btn-primary btn-block">
                <fmt:message key="tatami.form.save"/>
            </button>
        </div>

        <div class="return"/>
    </fieldset>
</script>

<script type="text/template" id="account-destroy">
    <fieldset>
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
        <button
    </div>
</script>

<script type="text/template" id="account-preferences">
    <h2>
        <fmt:message key="tatami.menu.preferences"/>
    </h2>

    <fieldset>

        <legend>
            <fmt:message key="tatami.preferences.theme"/>
        </legend>

        <div class="control-group">
            <label class="control-label" for="theme">
                <fmt:message
                        key="tatami.preferences.theme.current"/>
            </label>
            <div class="controls">
                <select class="input-xlarge span12" name="theme">
                    <@ ['bootstrap', 'amelia', 'cerulean', 'cosmo', 'cyborg', 'journal', 'readable', 'simplex', 'slate', 'spacelab', 'spruce', 'superhero', 'united'].forEach(function(theme){ @>
                        <option value="<@= theme @>" <@ if(preferences.theme === theme) { @>selected="true" <@ } @>>
                            <@= function(string){ return string.charAt(0).toUpperCase() + string.slice(1) }(theme) @>
                            </option>
                    <@ }); @>
                </select>
            </div>
        </div>
    </fieldset>

    <fieldset>

        <legend>
            <fmt:message key="tatami.preferences.email"/>
        </legend>

        <div class="control-group">
            <div class="controls">
                <label class="checkbox">
                    <input name="mentionEmail" type="checkbox" <@ if(preferences.mentionEmail){ @> checked <@ } @>/> <fmt:message key="tatami.preferences.email.mention"/>
                </label>
            </div>
        </div>
    </fieldset>

    <fieldset>
        <div class="form-actions">
            <button type="submit" class="input-xlarge btn btn-primary btn-block">
                <fmt:message key="tatami.form.save"/>
            </button>
        </div>
        
        <div class="return"/>
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
                <input name="oldPassword" type="password" required="required" size="15" maxlength="40" class="input-xlarge span12" />
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="newPassword">
                <fmt:message key="tatami.user.new.password"/>
            </label>

            <div class="controls">
                <input name="newPassword" type="password" required="required" ize="15" maxlength="40" class="input-xlarge span12"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" for="newPasswordConfirmation">
                <fmt:message key="tatami.user.new.password.confirmation"/>
            </label>

            <div class="controls">
                <input name="newPasswordConfirmation" type="password" required="required" size="15" maxlength="40" class="input-xlarge span12"/>
            </div>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-block">
                <fmt:message key="tatami.form.save"/>
            </button>
        </div>
        <div class="return"/>
    </fieldset>

</script>

<script type="text/template" id="users-menu">
    <ul class="nav nav-tabs">
        <li>
            <a href ="#/users">Users</a>
        </li>
        <li>
            <a href ="#/users/popular">Popular</a>
        </li>
    </ul>
</script>

<script type="text/template" id="users-header">
    <tr>
        <th>Username</th>
        <th>Real name</th>
        <th>Action</th>
    </tr>
</script>

<script type="text/template" id="users-item">
    <td>
        <img class="avatar  avatar-small" src="https://www.gravatar.com/avatar/<@=gravatar@>?s=32&d=mm" alt="<@= firstName @> <@= lastName @>">
        <a href="/tatami/profile/<@= username @>/">
            <@= username @>
        </a>
    </td>
    <td>
        <@= firstName @> <@= lastName @>
    </td>
    <td class="follow"/>
</script>
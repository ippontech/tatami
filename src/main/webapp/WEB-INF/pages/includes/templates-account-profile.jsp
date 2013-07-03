<%--
  Created by IntelliJ IDEA.
  User: Gregoire
  Date: 02/07/13
  Time: 16:22
  To change this template use File | Settings | File Templates.
--%>

<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="account-profile" >

    <h2>
        <fmt:message key="tatami.account.update.title"/>
    </h2>


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

        <div class="control-group dashed">
            <label class="control-label">
                <fmt:message key="tatami.user.picture"/>
            </label>

            <div class="controls">

                <div id="updateAvatar" class="dropzone well">
                    <img class="nomargin avatar" src="<@= avatar @>" alt=""/>
                    <p class=little-padding-top><fmt:message key="tatami.user.picture.button" /></p>
                    <input id="avatarFile" type="file" name="uploadFile" data-url="/tatami/rest/fileupload/avatar"/>
                </div>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" >
                <fmt:message key="tatami.user.firstName"/>
            </label>

            <div class="controls">
                <input name="firstName" type="text" size="15" maxlength="40" class="input-xlarge col-span-12" value="${user.firstName}"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label">
                <fmt:message key="tatami.user.lastName"/>
            </label>

            <div class="controls">
                <input name="lastName" type="text" id="lastName" size="15" maxlength="40" class="input-xlarge col-span-12" value="${user.lastName}"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label">
                <fmt:message key="tatami.user.jobTitle"/>
            </label>

            <div class="controls">
                <input name="jobTitle" type="text" size="15" maxlength="100" class="input-xlarge col-span-12" value="${user.jobTitle}"/>
            </div>
        </div>

        <div class="control-group">
            <label class="control-label" >
                <fmt:message key="tatami.user.phoneNumber"/>
            </label>

            <div class="controls">
                <input name="phoneNumber" type="text" size="10" maxlength="20" class="input-xlarge col-span-12" value="${user.phoneNumber}"/>
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
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="profile-update">
  <fieldset class="span12">
    <div class="control-group">
      <textarea class="span12" required="required" placeholder="<fmt:message key="tatami.status.update"/>..." maxlength="500" name="content">@${user.username} </textarea>
    </div>
    <div>
      <button type='submit' class="btn btn-primary btn-block"><fmt:message key="tatami.status.update.to"/></button>
    </div>
  </fieldset>
</script>
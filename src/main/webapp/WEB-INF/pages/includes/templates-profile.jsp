<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="profile-update">
  <fieldset class="span12">
    <div class="control-group">
      <textarea id="updateStatusContent" class="span12" required="required" placeholder="<fmt:message key="tatami.status.update"/>..." maxlength="500" name="content">@${user.username} </textarea>
    </div>
    <div>
      <button id="updateStatusBtn" type='submit' class="btn btn-primary btn-block" data-content="<fmt:message key="tatami.status.update.success"/>"><fmt:message key="tatami.status.update.to"/></button>
    </div>
  </fieldset>
</script>

<script type="text/template" id="tags-followed-template">

</script>

<script type="text/template" id="tags-followed-template-item">
	<span class="label label-success pull-left tags-followed"><@= tags.name @>&nbsp;<i class="icon-remove"></i></span>
</script>
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

<script type="text/template" id="tags-followed-template">

</script>

<script type="text/template" id="tags-followed-template-item">
<div class="<@= tags.name @>">
	<span class="label label-success pull-left tags-followed"><a href="/tatami/#/tags/<@= tags.name @>"><@= tags.name @></a>&nbsp;<i class="icon-remove"></i></span>
</div>
</script>

<script type="text/template" id="popular-tags-template">

</script>

<script type="text/template" id="popular-tags-template-item">
<div class="<@= tags.name @>">
	<span class="label label-success pull-left tags-followed"><a href="/tatami/#/tags/<@= tags.name @>"><@= tags.name @></a></span>
</div>
</script>
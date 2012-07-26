<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="profile-update">
  <fieldset class="span12">
    <div class="control-group">
      <textarea class="span12" required="required" placeholder="Update your status..." maxlength="500" name="content">@${user.username} </textarea>
    </div>
    <div>
      <input type='submit' class="span12 btn btn-primary" value="Update your status" />
    </div>
  </fieldset>
</script>
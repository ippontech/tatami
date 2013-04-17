<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/template" id="HomeHeader">
    <div class="text-center page-header">
        <h1 class="title">
            <img class="img-rounded pull-left" src="http://www.gravatar.com/avatar/77a3ff9479d623eaff6cba1f81231939?s=70">
          <span>
              <@= fullName @>
          </span>
            <br>
            <small>
                @<@= username @>
            </small>
        </h1>
    </div>
</script>
<script type="text/template" id="CardProfile">
    <div class="page-header">
        <h4 class="profile-card">
            <img class="img-rounded pull-left" src="http://www.gravatar.com/avatar/77a3ff9479d623eaff6cba1f81231939?s=40">
            <span>
                <@= fullName @>
            </span>
            <br>
            <small>
                @<@= username @>
            </small>
        </h4>
    </div>
</script>
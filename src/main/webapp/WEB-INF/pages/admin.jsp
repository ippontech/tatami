<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html lang="en">

<jsp:include page="includes/header.jsp"/>

<body>

<jsp:include page="includes/topmenu.jsp"/>

<div id="mainPanel" class="container">

    <c:if test="${message == 'reindex'}">
    <div class="row">
        <div class="span12">
            <div class="alert alert-success">
                Search engine re-indexation has succeeded.
            </div>
        </div>
    </div>
    </c:if>

    <div class="row">
        <div class="span12">
            <h1>Administration dashboard</h1>
        </div>
    </div>

    <div class="row">
        <div class="span12">
            <div class="row-fluid">
                <div class="tab-content span12">
                    <h2>
                        Registered enterprises
                    </h2>
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th>Domain</th>
                            <th># of users</th>
                        </tr>
                        </thead>
                        <tbody>
                        <c:forEach items="${domains}" var="d">
                            <tr>
                                <td>
                                        ${d.name}
                                </td>
                                <td>
                                        ${d.numberOfUsers}
                                </td>
                            </tr>
                        </c:forEach>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    </div>

        <div class="row">
            <div class="span12">
                <div class="row-fluid">
                    <div class="tab-content span12">
                        <h2>
                            Environnement variables (from tatami.properties)
                        </h2>
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th>Property</th>
                                <th>Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            <c:forEach items="${properties}" var="property">
                                <tr>
                                    <td>
                                            ${property.key}
                                    </td>
                                    <td>
                                            ${property.value}
                                    </td>
                                </tr>
                            </c:forEach>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="span12">
                <h2>
                    Re-index Search Engine
                </h2>

                <form class="form-horizontal" action="/tatami/admin/reindex" method="post">
                    <fieldset>
                        <div class="form-actions">
                            <button type="submit" class="input-xlarge btn btn-danger"
                                    onclick="return(confirm('Are you sure you want to re-index Search Engine?'));">
                                Re-index Search Engine
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>

    <jsp:include page="includes/footer.jsp"/>

    <script type="text/javascript">
        var login = "<sec:authentication property="principal.username"/>";
        var username = "${user.username}";
        var page = "admin";
    </script>
</body>
</html>
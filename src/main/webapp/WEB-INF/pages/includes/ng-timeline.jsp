<section class="tatams-content tatams-margin">
    <div>
        <ul class="homebody-nav nav nav-justified">
            <li class="active">
                <a href="#timeline">
                <i class="glyphicon glyphicon-th-list"></i> Timeline
                </a>
            </li>
            <li>
                <a href="#mentions">
                <i class="glyphicon glyphicon-user"></i> Mentions
                </a>
            </li>
            <li>
                <a href="#favorites">
                <i class="glyphicon glyphicon-star"></i> Favorites
                </a>
            </li>
        </ul>
        <section class="tatams-content tatams-margin">
            <div class="tatams-content-title">
                <h3>
                    <!-- Need to change title based on current tab -->
                    Timeline
                </h3>
            </div>
            <section class="tatams-container">
                <div>
                    <section class="timeline" ng-controller="TimelineController">
                        <div class="tatams" ng-repeat="tatam in tatams">
                            <div class="tatam pointer discussion tatam-border-lr tatam-hover tatam-id-{{ tatam.statusId }}" style="display: block;">
                                <div id="before">
                                </div>
                                <div id="current">
                                    <div class="pull-left background-image-fffix statusitem-img">
                                        <div class="img img-rounded img-medium" ng-style="{ 'background-image': tatam.avatar=='' ? 'url(/img/default_image_profile.png)' : 'url(tatam.avatar)' }"></div>
                                    </div>
                                    <div id="status-content-container">
                                        <div class="pull-right text-right">
                                            <abbr class="timeago" title="{{ tatam.prettyPrintStatusDate }}">Timeago</abbr>
                                            <!-- Replace Timeago JQuery plugin? Learn how time updates automatically. -->
                                        </div>
                                        <h5 class="statusitem-name">
                                            <strong><a href="#users/{{tatam.username}}">{{tatam.firstName + " " + tatam.lastName}}</a></strong>
                                            <small><a href="#users/{{tatam.username}}">@{{tatam.username}}</a></small>
                                        </h5>
                                        <div class="markdown">
                                            <!-- Need to properly generate links for mentions and hashtags, along with other markdown features. -->
                                            <p>{{ tatam.content }}</p>
                                        </div>
                                        <small ng-if="tatam.replyTo != ''">
                                            <span class="glyphicon glyphicon-share-alt"></span> In reply to <a ng-href="#status/{{ tatam.replyTo }}">@{{ tatam.replyToUsername }}</a><br>
                                        </small>
                                        <!-- Need to make sure having multiple small tags doesn't change the original look -->
                                        <small>
                                            <div class="attachments">
                                                <div></div>
                                            </div>
                                            <div id="share">
                                            </div>
                                        </small>
                                    </div>
                                    <div id="geolocalizationInStatus">
                                    </div>
                                    <div id="preview">
                                    </div>
                                    <div id="buttons" class="mediumHeight little-marge-top">
                                    </div>
                                </div>
                                <div id="after">
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </section>
    </div>
</section>

CREATE TABLE IF NOT EXISTS user (
    login varchar,
    password varchar,
    username varchar,
    firstname varchar,
    lastname varchar,
    domain varchar,
    activated boolean,
    avatar varchar,
    jobTitle varchar,
    activation_key varchar,
    reset_key varchar,
    phoneNumber varchar,
    openIdUrl varchar,
    preferences_mention_email boolean,
    rssUid varchar,
    weekly_digest_subscription boolean,
    daily_digest_subscription boolean,
    attachmentsSize bigint,
    PRIMARY KEY(login)
);

CREATE TABLE IF NOT EXISTS status (
    statusId uuid,
    type varchar,
    login varchar,
    username varchar,
    domain varchar,
    statusDate timestamp,
    geoLocalization varchar,
    removed boolean,
    groupId varchar,
    statusPrivate boolean,
    hasAttachments boolean,
    content varchar,
    discussionId varchar,
    replyTo varchar,
    replyToUsername varchar,
    detailsAvailable boolean,
    PRIMARY KEY(statusId)
);

CREATE TABLE IF NOT EXISTS timeline (
    login varchar,
    status uuid,
    PRIMARY KEY(login, status)
);

INSERT INTO user (login , avatar , firstname , lastname , username , domain ) VALUES('jdubois@ippon.fr', 'avatar', 'Julien','Dubois','jdubois','ippon.fr');
INSERT INTO user (login , avatar , firstname , lastname , username , domain ) VALUES('uuser@ippon.fr', 'avatar', 'Update','User','uuser','ippon.fr');
INSERT INTO user (login , avatar , firstname , lastname , username , domain ) VALUES('timelineUser@ippon.fr','avatar','User','TimelineUser','timelineUser','ippon.fr');
INSERT INTO user (login , avatar , firstname , lastname , username , domain ) VALUES('userWhoHasGroup@ippon.fr','avatar','User','WhoHasGroup','userWhoHasGroup','ippon.fr');
INSERT INTO user (login , avatar , firstname , lastname , username , domain ) VALUES('userWithStatus@ippon.fr','avatar','User','WithUserline','userWithStatus','ippon.fr');
INSERT INTO user (login , avatar , firstname , lastname , username , domain ) VALUES('userWhoPostStatus@ippon.fr','avatar','User','WhoPostStatus','userWhoPostStatus','ippon.fr');
INSERT INTO user (login , avatar , firstname , lastname , username , domain ) VALUES('userWhoSubscribeToDigests@ippon.fr','avatar','User','WhoSubscribeToDigests','userWhoSubscribeToDigests','ippon.fr');
INSERT INTO user (login , avatar , firstname , lastname , username , domain ) VALUES('userWhoPostForDigests@ippon.fr','avatar','User','WhoPostForDigests','userWhoPostForDigests','ippon.fr');
INSERT INTO user (login , avatar , firstname , lastname ) VALUES('userWhoWantToFollow@ippon.fr','avatar','User','WhoWantToFollow');
INSERT INTO user (login , avatar , firstname , lastname ) VALUES('userWhoWillBeFollowed@ippon.fr','avatar','User','WhoWillBeFollowed');
INSERT INTO user (login , avatar , firstname , lastname ) VALUES('userWhoFollow@ippon.fr','avatar','User','WhoFollow');
INSERT INTO user (login , avatar , firstname , lastname ) VALUES('userWhoIsFollowed@ippon.fr','avatar','User','WhoIsFollowed');
INSERT INTO user (login , avatar , firstname , lastname ) VALUES('userWhoWantToForget@ippon.fr','avatar','User','WhoWantToForget');
INSERT INTO user (login , avatar , firstname , lastname ) VALUES('userToForget@ippon.fr','avatar','User','ToForget');
INSERT INTO user (login , avatar , firstname , lastname ) VALUES('userWhoReadStatus@ippon.fr','avatar','User','WhoReadStatus');
INSERT INTO user (login , avatar , firstname , lastname ) VALUES('userWhoShouldBeFoundBySimilarSearch@ippon.fr','avatar','User','WhoShouldBeFoundBySimilarSearch');
INSERT INTO status (statusId,login,username,domain,content,statusDate,type) VALUES (fa2bd770-9848-11e1-a6ca-e0f847068d52,'userWithStatus@ippon.fr','userWithStatus','ippon.fr','Tatami is an enterprise social network',dateof(now()), 'STATUS');
INSERT INTO status (statusId,login,username,domain,content,statusDate, type) VALUES (f97d6470-9847-11e1-a6ca-e0f847068d52,'userWithStatus@ippon.fr','userWithStatus','ippon.fr','Tatami is fully Open Source',dateof(now()),'STATUS');
INSERT INTO timeline (login,status) VALUES ('userWithStatus@ippon.fr',fa2bd770-9848-11e1-a6ca-e0f847068d52);
INSERT INTO timeline (login,status) VALUES ('userWithStatus@ippon.fr',f97d6470-9847-11e1-a6ca-e0f847068d52);

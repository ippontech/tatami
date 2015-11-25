
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

CREATE TABLE IF NOT EXISTS domain (
    domainId varchar,
    login varchar,
    PRIMARY KEY(domainId, login)
);

CREATE TABLE IF NOT EXISTS counter (
    login varchar,
    STATUS_COUNTER int,
    FOLLOWERS_COUNTER int,
    FRIENDS_COUNTER int,
    PRIMARY KEY(login)
);

CREATE TABLE IF NOT EXISTS friends (
    login varchar,
    friendLogin varchar,
    PRIMARY KEY(login,friendLogin)
);

CREATE TABLE IF NOT EXISTS followers (
    login varchar,
    followerLogin varchar,
    PRIMARY KEY(login,followerLogin)
);

CREATE TABLE IF NOT EXISTS favline (
    login varchar,
    status uuid,
    PRIMARY KEY(login, status)
);

CREATE TABLE IF NOT EXISTS dayline (
    domainDay varchar,
    username varchar,
    statusCount int,
    PRIMARY KEY(domainDay, username)
);

CREATE TABLE IF NOT EXISTS tagline (
    tagDomain varchar,
    statusId uuid,
    statusCount int,
    PRIMARY KEY(tagDomain, statusId)
);

CREATE TABLE IF NOT EXISTS userline (
    login varchar,
    status uuid,
    PRIMARY KEY(login, status)
);

CREATE TABLE IF NOT EXISTS shares (
    status uuid,
    login varchar,
    PRIMARY KEY(status, login)
);

CREATE TABLE IF NOT EXISTS tagFollowers (
    tagDomain varchar,
    login varchar,
    statusCount int,
    PRIMARY KEY(tagDomain, login)
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

INSERT INTO domain (domainId, login) VALUES ('ippon.fr','jdubois@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','uuser@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','timelineUser@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoHasGroup@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoWantToFollow@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoWillBeFollowed@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoFollow@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoIsFollowed@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoWantToForget@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userToForget@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWithStatus@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoPostStatus@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoReadStatus@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoShouldBeFoundBySimilarSearch@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoSubscribeToDigests@ippon.fr');
INSERT INTO domain (domainId, login) VALUES ('ippon.fr','userWhoPostForDigests@ippon.fr');

INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('jdubois@ippon.fr',2,3,4);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('timelineUser@ippon.fr',0,0,0);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWhoHasGroup@ippon.fr',0,0,0);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWhoWantToFollow@ippon.fr',0,0,0);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWhoWillBeFollowed@ippon.fr',0,0,0);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWhoFollow@ippon.fr',0,0,1);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWhoIsFollowed@ippon.fr',0,1,0);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWhoWantToForget@ippon.fr',0,0,1);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userToForget@ippon.fr',0,1,0);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWithStatus@ippon.fr',2,1,0);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWhoPostStatus@ippon.fr',0,1,0);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWhoReadStatus@ippon.fr',0,0,1);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWhoSubscribeToDigests@ippon.fr',0,0,0);
INSERT INTO counter (login, STATUS_COUNTER, FOLLOWERS_COUNTER, FRIENDS_COUNTER) VALUES ('userWhoPostForDigests@ippon.fr',0,0,0);

INSERT INTO friends (login, friendLogin) VALUES ('userWhoFollow@ippon.fr','userWhoIsFollowed@ippon.fr');
INSERT INTO friends (login, friendLogin) VALUES ('userWhoWantToForget@ippon.fr','userWhoIsFollowed@ippon.fr');
INSERT INTO friends (login, friendLogin) VALUES ('userWhoWantToForget@ippon.fr','userToForget@ippon.fr');
INSERT INTO friends (login, friendLogin) VALUES ('userWhoReadStatus@ippon.fr','userWhoPostStatus@ippon.fr');

INSERT INTO followers (login, followerLogin) VALUES ('userWhoPostStatus@ippon.fr','userWhoReadStatus@ippon.fr');

INSERT INTO dayline (domainDay,username,statusCount) VALUES ('19052012-ippon.fr','userWithStatus',1);

INSERT INTO tagline (tagDomain,statusId,statusCount) VALUES ('ippon-ippon.fr',fa2bd770-9848-11e1-a6ca-e0f847068d52,0);
INSERT INTO tagline (tagDomain,statusId,statusCount) VALUES ('ippon-ippon.fr',f97d6470-9847-11e1-a6ca-e0f847068d52,0);


INSERT INTO userline (login,status) VALUES ('userWithStatus@ippon.fr',fa2bd770-9848-11e1-a6ca-e0f847068d52);
INSERT INTO userline (login,status) VALUES ('userWithStatus@ippon.fr',f97d6470-9847-11e1-a6ca-e0f847068d52);

INSERT INTO shares (status,login) VALUES (f97d6470-9847-11e1-a6ca-e0f847068d52,'john_doe');

INSERT INTO tagFollowers (tagDomain,login,statusCount) VALUES ('test-ippon.fr','jdubois@ippon.fr',0);

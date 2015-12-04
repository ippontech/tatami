
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
    statusId timeuuid,
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
    originalStatusId timeuuid,
    followerLogin varchar,
    PRIMARY KEY(statusId)
);


CREATE TABLE IF NOT EXISTS timeline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key,status)
);

CREATE TABLE IF NOT EXISTS domain (
    domainId varchar,
    login varchar,
    created timeuuid,
    PRIMARY KEY(domainId, login)
);

CREATE TABLE IF NOT EXISTS counter (
    login varchar,
    STATUS_COUNTER counter,
    FOLLOWERS_COUNTER counter,
    FRIENDS_COUNTER counter,
    PRIMARY KEY(login)
);

CREATE TABLE IF NOT EXISTS friends (
    login varchar,
    friendLogin varchar,
    PRIMARY KEY(login,friendLogin)
);

CREATE TABLE IF NOT EXISTS followers (
    key varchar,
    login varchar,
    PRIMARY KEY(key,login)
);

CREATE TABLE IF NOT EXISTS dayline (
    domainDay varchar,
    username varchar,
    statusCount counter,
    PRIMARY KEY(domainDay, username)
);
CREATE TABLE IF NOT EXISTS tagline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);
CREATE TABLE IF NOT EXISTS userline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);
CREATE TABLE IF NOT EXISTS shares (
    status timeuuid,
    login varchar,
    PRIMARY KEY(status, login)
);
CREATE TABLE IF NOT EXISTS tagFollowers (
    key varchar,
    login varchar,
    PRIMARY KEY(key, login)
);
CREATE TABLE IF NOT EXISTS favline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS domainline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS mentionline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);
CREATE TABLE IF NOT EXISTS groupline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS UserlineShares (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS group (
    id timeuuid,
    domain varchar,
    name varchar,
    description varchar,
    publicGroup boolean,
    archivedGroup boolean,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS userGroup (
    login varchar,
    groupId timeuuid,
    role varchar,
    PRIMARY KEY(login, groupId)
);

CREATE TABLE IF NOT EXISTS groupMember (
    groupId timeuuid,
    login varchar,
    role varchar,
    PRIMARY KEY(groupId, login)
);

CREATE TABLE IF NOT EXISTS userTags (
    login varchar,
    friendLogin varchar,
    time timestamp,
    PRIMARY KEY(login, friendLogin)
);

CREATE TABLE IF NOT EXISTS trends (
    domain varchar,
    id timeuuid,
    tag varchar,
    PRIMARY KEY(domain, id)
);

CREATE TABLE IF NOT EXISTS userTrends (
    login varchar,
    id timeuuid,
    tag varchar,
    PRIMARY KEY(login, id)
);

CREATE TABLE IF NOT EXISTS avatar (
    id timeuuid,
    filename varchar,
    content blob,
    size bigint,
    creation_date timestamp,
    PRIMARY KEY(id)
);
CREATE INDEX IF NOT EXISTS  ON avatar (filename);

CREATE TABLE IF NOT EXISTS mailDigest (
    digestId varchar,
    login varchar,
    created timestamp,
    PRIMARY KEY(digestId,login)
);

CREATE TABLE IF NOT EXISTS timelineShares (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key,status)
);

CREATE TABLE IF NOT EXISTS appleDevice (
    login varchar,
    deviceId varchar,
    PRIMARY KEY(login,deviceId)
);

CREATE TABLE IF NOT EXISTS appleDeviceUser (
    deviceId varchar,
    login varchar,
    PRIMARY KEY(deviceId,login)
);
CREATE TABLE IF NOT EXISTS attachment (
    id timeuuid,
    filename varchar,
    content blob,
    thumbnail blob,
    size bigint,
    creation_date timestamp,
    PRIMARY KEY(id,filename)
);

CREATE TABLE IF NOT EXISTS groupCounter (
    domain varchar,
    groupId timeuuid,
    counter counter,
    PRIMARY KEY(domain,groupId)
);

CREATE TABLE IF NOT EXISTS TatamiBotDuplicate (
    Default varchar,
    PRIMARY KEY(Default)
);

CREATE TABLE IF NOT EXISTS Registration (
    registration_key varchar,
    login varchar,
    PRIMARY KEY(registration_key,login)
);

CREATE TABLE IF NOT EXISTS rss (
    rss_uid varchar,
    login varchar,
    PRIMARY KEY(rss_uid)
);

CREATE TABLE IF NOT EXISTS statusAttachments (
    statusId timeuuid,
    attachmentId timeuuid,
    created timestamp,
    PRIMARY KEY(statusId,attachmentId)
);

CREATE TABLE IF NOT EXISTS tagCounter (
    key varchar,
    TAG_COUNTER counter,
    PRIMARY KEY(key)
);

CREATE TABLE IF NOT EXISTS userAttachments (
    login varchar,
    attachmentId timeuuid,
    PRIMARY KEY(login,attachmentId)
);

CREATE TABLE IF NOT EXISTS domainConfiguration (
    domain varchar,
    subscriptionLevel varchar,
    storageSize varchar,
    adminLogin varchar,
    PRIMARY KEY(domain)
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


INSERT INTO timeline (key,status) VALUES ('userWithStatus@ippon.fr',fa2bd770-9848-11e1-a6ca-e0f847068d52);
INSERT INTO timeline (key,status) VALUES ('userWithStatus@ippon.fr',f97d6470-9847-11e1-a6ca-e0f847068d52);

INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','jdubois@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','uuser@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','timelineUser@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoHasGroup@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoWantToFollow@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoWillBeFollowed@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoFollow@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoIsFollowed@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoWantToForget@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userToForget@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWithStatus@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoPostStatus@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoReadStatus@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoShouldBeFoundBySimilarSearch@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoSubscribeToDigests@ippon.fr',now());
INSERT INTO domain (domainId, login,created) VALUES ('ippon.fr','userWhoPostForDigests@ippon.fr',now());

UPDATE counter SET STATUS_COUNTER = STATUS_COUNTER + 2, FOLLOWERS_COUNTER = FOLLOWERS_COUNTER + 3, FRIENDS_COUNTER = FRIENDS_COUNTER + 4 WHERE login = 'jdubois@ippon.fr';
UPDATE counter SET FRIENDS_COUNTER = FRIENDS_COUNTER + 0 WHERE login = 'timelineUser@ippon.fr';
UPDATE counter SET FRIENDS_COUNTER = FRIENDS_COUNTER + 0 WHERE login = 'userWhoHasGroup@ippon.fr';
UPDATE counter SET FRIENDS_COUNTER = FRIENDS_COUNTER + 0 WHERE login = 'userWhoWantToFollow@ippon.fr';
UPDATE counter SET FRIENDS_COUNTER = FRIENDS_COUNTER + 0 WHERE login = 'userWhoWillBeFollowed@ippon.fr';
UPDATE counter SET FRIENDS_COUNTER = FRIENDS_COUNTER + 1 WHERE login = 'userWhoFollow@ippon.fr';
UPDATE counter SET FOLLOWERS_COUNTER = FOLLOWERS_COUNTER + 1 WHERE login = 'userWhoIsFollowed@ippon.fr';
UPDATE counter SET FRIENDS_COUNTER = FRIENDS_COUNTER + 1 WHERE login = 'userWhoWantToForget@ippon.fr';
UPDATE counter SET FOLLOWERS_COUNTER = FOLLOWERS_COUNTER + 1 WHERE login = 'userToForget@ippon.fr';
UPDATE counter SET STATUS_COUNTER = STATUS_COUNTER + 2, FOLLOWERS_COUNTER = FOLLOWERS_COUNTER + 1 WHERE login = 'userWithStatus@ippon.fr';
UPDATE counter SET FOLLOWERS_COUNTER = FOLLOWERS_COUNTER + 1 WHERE login = 'userWhoPostStatus@ippon.fr';
UPDATE counter SET FRIENDS_COUNTER = FRIENDS_COUNTER + 1 WHERE login = 'userWhoReadStatus@ippon.fr';
UPDATE counter SET FRIENDS_COUNTER = FRIENDS_COUNTER + 0 WHERE login = 'userWhoSubscribeToDigests@ippon.fr';
UPDATE counter SET FRIENDS_COUNTER = FRIENDS_COUNTER + 0 WHERE login = 'userWhoPostForDigests@ippon.fr';

INSERT INTO friends (login, friendLogin) VALUES ('userWhoFollow@ippon.fr','userWhoIsFollowed@ippon.fr');
INSERT INTO friends (login, friendLogin) VALUES ('userWhoWantToForget@ippon.fr','userWhoIsFollowed@ippon.fr');
INSERT INTO friends (login, friendLogin) VALUES ('userWhoWantToForget@ippon.fr','userToForget@ippon.fr');
INSERT INTO friends (login, friendLogin) VALUES ('userWhoReadStatus@ippon.fr','userWhoPostStatus@ippon.fr');

INSERT INTO followers (key,login) VALUES ('userWhoPostStatus@ippon.fr','userWhoReadStatus@ippon.fr');

UPDATE dayline SET statusCount = statusCount + 1 WHERE domainDay = '19052012-ippon.fr' AND username = 'userWithStatus';

INSERT INTO tagline (key,status) VALUES ('ippon-ippon.fr',fa2bd770-9848-11e1-a6ca-e0f847068d52);
INSERT INTO tagline (key,status) VALUES ('ippon-ippon.fr',f97d6470-9847-11e1-a6ca-e0f847068d52);

INSERT INTO userline (key,status) VALUES ('userWithStatus@ippon.fr',fa2bd770-9848-11e1-a6ca-e0f847068d52);
INSERT INTO userline (key,status) VALUES ('userWithStatus@ippon.fr',f97d6470-9847-11e1-a6ca-e0f847068d52);

INSERT INTO shares (status,login) VALUES (f97d6470-9847-11e1-a6ca-e0f847068d52,'john_doe');

INSERT INTO tagFollowers (key,login) VALUES ('test-ippon.fr' ,'jdubois@ippon.fr');



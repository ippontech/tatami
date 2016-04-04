CREATE TABLE IF NOT EXISTS status (
    statusId timeuuid,
    type varchar,
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
    followerUsername varchar,
    PRIMARY KEY(statusId)
);

CREATE TABLE IF NOT EXISTS discussion (
    statusId timeuuid,
    discussionId varchar,
    PRIMARY KEY(discussionId,statusId)
) WITH CLUSTERING ORDER BY (statusId ASC);
CREATE INDEX ON discussion (statusId);

CREATE TABLE IF NOT EXISTS timeline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key,status)
);

CREATE TABLE IF NOT EXISTS timeline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key,status)
);

CREATE TABLE IF NOT EXISTS domain (
    domainId varchar,
    username varchar,
    created timeuuid,
    PRIMARY KEY(domainId, username)
);

CREATE TABLE IF NOT EXISTS counter (
    username varchar,
    STATUS_COUNTER counter,
    FOLLOWERS_COUNTER counter,
    FRIENDS_COUNTER counter,
    PRIMARY KEY(username)
);

CREATE TABLE IF NOT EXISTS friends (
    username varchar,
    friendUsername varchar,
    PRIMARY KEY(username,friendUsername)
);

CREATE TABLE IF NOT EXISTS followers (
    key varchar,
    username varchar,
    PRIMARY KEY(key,username)
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
    username varchar,
    PRIMARY KEY(status, username)
);

CREATE TABLE IF NOT EXISTS tagFollowers (
    key varchar,
    username varchar,
    PRIMARY KEY(key, username)
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
    username varchar,
    groupId timeuuid,
    role varchar,
    PRIMARY KEY(username, groupId)
);

CREATE TABLE IF NOT EXISTS groupMember (
    groupId timeuuid,
    username varchar,
    role varchar,
    PRIMARY KEY(groupId, username)
);

CREATE TABLE IF NOT EXISTS userTags (
    username varchar,
    friendUsername varchar,
    time timestamp,
    PRIMARY KEY(username, friendUsername)
);

CREATE TABLE IF NOT EXISTS trends (
    domain varchar,
    id timeuuid,
    tag varchar,
    PRIMARY KEY(domain, id)
);

CREATE TABLE IF NOT EXISTS userTrends (
    username varchar,
    id timeuuid,
    tag varchar,
    PRIMARY KEY(username, id)
);

CREATE TABLE IF NOT EXISTS avatar (
    id timeuuid,
    filename varchar,
    content blob,
    size bigint,
    creation_date timestamp,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS timelineShares (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key,status)
);

CREATE TABLE IF NOT EXISTS appleDevice (
    username varchar,
    deviceId varchar,
    PRIMARY KEY(username,deviceId)
);

CREATE TABLE IF NOT EXISTS appleDeviceUser (
    deviceId varchar,
    username varchar,
    PRIMARY KEY(deviceId,username)
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
    username varchar,
    attachmentId timeuuid,
    PRIMARY KEY(username,attachmentId)
);

CREATE TABLE IF NOT EXISTS domainConfiguration (
    domain varchar,
    subscriptionLevel varchar,
    storageSize varchar,
    adminUsername varchar,
    PRIMARY KEY(domain)
);


CREATE TABLE IF NOT EXISTS user (
    id text,
    password text,
    username text,
    avatar text,
    firstname text,
    lastname text,
    email text,
    jobtitle text,
    phonenumber text,
    activated boolean,
    lang_key text,
    activation_key text,
    reset_key text,
    reset_date timestamp,
    preferences_mention_email boolean,
    rss_uid text,
    weekly_digest_subscription boolean,
    daily_digest_subscription boolean,
    domain text,
    authorities set<text>,
    attachmentsSize bigint,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS user_by_username (
    username text,
    id text,
    PRIMARY KEY(username, id)
);

CREATE TABLE IF NOT EXISTS user_by_email (
    email text,
    id text,
    PRIMARY KEY(email, id)
);

CREATE TABLE IF NOT EXISTS user_by_activation_key (
    activation_key text,
    id text,
    PRIMARY KEY(activation_key, id)
);

CREATE TABLE IF NOT EXISTS user_by_reset_key (
    reset_key text,
    id text,
    PRIMARY KEY(reset_key, id)
);

CREATE TABLE IF NOT EXISTS activation_key_by_creation_date (
    creation_date timeuuid,
    activation_key text,
    PRIMARY KEY(creation_date, activation_key)
);

CREATE TABLE IF NOT EXISTS persistent_token (
    series text,
    token_date timestamp,
    user_agent text,
    token_value text,
    username text,
    user_id text,
    ip_address text,
    PRIMARY KEY(series)
);

CREATE TABLE IF NOT EXISTS persistent_token_by_user (
    user_id text,
    persistent_token_series text,
    PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS rss (
    rss_uid varchar,
    username varchar,
    PRIMARY KEY(rss_uid)
);

CREATE TABLE IF NOT EXISTS mail_digest (
    digest_id varchar,
    username varchar,
    created timestamp,
    PRIMARY KEY(digest_id,username)
);

INSERT INTO user (id, password, username, avatar, firstname, lastname ,email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('1','$2a$10$mE.qmcV0mFU5NcKh73TZx.z4ueI/.bDWbj0T1BYyqP481kGGarKLG', 'system', '', '','System','system@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'ippon.fr', {'ROLE_USER', 'ROLE_ADMIN'});

INSERT INTO user_by_username (username, id)
VALUES('system','1');

INSERT INTO user (id, password, username, avatar, firstname, lastname ,email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('2','$2a$10$j8S5d7Sr7.8VTOYNviDPOeWX8KcYILUVJBsYV83Y5NtECayypx9lO', 'anonymousUser', '', '','Anonymous','anonymous@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'ippon.fr', {});

INSERT INTO user_by_username (username, id)
VALUES('anonymousUser','2');

INSERT INTO user (id, password, username, avatar, firstname, lastname ,email, jobtitle, phonenumber, activated,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('3','$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'admin', '', '','Administrator','admin@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'ippon.fr', {'ROLE_USER', 'ROLE_ADMIN'});

INSERT INTO user_by_username (username, id)
VALUES('admin','3');

INSERT INTO user (id, password, username, avatar, firstname, lastname, email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('4','$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K', 'user', '', '','User','user@localhost', 'Developer', '8041234567', true,'en','', true, '', true, true, 'ippon.fr', {'ROLE_USER'});

INSERT INTO user_by_username (username, id)
VALUES('user','4');

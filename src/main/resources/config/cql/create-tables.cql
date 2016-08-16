CREATE TABLE IF NOT EXISTS status (
    statusId timeuuid,
    type text,
    email text,
    username text,
    domain text,
    statusDate timestamp,
    geoLocalization text,
    removed boolean,
    groupId text,
    statusPrivate boolean,
    hasAttachments boolean,
    content text,
    discussionId text,
    replyTo text,
    replyToUsername text,
    detailsAvailable boolean,
    originalStatusId timeuuid,
    followerUsername text,
    PRIMARY KEY(statusId)
);

CREATE TABLE IF NOT EXISTS discussion (
    statusId timeuuid,
    discussionId text,
    PRIMARY KEY(discussionId,statusId)
) WITH CLUSTERING ORDER BY (statusId ASC);
CREATE INDEX ON discussion (statusId);

CREATE TABLE IF NOT EXISTS timeline (
    key text,
    status timeuuid,
    PRIMARY KEY(key,status)
);

CREATE TABLE IF NOT EXISTS domain (
    domainId text,
    email text,
    created timeuuid,
    PRIMARY KEY(domainId, email)
);

CREATE TABLE IF NOT EXISTS counter (
    email text,
    STATUS_COUNTER counter,
    FOLLOWERS_COUNTER counter,
    FRIENDS_COUNTER counter,
    PRIMARY KEY(email)
);

CREATE TABLE IF NOT EXISTS friends (
    email text,
    friendEmail text,
    PRIMARY KEY(email,friendEmail)
);

CREATE TABLE IF NOT EXISTS followers (
    key text,
    email text,
    PRIMARY KEY(key,email)
);

CREATE TABLE IF NOT EXISTS dayline (
    domainDay text,
    email text,
    statusCount counter,
    PRIMARY KEY(domainDay, email)
);

CREATE TABLE IF NOT EXISTS tagline (
    key text,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS userline (
    key text,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS userlineShares (
    key text,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS shares (
    status timeuuid,
    email text,
    PRIMARY KEY(status, email)
);

CREATE TABLE IF NOT EXISTS tagFollowers (
    key text,
    email text,
    PRIMARY KEY(key, email)
);

CREATE TABLE IF NOT EXISTS favline (
    key text,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS domainline (
    key text,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS mentionline (
    key text,
    status timeuuid,
    PRIMARY KEY(key, status)
);
CREATE TABLE IF NOT EXISTS groupline (
    key text,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS group (
    id timeuuid,
    domain text,
    name text,
    description text,
    publicGroup boolean,
    archivedGroup boolean,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS userGroup (
    email text,
    groupId timeuuid,
    role text,
    PRIMARY KEY(email, groupId)
);

CREATE TABLE IF NOT EXISTS groupMember (
    groupId timeuuid,
    email text,
    role text,
    PRIMARY KEY(groupId, email)
);

CREATE TABLE IF NOT EXISTS userTags (
    email text,
    friendEmail text,
    time timestamp,
    PRIMARY KEY(email, friendEmail)
);

CREATE TABLE IF NOT EXISTS trends (
    domain text,
    id timeuuid,
    tag text,
    PRIMARY KEY(domain, id)
);

CREATE TABLE IF NOT EXISTS userTrends (
    email text,
    id timeuuid,
    tag text,
    PRIMARY KEY(email, id)
);

CREATE TABLE IF NOT EXISTS avatar (
    id timeuuid,
    filename text,
    content blob,
    size bigint,
    creation_date timestamp,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS timelineShares (
    key text,
    status timeuuid,
    PRIMARY KEY(key,status)
);

CREATE TABLE IF NOT EXISTS appleDevice (
    email text,
    deviceId text,
    PRIMARY KEY(email,deviceId)
);

CREATE TABLE IF NOT EXISTS appleDeviceUser (
    deviceId text,
    email text,
    PRIMARY KEY(deviceId,email)
);
CREATE TABLE IF NOT EXISTS attachment (
    id timeuuid,
    filename text,
    content blob,
    thumbnail blob,
    size bigint,
    creation_date timestamp,
    PRIMARY KEY(id,filename)
);

CREATE TABLE IF NOT EXISTS groupCounter (
    domain text,
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
    key text,
    TAG_COUNTER counter,
    PRIMARY KEY(key)
);

CREATE TABLE IF NOT EXISTS userAttachments (
    email text,
    attachmentId timeuuid,
    PRIMARY KEY(email,attachmentId)
);

CREATE TABLE IF NOT EXISTS domainConfiguration (
    domain text,
    subscriptionLevel text,
    storageSize text,
    adminUsername text,
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
    jobDescription text,
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
    email text,
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
    rss_uid text,
    email text,
    PRIMARY KEY(rss_uid)
);

CREATE TABLE IF NOT EXISTS mail_digest (
    digest_id text,
    email text,
    created timestamp,
    PRIMARY KEY(digest_id,email)
);

CREATE TABLE IF NOT EXISTS usersBlocked (
    email text,
    blockedEmail text,
    PRIMARY KEY(email,blockedEmail)
);
CREATE TABLE IF NOT EXISTS reportedStatus (
    domain text,
    statusId text,
    reportingLogin text,
    PRIMARY KEY(domain,statusId, reportingLogin)
);

INSERT INTO user (id, password, username, avatar, firstname, lastname ,email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('1','$2a$10$mE.qmcV0mFU5NcKh73TZx.z4ueI/.bDWbj0T1BYyqP481kGGarKLG', 'system', '', '','System','system@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'localhost', {'ROLE_USER', 'ROLE_ADMIN'});

INSERT INTO user_by_email (email, id)
VALUES('system@localhost','1');

INSERT INTO user (id, password, username, avatar, firstname, lastname ,email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('2','$2a$10$j8S5d7Sr7.8VTOYNviDPOeWX8KcYILUVJBsYV83Y5NtECayypx9lO', 'anonymousUser', '', '','Anonymous','anonymous@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'localhost', {});

INSERT INTO user_by_email (email, id)
VALUES('anonymousUser@localhost','2');

INSERT INTO user (id, password, username, avatar, firstname, lastname ,email, jobtitle, phonenumber, activated,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('3','$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'admin', '', '','Administrator','admin@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'localhost', {'ROLE_USER', 'ROLE_ADMIN'});

INSERT INTO user_by_email (email, id)
VALUES('admin@localhost','3');

INSERT INTO user (id, password, username, avatar, firstname, lastname, email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('4','$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K', 'user', '', '','User','user@localhost', 'Developer', '8041234567', true,'en','', true, '', true, true, 'localhost', {'ROLE_USER'});

INSERT INTO user_by_email (email, id)
VALUES('user@localhost','4');

CREATE INDEX domainID ON user (domain);

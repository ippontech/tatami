CREATE TABLE IF NOT EXISTS tatamijhipster.status (
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

CREATE TABLE IF NOT EXISTS tatamijhipster.timeline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key,status)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.domain (
    domainId varchar,
    login varchar,
    created timeuuid,
    PRIMARY KEY(domainId, login)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.timeline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key,status)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.domain (
    domainId varchar,
    login varchar,
    created timeuuid,
    PRIMARY KEY(domainId, login)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.counter (
    login varchar,
    STATUS_COUNTER counter,
    FOLLOWERS_COUNTER counter,
    FRIENDS_COUNTER counter,
    PRIMARY KEY(login)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.friends (
    login varchar,
    friendLogin varchar,
    PRIMARY KEY(login,friendLogin)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.followers (
    key varchar,
    login varchar,
    PRIMARY KEY(key,login)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.dayline (
    domainDay varchar,
    username varchar,
    statusCount counter,
    PRIMARY KEY(domainDay, username)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.tagline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.userline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.shares (
    status timeuuid,
    login varchar,
    PRIMARY KEY(status, login)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.tagFollowers (
    key varchar,
    login varchar,
    PRIMARY KEY(key, login)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.favline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.domainline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.mentionline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);
CREATE TABLE IF NOT EXISTS tatamijhipster.groupline (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key, status)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.group (
    id timeuuid,
    domain varchar,
    name varchar,
    description varchar,
    publicGroup boolean,
    archivedGroup boolean,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.userGroup (
    login varchar,
    groupId timeuuid,
    role varchar,
    PRIMARY KEY(login, groupId)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.groupMember (
    groupId timeuuid,
    login varchar,
    role varchar,
    PRIMARY KEY(groupId, login)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.userTags (
    login varchar,
    friendLogin varchar,
    time timestamp,
    PRIMARY KEY(login, friendLogin)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.trends (
    domain varchar,
    id timeuuid,
    tag varchar,
    PRIMARY KEY(domain, id)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.userTrends (
    login varchar,
    id timeuuid,
    tag varchar,
    PRIMARY KEY(login, id)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.avatar (
    id timeuuid,
    filename varchar,
    content blob,
    size bigint,
    creation_date timestamp,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.timelineShares (
    key varchar,
    status timeuuid,
    PRIMARY KEY(key,status)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.appleDevice (
    login varchar,
    deviceId varchar,
    PRIMARY KEY(login,deviceId)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.appleDeviceUser (
    deviceId varchar,
    login varchar,
    PRIMARY KEY(deviceId,login)
);
CREATE TABLE IF NOT EXISTS tatamijhipster.attachment (
    id timeuuid,
    filename varchar,
    content blob,
    thumbnail blob,
    size bigint,
    creation_date timestamp,
    PRIMARY KEY(id,filename)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.groupCounter (
    domain varchar,
    groupId timeuuid,
    counter counter,
    PRIMARY KEY(domain,groupId)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.statusAttachments (
    statusId timeuuid,
    attachmentId timeuuid,
    created timestamp,
    PRIMARY KEY(statusId,attachmentId)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.tagCounter (
    key varchar,
    TAG_COUNTER counter,
    PRIMARY KEY(key)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.userAttachments (
    login varchar,
    attachmentId timeuuid,
    PRIMARY KEY(login,attachmentId)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.domainConfiguration (
    domain varchar,
    subscriptionLevel varchar,
    storageSize varchar,
    adminLogin varchar,
    PRIMARY KEY(domain)
);


CREATE TABLE IF NOT EXISTS tatamijhipster.user (
    id text,
    login text,
    password text,
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
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.user_by_login (
    login text,
    id text,
    PRIMARY KEY(login, id)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.user_by_email (
    email text,
    id text,
    PRIMARY KEY(email, id)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.user_by_activation_key (
    activation_key text,
    id text,
    PRIMARY KEY(activation_key, id)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.user_by_reset_key (
    reset_key text,
    id text,
    PRIMARY KEY(reset_key, id)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.activation_key_by_creation_date (
    creation_date timeuuid,
    activation_key text,
    PRIMARY KEY(creation_date, activation_key)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.persistent_token (
    series text,
    token_date timestamp,
    user_agent text,
    token_value text,
    login text,
    user_id text,
    ip_address text,
    PRIMARY KEY(series)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.persistent_token_by_user (
    user_id text,
    persistent_token_series text,
    PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.rss (
    rss_uid varchar,
    login varchar,
    PRIMARY KEY(rss_uid)
);

CREATE TABLE IF NOT EXISTS tatamijhipster.mail_digest (
    digest_id varchar,
    login varchar,
    created timestamp,
    PRIMARY KEY(digest_id,login)
);

INSERT INTO tatamijhipster.user (id, login, password , firstname, lastname ,email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('1','system','$2a$10$mE.qmcV0mFU5NcKh73TZx.z4ueI/.bDWbj0T1BYyqP481kGGarKLG','','System','system@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'ippon.fr', {'ROLE_USER', 'ROLE_ADMIN'});

INSERT INTO tatamijhipster.user_by_login (login, id)
VALUES('system','1');

INSERT INTO tatamijhipster.user (id, login, password , firstname, lastname ,email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('2','anonymousUser','$2a$10$j8S5d7Sr7.8VTOYNviDPOeWX8KcYILUVJBsYV83Y5NtECayypx9lO','','Anonymous','anonymous@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'ippon.fr', {});

INSERT INTO tatamijhipster.user_by_login (login, id)
VALUES('anonymousUser','2');

INSERT INTO tatamijhipster.user (id, login, password , firstname, lastname ,email, jobtitle, phonenumber, activated,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('3','admin','$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC','','Administrator','admin@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'ippon.fr', {'ROLE_USER', 'ROLE_ADMIN'});

INSERT INTO tatamijhipster.user_by_login (login, id)
VALUES('admin','3');

INSERT INTO tatamijhipster.user (id, login, password , firstname, lastname, email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('4','user','$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K','','User','user@localhost', 'Developer', '8041234567', true,'en','', true, '', true, true, 'ippon.fr', {'ROLE_USER'});

INSERT INTO tatamijhipster.user_by_login (login, id)
VALUES('user','4');

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

CREATE TABLE IF NOT EXISTS domain (
    domainId varchar,
    login varchar,
    created timeuuid,
    PRIMARY KEY(domainId, login)
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


CREATE TABLE IF NOT EXISTS user (
    id text,
    login text,
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

CREATE TABLE IF NOT EXISTS user_by_login (
    login text,
    id text,
    PRIMARY KEY(login, id)
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
    login text,
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
    login varchar,
    PRIMARY KEY(rss_uid)
);

CREATE TABLE IF NOT EXISTS mail_digest (
    digest_id varchar,
    login varchar,
    created timestamp,
    PRIMARY KEY(digest_id,login)
);

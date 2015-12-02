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
    adminLogin varchar
    PRIMARY KEY(domain)
);

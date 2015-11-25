
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

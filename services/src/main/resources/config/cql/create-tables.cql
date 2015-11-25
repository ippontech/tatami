
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
    id varchar,
    statusId varchar,
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



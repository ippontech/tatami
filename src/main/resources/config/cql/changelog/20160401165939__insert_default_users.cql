INSERT INTO user (id, password, username, avatar, firstname, lastname ,email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('1','$2a$10$mE.qmcV0mFU5NcKh73TZx.z4ueI/.bDWbj0T1BYyqP481kGGarKLG', 'system', '', '','System','system@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'ippon.fr', {'ROLE_USER', 'ROLE_ADMIN'});

INSERT INTO user_by_email (email, id)
VALUES('system@localhost','1');

INSERT INTO user (id, password, username, avatar, firstname, lastname ,email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('2','$2a$10$j8S5d7Sr7.8VTOYNviDPOeWX8KcYILUVJBsYV83Y5NtECayypx9lO', 'anonymousUser', '', '','Anonymous','anonymous@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'ippon.fr', {});

INSERT INTO user_by_email (email, id)
VALUES('anonymousUser@localhost','2');

INSERT INTO user (id, password, username, avatar, firstname, lastname ,email, jobtitle, phonenumber, activated,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('3','$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC', 'admin', '', '','Administrator','admin@localhost', 'Developer', '8041234567', true,'en','', true, '', false, false, 'ippon.fr', {'ROLE_USER', 'ROLE_ADMIN'});

INSERT INTO user_by_email (email, id)
VALUES('admin@localhost','3');

INSERT INTO user (id, password, username, avatar, firstname, lastname, email, jobtitle, phonenumber, activated ,lang_key, activation_key, preferences_mention_email, rss_uid, weekly_digest_subscription, daily_digest_subscription, domain, authorities)
VALUES('4','$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K', 'user', '', '','User','user@localhost', 'Developer', '8041234567', true,'en','', true, '', true, true, 'ippon.fr', {'ROLE_USER'});

INSERT INTO user_by_email (email, id)
VALUES('user@localhost','4');

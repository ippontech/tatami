Tatami
================

Concours
--------
Tatami est l'objet d'un concours organisé par Ippon Technologies, pour plus d'informations :
[Bienvenue sur le Tatami](http://blog.ippon.fr/2012/03/19/bienvenue-sur-le-tatami-ippon-lance-un-grand-concours-de-code-pour-devoxx-france/)

Presentation
------------------

Tatami is a twitter-like application, for internal use inside a company.

Tatami is made with the following technologies :

- [Apache Cassandra](http://cassandra.apache.org/)
- [Elastic Search](http://www.elasticsearch.org/) - version : 0.19.2
- [The Spring Framework](http://www.springsource.org/)
- HTML5 and [Twitter Bootstrap](http://twitter.github.com/bootstrap/)

Tatami is developped by [Ippon Technologies](http://www.ippon.fr)

Installation
------------

- Install [Maven 3](http://maven.apache.org/)
- Run Cassandra from Maven : mvn cassandra:run
- Run Jetty from Maven : mvn jetty:run
- Optional : if you want to activate ElasticSearch, just add -Delasticsearch.activated=true
- Connect to the application at http://127.0.0.1:8080

The default users are "jdubois/password" and "tescolan/password", you can check or modify the
Spring Security configuration at /META-INF/spring/applicationContext-security.xml

If you want to remote debug, don't forget to set MAVEN_OPTS accordingly :
export MAVEN_OPTS="$MAVEN_OPTS -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n"
And remote debug under your IDE on port 8000

Note 1 : if you run into some Permgen errors, don't forget to boost these parameters : PermSize and MaxPermSize.
For instance :
-XX:PermSize=256m -XX:MaxPermSize=256m
Adding this to MAVEN_OPTS is the simplest solution

Note 2 : if you want to look inside ElasticSearch index, feel free to use elasticsearch-head, by @mobz, under /tatami/etc/
Credits : https://github.com/mobz/elasticsearch-head

License
-------

Copyright 2012 [Ippon Technologies](http://www.ippon.fr)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this application except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
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
- Install & Config Elastic Search : After downloading the latest release and extracting it, elasticsearch can be started using: $ bin/elasticsearch -f but before just edit the config file : ./config/elasticsearch.yml and uncomment the property cluster.name and the value to Tatami cluster.
- Run Jetty from Maven : mvn jetty:run
- Connect to the application at http://127.0.0.1:8080

The default users are "jdubois/password" and "tescolan/password", you can check or modify the
Spring Security configuration at /META-INF/spring/applicationContext-security.xml

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
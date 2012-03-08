Tatami
================

Presentation
------------------

Tatami is a twitter-like application, for internal use inside a company.

Tatami is made with the following technologies :

- Apache Cassandra
- The Spring Framework
- HTML5

Tatami is developped by [Ippon Technologies](http://www.ippon.fr)

Installation
------------

- Install Cassandra from [http://cassandra.apache.org/](http://cassandra.apache.org/)
- Edit the conf/cassandra.yaml file and name your cluster "Tatami cluster" (you can also fine-tune other settings if you want)
- Run Cassandra : bin/cassandra.sh -f
- Run Tatami : mvn jetty:run
- Connect to the application at http://127.0.0.1:8080

Administration
--------------

If you need to reset Cassandra :

- Run "cassandra-cli" and execute the following commands
- connect 127.0.0.1/9160;
- drop keyspace tatami;

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
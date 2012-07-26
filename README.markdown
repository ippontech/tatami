Tatami
================

Presentation
------------------

Tatami is a micro-blogging platform, for internal use inside a company.

Tatami is made with the following technologies :

- HTML5, [Backbone.js](http://backbonejs.org/) and [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
- [The Spring Framework](http://www.springsource.org/)
- [Apache Cassandra](http://cassandra.apache.org/)
- [Elastic Search](http://www.elasticsearch.org/)

Tatami is developped by [Ippon Technologies](http://www.ippon.fr)

Current build status is available on [BuildHive](https://buildhive.cloudbees.com/job/ippontech/job/tatami/) : [![Build Status](https://buildhive.cloudbees.com/job/ippontech/job/tatami/badge/icon)](https://buildhive.cloudbees.com/job/ippontech/job/tatami/)

Installation (simple, for normal users)
---------------------------------------

- Install [Maven 3](http://maven.apache.org/)
- Run Cassandra from Maven : `mvn cassandra:run`
- Run Jetty from Maven : `mvn jetty:run`
- Connect to the application at http://127.0.0.1:8080

To create a username/password, use the registration form. As we have not configured a SMTP server (you can configure it in src/main/resources/META-INF/tatami/tatami.properties), your password will not be mailed to you, but you can see it in the log (look at the Jetty console output).

Installation (advanced, for developers)
---------------------------------------

If you want to remote debug, don't forget to set up your MAVEN_OPTS accordingly :
```
export MAVEN_OPTS="$MAVEN_OPTS -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n"
```
And remote debug under your IDE on port 8000

If you run into some Permgen errors, don't forget to boost these parameters : PermSize and MaxPermSize. For instance : 
```
-XX:PermSize=256m -XX:MaxPermSize=256m
```
Adding this to MAVEN_OPTS is the simplest solution

If you want to look inside the ElasticSearch index, feel free to use [elasticsearch-head](https://github.com/Aconex/elasticsearch-head), by @mobz, under /tatami/etc/ as a submodule of tatami. 
```
# to setup the submodule 
git submodule init 

# and fetch the submodule
git submodule update

# otherwise, if you don't have cloned the repository yet, you can setup and fetch directly during the clone
git clone --recursive ${tatami_git_repository}
```
Credits : https://github.com/mobz/elasticsearch-head

Thanks
------

Jetbrains is providing us free [Intellij IDEA](http://www.jetbrains.com/idea/) licenses, 
which definitely allows us to be more productive and have more fun on the project!

YourKit is kindly supporting open source projects with its full-featured Java Profiler.
YourKit, LLC is the creator of innovative and intelligent tools for profiling
Java and .NET applications. Take a look at YourKit's leading software products:
[YourKit Java Profiler](http://www.yourkit.com/java/profiler/index.jsp) and
[YourKit .NET Profiler](http://www.yourkit.com/.net/profiler/index.jsp).

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
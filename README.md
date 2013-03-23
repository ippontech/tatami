Tatami
================

Presentation
------------------

Tatami is an Open Source enterprise social network.

A publicly installed version of Tatami is provided by [Ippon Technologies](http://www.ippon.fr) at : [https://tatami.ippon.fr](https://tatami.ippon.fr)

Tatami is made with the following technologies :

- HTML5, [Backbone.js](http://backbonejs.org/) and [Twitter Bootstrap](http://twitter.github.com/bootstrap/)
- [The Spring Framework](http://www.springsource.org/)
- [Apache Cassandra](http://cassandra.apache.org/)
- [Apache Lucene](http://lucene.apache.org/core/)
- [Elastic Search](http://www.elasticsearch.org/) (optional add-on, as a replacement for Lucene)

Tatami is developped by [Ippon Technologies](http://www.ippon.fr)

Current build status is available on [BuildHive](https://buildhive.cloudbees.com/job/ippontech/job/tatami/) : [![Build Status](https://buildhive.cloudbees.com/job/ippontech/job/tatami/badge/icon)](https://buildhive.cloudbees.com/job/ippontech/job/tatami/)

Tatami Bot
-----------------

The Tatami Bot is an optional software, which fetches data over your company's Intranet and on the Internet, and aggregates
this data on Tatami.

More information on the [Tatami Bot homepage](https://github.com/ippontech/tatami-bot).

Installation for developpers
---------------------------------------

### 5 minutes installation

- Clone, fork or download the source code from this Github page
- Install [Maven 3](http://maven.apache.org/)
- Run Cassandra from Maven : `mvn cassandra:run`
- Run Jetty from Maven : `mvn jetty:run`
- Connect to the application at http://127.0.0.1:8080

To create users, use the registration form. As we have not configured a SMTP server (you can configure it in src/main/resources/META-INF/tatami/tatami.properties - see below "installation for production use" for more options), the validation URL as well as the password will not be e-mailed to you, but you can see them in the log (look at the Jetty console output).

### Using Tomcat instead of Jetty

If you want to use Tomcat instead of Jetty (which works better in development mode on Windows), just use :

- Run Tomcat from Maven : `mvn tomcat7:run`

### Maven tuning and troubleshooting

If you run into some Permgen or OutOfMemory errors, you can configure your Maven settings accordingly :
```
export MAVEN_OPTS="-XX:PermSize=64m -XX:MaxPermSize=96m -Xms256m -Xmx1024m"
```

If you want to debug remotely the application with your IDE, set up your MAVEN_OPTS :
```
export MAVEN_OPTS="$MAVEN_OPTS -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n"
```

### Cassandra troubleshooting

On Mac OS X, you should use JDK 6 and not JDK 7, see [issue #281](https://github.com/ippontech/tatami/issues/281#issuecomment-12430701).

Installation for production use
---------------------------------------

### Cassandra installation

- Download [Apache Cassandra](http://cassandra.apache.org/)
- Install Cassandra : the application will work fine with just one node, but ideally you should have a cluster with at least 3 or 5 nodes
- Cassandra is configured with its cassandra.yaml file : don't forget to backup your "data" and "commitlog" directories

### Tatami installation

In order to use a stable version, use one of the [available tags](https://github.com/ippontech/tatami/tags).

Tatami can be configured with the src/main/resources/META-INF/tatami/tatami.properties file. You can configure this file in 2 ways :

- Edit the file in your own Tatami fork
- Properties in this file are replaced at build time by Maven : you can set up your own Maven profile with your specific properties

Once Tatami is started, you will be able to check your properties at runtime in the Administration page.

To deploy Tatami :

- Create the Tatami WAR file : `mvn package`
- The WAR file will be called "root.war", as Tatami should be run as the root application (on the "/" Web context)
- Deploy the WAR file on your favorite Java EE server
- The WAR has been tested on Jetty 8 and Tomcat 7, and should work fine on all Java EE servers

Upgrading from a previous version
---------------------------------------

Upgrading is normally just a matter of using a newer version of the application.

Sometimes, you will need to update the Cassandra keyspace: upgrade scripts are available in the src/main/cql/upgrade directory.

Launching stress tests
---------------------------------------

Stress tests are done with [Apache JMeter](http://jmeter.apache.org/).

- Launch Cassandra
- Run Tatami from Maven with the `stress-tests` profile : `mvn jetty:run -Pstress-tests`
- Launch JMeter
- Run the `src/test/jmeter/tatami-create-users.jmx` script : it will create 200 normal users, which each has 200 follower users
- Run the stress test : `src/test/jmeter/tatami-stress-test.jmx`

Launching functional tests
---------------------------------------

Functional tests are a work in progress, you do not have to run them in order to use the application.

Requirement : all components must run on localhost :

- for LDAP authentication, the tests starts the LDAP server that the Tatami server will use
- for fixture setup and assertions, the test connects directly to the local cassandra

Launching UI Tests from maven :

- add this profile on your settings.xml :
```xml
<profile>
  <id>tatami</id>
  <activation>
    <activeByDefault>true</activeByDefault>
  </activation>
  <properties>
    <webdriver.chrome.driver>C:\path\to\chromedriver.exe</webdriver.chrome.driver><!--optional-->
    <google.password>xxxx</google.password>
    <google.email>xxx@xxx.fr</google.email>
  </properties>
</profile>
```

- Run Maven with this command : `mvn clean verify -Puitest`

Launching UI Tests from maven with Chrome :

- install ChromeDriver in your system
- configure the property "webdriver.chrome.driver" in your settings pointing to your chrome driver install directory
- add `-Dgeb.env=chrome` to the maven command above

Launching UI Tests from your IDE :

- Enable a groovy plugin on your IDE
- Activate maven profile "uitest" or add src/integration/* in your classpath
- Run Tatami with Maven : `mvn cassandra:delete cassandra:start jetty:run -Djetty.scanIntervalSeconds=0`
- Run Specs (in src\integration\java\fr\ippon\tatami\uitest) as Junit Tests from your IDE
  => you have to set adequate system properties to your running configurations (the same as those that are necessary in setting.xml for maven : see above)


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
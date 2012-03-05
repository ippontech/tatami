                Tatami
                ================
               Ippon Technologies
               ------------------

Tatami is a twitter-like application, for internal use inside a company.

Tatami is made with the following technologies :
- Apache Cassandra
- The Spring Framework
- HTML5

Installation
------------

- Install Cassandra from [http://cassandra.apache.org/](http://cassandra.apache.org/)
- Edit the conf/cassandra.yaml file and name your cluster "Tatami cluster" (you can also fine-tune other settings if you want)
- Run Cassandra : bin/cassandra.sh -f
- Run Tatami : mvn jetty:run
- Connect to the application at http://127.0.0.1:8080
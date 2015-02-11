PullRequest
===========

Add Docker support
-----------------

In order to deploy Tatami on a Docker host easily, here are the required steps (required make and maven installed):
* mvn clean package -Pdocker (-DskipTests)
* (optional) Change the username inside the Makefile
* make build: will create the docker image (java, jetty) and copy the war inside

Here you have a <username>/tatami docker image. It required a cassandra container to run.

Here you can choose:
* Using make:
    * make start_db will pull and run a spotify cassandra docker image
    * make start will run and link the tatami and cassandra containers. 
    * check it is running by doing "docker ps"
* Using fig (required fig installed or using https://registry.hub.docker.com/u/dduportal/fig/):
    * (optional) aligne your image name in the fig.yml
    * fig up -d
    * check it is running by doing "fig ps"

You should now have a tatami running at localhost:8080

Stop you app by doing:
* make stop rm
* make stop_db rm_db
or
* fig stop
* fig rm --force


What about development using those docker images
-------------------------------------------------

In order to test your devs into those builtin images you can:
* Work as usual, using your prefered IDE in order to create your snapshot root.war
* Instead of running "make start" which will create a new container base on your tatami image with the war embedded, use "make dev start". It will start the same \
    image but will link it to the war present in your target folder.
* Use shortcut: "make up" on the morning (!) to start DB and App in dev mode. "make down" to clean your env.

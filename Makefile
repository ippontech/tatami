.SILENT :
	.PHONY : all

USERNAME:=pouicr
APPNAME:=tatami
IMAGE:=$(USERNAME)/$(APPNAME)
DB:=cassandra
DBIMG:=spotify/cassandra
IP:=`sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' $(APPNAME)`

define docker_run_flags
-p 8080:8080 \
--link cassandra:cassandra
endef

## This help screen
help:
	printf "Available targets:\n\n"
	awk '/^[a-zA-Z\-\awk_0-9]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")); \
			helpMessageMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "%-15s %s\RLENGTHn", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

## Build the volume image
volume:
	echo "Building $(APPNAME) volumes..."
	-sudo docker run -v $(PWD)/target/root.war:/opt/jetty/webapps/root.war --name $(APPNAME)_volumes busybox true

## Remove the volume image
rm_volume:
	echo "Remove $(APPNAME) volumes..."
	-sudo docker rm $(APPNAME)_volumes

## Run in dev mode (mount the volume)
dev: volume
	$(eval docker_run_flags += --volumes-from $(APPNAME)_volumes)
	@echo "Dev mode activated"


## Build the image
build:
	echo "Building $(IMAGE) docker image..."
	sudo docker build --rm -t $(IMAGE) .

## Stop and delete the container
clean: stop rm

## Up app and DB
up: volume dev start_db start

## Stop and rm app and DB
down: stop_db rm_db stop rm rm_volume

## Start the container
start:
	echo "Starting $(IMAGE) docker image..."
	sudo docker run -d $(docker_run_flags) --name $(APPNAME) $(IMAGE)

## Start bash inside the app container
bash:
	echo "Starting bash inside $(APPNAME) docker container..."
	sudo docker exec -it $(APPNAME) /bin/bash

## Stop the container
stop:
	echo "Stopping container $(APPNAME)..."
	-sudo docker stop $(APPNAME)

## Delete the container
rm:
	echo "Deleting container $(APPNAME)..."
	-sudo docker rm $(APPNAME)

## Delete image
rmi:
	echo "Deleting image $(IMAGE)..."
	-sudo docker rmi $(IMAGE)

## Show container logs
logs:
	echo "Logs of the $(APPNAME) container..."
	sudo docker logs -f $(APPNAME)

## Start db
start_db:
	echo "Starting $(DB) docker image..."
	sudo docker run -d --name $(DB) $(DBIMG)

## Stop db
stop_db:
	echo "Stopping container $(DB)..."
	-sudo docker stop $(DB)

## Remove db container
rm_db:
	echo "Deleting container $(DB)..."
	-sudo docker rm $(DB)

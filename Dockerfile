FROM ubuntu:14.04
MAINTAINER no-one-yet

ENV USER tatami
ENV TATAMI_DIR /opt/tatami
ENV JETTY_VERSION 8.1.8.v20121106

RUN apt-get update
RUN apt-get install -y git-core curl wget openjdk-6-jdk

RUN bash -c 'mkdir -p $TATAMI_DIR/{application,maven,data,data/elasticsearch,log,log/elasticsearch}'

WORKDIR $TATAMI_DIR

RUN wget http://central.maven.org/maven2/org/mortbay/jetty/dist/jetty-deb/$JETTY_VERSION/jetty-deb-$JETTY_VERSION.deb && \
    dpkg -i jetty-deb-$JETTY_VERSION.deb && \
    rm -f jetty-deb-$JETTY_VERSION.deb && \
    rm -rf /opt/jetty/webapps/*

RUN touch toto
ADD target/root.war /opt/jetty/webapps/root.war

WORKDIR /opt/jetty

CMD ["java", "-jar", "start.jar", "OPTIONS=Server,jsp,resources,websocket,ext,plus,annotations"]

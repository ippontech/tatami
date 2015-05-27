#!/bin/bash

darwin=false;

case "`uname`" in
    Darwin*) darwin=true ;;
esac

if $darwin; then
    sedi="sed -i .sed.del"
else
    sedi="sed -i"
fi


find . -name TopMenuView.html | xargs $sedi "s/<pom>version<\/pom>/$1/"
find . -name TopMenuView.html | xargs $sedi "s/<pom>build<\/pom>/$2/"

if $darwin; then
    find . -name TopMenuView.html.sed.del | xargs rm
fi


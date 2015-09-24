#!/bin/bash
cat tatamiPID | xargs kill || true
rm tatamiPID || true

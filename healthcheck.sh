#!/bin/sh

# Simple healthcheck: verify nginx responds with 200 OK
if wget --quiet --tries=1 --spider --timeout=5 http://localhost/health; then
    exit 0  # Healthy
else
    exit 1  # Unhealthy
fi

#!/bin/bash

if [[ "$VERCEL_ENV" == "production" ]]; then
	git diff --exit-code HEAD^ HEAD .
else
  exit 0;
fi

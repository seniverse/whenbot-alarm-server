#!/bin/bash

curl -H "Accept: application/json" -H "Content-type: application/json" -X POST http://127.0.0.1:9527/api/v1/webhook --data-binary "@data-alert.json"
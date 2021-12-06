#!/bin/bash
cd client
yarn generate

cd ../server
rm -rf dist
cp ../client/dist .

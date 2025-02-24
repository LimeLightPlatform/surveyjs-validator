#!/usr/bin/env just --justfile

set dotenv-load

# Docker Variables
VERSION := env_var_or_default("VERSION", "latest")
docker_compose := 'docker-compose -f ' + justfile_directory() + '/docker-compose.yaml'

# Print a list of available recipes
_default:
    @just --justfile {{justfile()}} --list --unsorted

install:
    npm install

image version=(VERSION): install
    docker buildx build -t limelightci/surveyjs-validator:{{version}} {{justfile_directory()}}

clean:
    rm -rf {{justfile_directory()}}/node_modules

run: install
    npm run start

test:
    npm build

lint:
    npx eslint src/*.js
    npx prettier . --check

format:
    npx prettier . --write

# Simple Dumb Database Architecture

## Overview

This project implements a basic, file-based database with support for multiple formats (JSON and binary). The data is stored in collections, where each collection contains records identified by unique IDs.

## Components

-  DatabaseService : Handles all interactions with the file system for reading and writing data.
  - Supports dynamic storage formats based on the `SDD_STORE_TYPE` environment variable.
  - CRUD operations for tables and records.
-  DatabaseController : Exposes a REST API for interacting with the database (create, read, update, delete).
-  CLI Tool : A simple command-line interface for interacting with the database without the need for an API.
-  Binary Storage : Adds support for binary storage of data, allowing more compact data representation.

## Technologies

-  Nest.js : Framework for building the API and organizing the application.
-  Commander.js : Library used to build the CLI tool.
-  js-yaml : Handles YAML format for data storage.
-  Jest : For unit and e2e testing.

## File Structure
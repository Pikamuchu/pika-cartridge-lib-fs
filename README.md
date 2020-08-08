# Cartridge lib fs

[![Version](https://img.shields.io/npm/v/cartridge_lib_fs.svg)](https://npmjs.org/package/cartridge_lib_fs)
[![Build Status](https://travis-ci.com/pikamachu/pika-cartridge-lib-fs.svg?branch=master)](https://travis-ci.com/pikamachu/pika-cartridge-lib-fs)
[![codecov](https://codecov.io/gh/pikamachu/pika-cartridge-lib-fs/branch/master/graph/badge.svg)](https://codecov.io/gh/pikamachu/pika-cartridge-lib-fs)

## Introduction

Cartridge library implementation of node [fs](https://nodejs.org/api/fs.html) api.

## Build with

* [Generator Cartridge Lib Module](https://www.npmjs.com/package/generator-cartridge-lib-module)

## Installation

### As standard SFCC cartridge

This library can be installed as a standard SFRA cartridge cloning the repository and running npm script uploadCartridge

````
$ git clone git@github.com:pikamachu/pika-cartridge-lib-fs.git
$ cd pika-cartridge-lib-fs
$ npm run uploadCartridge
````

### As npm library dependency on SFRA project

This library can be added to an existing SFRA project as npm library dependency using

````
$ npm i cartridge_lib_fs
````

This option is recommended for develop environments using [vscode](https://code.visualstudio.com/) + [Prophet Debugger](https://marketplace.visualstudio.com/items?itemName=SqrTT.prophet)

The Prophet Debugger Extension should be set with this configuration on user settings.json
````
"extension.prophet.upload.enabled": true,
"extension.prophet.ignore.list": ["\\.git", "\\.zip$"],
````

## Usage

This cartridge library is a node fs api implementation using dw api.

The fs module can be loaded using require cartridge as a standard SFRA script.

````
var fs = require('*/cartridge/scripts/lib/fs/index');
````

See [fs](https://nodejs.org/api/fs.html) documentation for module usage.

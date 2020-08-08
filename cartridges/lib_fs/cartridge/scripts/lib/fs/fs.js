'use strict';

var File = require('dw/io/File');
var FileReader = require('dw/io/FileReader');
var FileWriter = require('dw/io/FileWriter');

function open(path, options, callback) {
    return processResult(function() {
        return new File(path);
    }, callback || options);
}

function exists(path, options, callback) {
    return processResult(function() {
        var file = new File(path);
        return file && file.exists();
    }, callback || options);
}

function readdir(path, options, callback) {
    return processResult(function() {
        var file = new File(path);
        return file.directory ? file.listFiles().toArray() : [];
    }, callback || options);
}

function readFile(path, options, callback) {
    return processResult(function() {
        var content;
        var fileReader;
        try {
            var file = new File(path);
            fileReader = new FileReader(file, getEncoding(options));
            var line;
            while ((line = fileReader.readLine()) != null) {
                content += line;
            }
        } catch (e) {
            throw e;
        } finally {
            if (fileReader) fileReader.close();
        }
        return content;
    }, callback || options);
}

function writeFile(pathFile, data, options, callback) {
    return processResult(function() {
        var fileWriter;
        try {
            var file = pathFile instanceof File ? pathFile : new File(pathFile);
            fileWriter = new FileWriter(file, getEncoding(options));
            fileWriter.writeLine(data);
        } catch (e) {
            throw e;
        } finally {
            if (fileWriter) fileWriter.close();
        }
    }, callback || options);
}

function getEncoding(options) {
    return typeof processor === 'function' ? options.encoding || options : 'UTF-8';
}

function processResult(processor, callback) {
    var result;
    var error;
    try {
        if (typeof processor === 'function') {
            result = processor();
        }
    } catch (e) {
        error = e;
    }
    if (typeof callback === 'function') {
        callback(error, result);
    }
    if (error) {
        throw error;
    }
    return result;
}

module.exports = {
    open: open,
    exists: exists,
    readdir: readdir,
    readFile: readFile,
    writeFile: writeFile,
    openSync: open,
    existsSync: exists,
    readdirSync: readdir,
    readFileSync: readFile,
    writeFileSync: writeFile
};

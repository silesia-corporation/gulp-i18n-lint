"use strict";

var through2 = require("through2"),
    i18nLint = require("./lib/i18n-lint"),
    i18nLintReporter = require("./lib/reporters/default"),
    i18nLintPlugin = function (options) {
        options = options || {};

        return through2.obj(function (file, enc, cb) {
            var errors = i18nLint.scan(file.contents.toString(),
                options.rules
            );

            // send status down-stream
            if (errors && errors.length > 0) {
                file.i18nlint = [];
                errors.forEach(function (error) {
                    file.i18nlint.push({file: file.path, error: error});
                });
            }

            cb(null, file);
        });
    };

i18nLintPlugin.reporter = function () {
    return through2.obj(function (file, enc, cb) {
        if (file.i18nlint && file.i18nlint.length > 0) {
            i18nLintReporter(file.i18nlint);
        }

        cb(null, file);
    });
};

module.exports = i18nLintPlugin;

import test from "ava";

var i18nPlugin,
    File,
    fs,
    check;

test.before(t => {
    i18nPlugin = require("../");
    File = require("vinyl");
    fs = require("fs");

    check = function (file, stream, callback) {
        stream.on("data", function (newFile) {
            callback(newFile);
        });

        stream.write(file);
        stream.end();
    };
});

test("plugin is defined", t => {
    t.truthy(i18nPlugin);
});

test("reporter is defined", t => {
    t.truthy(i18nPlugin.reporter);
});

test("shouldn't return error structure", t => {
    var file = new File({
            path: "test/fixtures/empty.ejs",
            contents: fs.readFileSync("test/fixtures/empty.ejs")
        }),
        stream = i18nPlugin();

    check(file, stream, function (newFile) {
        t.falsy(newFile.i18nlint);
    });
});

test("should return file and error", t => {
    var file = new File({
            path: "test/fixtures/test.ejs",
            contents: fs.readFileSync("test/fixtures/test.ejs")
        }),
        stream = i18nPlugin(),
        result;

    check(file, stream, function (newFile) {
        result = newFile.i18nlint[0];
        t.truthy(result.file);
        t.truthy(result.error);
    });
});

test("should return error structure", t => {
    var file = new File({
            path: "test/fixtures/test.ejs",
            contents: fs.readFileSync("test/fixtures/test.ejs")
        }),
        stream = i18nPlugin(),
        result;

    check(file, stream, function (newFile) {
        result = newFile.i18nlint[0].error;
        t.is(result.code, "W002");
        t.is(result.reason, "Hardcoded \'alt\' attribute");
        t.is(result.evidence.toString(), "/(Alternative text)/m");
        t.is(result.line, 1);
        t.is(result.character, 23);
    });
});

test("should return two errors", t => {
    var file = new File({
            path: "test/fixtures/two-errors.ejs",
            contents: fs.readFileSync("test/fixtures/two-errors.ejs")
        }),
        stream = i18nPlugin();

    check(file, stream, function (newFile) {
        t.is(newFile.i18nlint.length, 2);
    });
});

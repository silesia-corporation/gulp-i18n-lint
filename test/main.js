import test from "ava";
import File from "vinyl";

var plugin = require("../"),
    fs = require("fs"),
    check;

test.before(t => {
    check = function (file, stream, done, callback) {
        stream.on("data", function (newFile) {
            callback(newFile);
            done();
        });

        stream.write(file);
        stream.end();
    };
});

test("plugin is defined", t => {
    t.truthy(plugin);
});

test("reporter is defined", t => {
    t.truthy(plugin.reporter);
});

test.cb("shouldn't return error structure", t => {
    var file = new File({
            path: "test/fixtures/empty.ejs",
            contents: fs.readFileSync("test/fixtures/empty.ejs")
        }),
        stream = plugin();

    check(file, stream, t.end, function (newFile) {
        t.falsy(newFile.i18nlint);
    });
});

test.cb("should return file and error", t => {
    var file = new File({
            path: "test/fixtures/test.ejs",
            contents: fs.readFileSync("test/fixtures/test.ejs")
        }),
        stream = plugin(),
        result;

    check(file, stream, t.end, function (newFile) {
        result = newFile.i18nlint[0];
        t.truthy(result.file);
        t.truthy(result.error);
    });
});

test.cb("should return error structure", t => {
    var file = new File({
            path: "test/fixtures/test.ejs",
            contents: fs.readFileSync("test/fixtures/test.ejs")
        }),
        stream = plugin(),
        result;

    check(file, stream, t.end, function (newFile) {
        result = newFile.i18nlint[0].error;
        t.is(result.code, "W002");
        t.is(result.reason, "Hardcoded \'alt\' attribute");
        t.is(result.evidence.toString(), "/(Alternative text)/m");
        t.is(result.line, 1);
        t.is(result.character, 23);
    });
});

test.cb("should return two errors", t => {
    var file = new File({
            path: "test/fixtures/two-errors.ejs",
            contents: fs.readFileSync("test/fixtures/two-errors.ejs")
        }),
        stream = plugin();

    check(file, stream, t.end, function (newFile) {
        t.is(newFile.i18nlint.length, 2);
    });
});

var fs = require("fs");
var browserify = require("browserify");

if (process.argv.length < 4) {
    console.log("Usage: node compile.js [infile] [outfile]");
    return;
}

var infile = process.argv[2];
var outfile = process.argv[3];

browserify("./" + infile)
    .transform("babelify", { presets: ["es2015"] })
    .bundle()
    .pipe(fs.createWriteStream(outfile))
    .on('close', function() {
        console.log(`Compiled ${infile} to ${outfile}`);
    });

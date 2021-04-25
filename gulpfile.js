
//npm remove merge-stream gulp gulp-concat gulp-minify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-replace gulp-minify-ejs gulp-rename
//npm install -D merge-stream gulp gulp-concat gulp-minify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-replace gulp-minify-ejs gulp-rename
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const merge = require("merge-stream");
const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const minifyejs = require("gulp-minify-ejs");
const jsmin = require("gulp-minify");
const concat = require("gulp-concat");
const cssmin = require("gulp-clean-css");
const strip = require("gulp-strip-comments");
const replace = require("gulp-replace");
const rename = require("gulp-rename");

// Settings
const EJS_PATH = "src/views/**/*.ejs";
const HTML_PATH = "src/views/**/*.html";
const CSS_FILES = [ "src/public/css/web/**/*.css", "src/public/css/tests/**/*.css" ];
const JS_FILES = [ "src/public/js/web/**/*.js", "src/public/js/tests/**/*.js" ];
const MODULES = [ "src/*.js", "src/routes/**/*.js", "src/lib/**/*.js", "src/i18n/**/*.js", "src/dao/**/*.js", "src/controllers/**/*.js", "certs/*.pem" ]

// Task to minify EJS's
gulp.task("minify-ejs", function() {
	return gulp.src(EJS_PATH)
				.pipe(minifyejs())
				//.pipe(rename({suffix:".min"}))
				.pipe(gulp.dest("dist/views"))
});

// Task to minify HTML's
gulp.task("minify-html", () => {
	const config = {
		collapseWhitespace: true,
		removeComments: false, //removeComments => remove CDATA
		removeRedundantAttributes: true //remove attr with default value
	};
	return gulp.src(HTML_PATH)
				.pipe(strip()).pipe(htmlmin(config))
				//.pipe(replace('<base href="src/">', '<base href="dist/">'))
				.pipe(gulp.dest("dist/views"));
});

// Tasks to minify CSS's
gulp.task("minify-css", () => {
	const config = {level: {1: {specialComments: 0}}};
	return gulp.src(CSS_FILES)
				.pipe(concat("styles.min.css"))
				.pipe(cssmin(config))
				.pipe(gulp.dest("src/public/css"))
				.pipe(gulp.dest("dist/public/css"));
});

// Tasks to minify JS's
gulp.task("minify-js", () => {
	const config = {level: {1: {specialComments: 0}}};
	return gulp.src(JS_FILES)
				.pipe(concat("static.js"))
				.pipe(jsmin(config))
				.pipe(gulp.dest("src/public/js"))
				.pipe(gulp.dest("dist/public/js"));
});

// Tasks to copy sources to dist
gulp.task("copy-modules", () => {
	gulp.src(MODULES[0]).pipe(gulp.dest("dist"));
	gulp.src(MODULES[1]).pipe(gulp.dest("dist/routes"));
	gulp.src(MODULES[2]).pipe(gulp.dest("dist/lib"));
	gulp.src(MODULES[3]).pipe(gulp.dest("dist/i18n"));
	gulp.src(MODULES[4]).pipe(gulp.dest("dist/dao"));
	gulp.src(MODULES[5]).pipe(gulp.dest("dist/controllers"));
	return gulp.src(MODULES[6]).pipe(gulp.dest("dist/certs"));
});

// Task to create symlink in root => node_modules
gulp.task("symlinks", () => {
	//ln -s ../../src/controllers/web/public node_modules/app
	//mv node_modules/app/controllers node_modules/app/ctrl
	//cp -r node_modules/app/controllers node_modules/app/ctrl
	gulp.src("src/controllers").pipe(gulp.symlink("node_modules/app"));
	gulp.src("src/lib").pipe(gulp.symlink("node_modules/app"));
	return gulp.src("src/dao").pipe(gulp.symlink("node_modules/app"));
});

// Tasks to copy files once
gulp.task("copy-files", () => {
	if (!fs.existsSync("dist/dbs")) //initialize data once
		gulp.src("src/dbs/**/*").pipe(gulp.dest("dist/dbs"));
	gulp.src("src/public/*.json").pipe(gulp.dest("dist/public"));
	gulp.src("src/public/files/**/*").pipe(gulp.dest("dist/public/files"));
	gulp.src("src/public/thumb/**/*").pipe(gulp.dest("dist/public/thumb"));
	return gulp.src("src/public/img/**/*").pipe(gulp.dest("dist/public/img"));
});

gulp.task("watch", () => {
	gulp.watch(EJS_PATH, gulp.series("minify-ejs"));
	gulp.watch(HTML_PATH, gulp.series("minify-html"));
	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(JS_FILES, gulp.series("minify-js"));
	gulp.watch(MODULES, gulp.series("copy-modules"));
	// Other watchers ...
});

gulp.task("default", gulp.parallel("minify-ejs", "minify-html", "minify-css", "minify-js", 
									"copy-modules", "symlinks", "copy-files", "watch"));

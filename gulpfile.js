
//npm remove merge-stream gulp gulp-concat gulp-minify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-replace gulp-minify-ejs
//npm install -D merge-stream gulp gulp-concat gulp-minify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-replace gulp-minify-ejs
const fs = require("fs"); //file system
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

// Settings
const HTML_PATH = "src/views/**/*.html";
const EJS_PATH = "src/views/**/*.ejs";
const CSS_FILES = [
	"src/public/css/form.css", "src/public/css/grid.css", "src/public/css/menu.css", 
	"src/public/css/progressbar.css", "src/public/css/style.css"
];
const JS_FILES = [
	"src/public/js/form.js", "src/public/js/menu.js", "src/public/js/progressbar.js", 
	"src/public/js/message-box.js", "src/public/js/string-box.js", 
	"src/public/js/validator-box.js", "src/public/js/validators.js"
];

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

// Task to minify EJS's
gulp.task("minify-ejs", function() {
	return gulp.src(EJS_PATH)
				.pipe(minifyejs())
				//.pipe(rename({suffix:".min"}))
				.pipe(gulp.dest("dist/views"))
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

// Tasks to copy files once
gulp.task("copy", () => {
	gulp.src("src/public/*.json").pipe(gulp.dest("dist/public"));
	return gulp.src("src/public/img/**/*").pipe(gulp.dest("dist/public/img"));
});

gulp.task("watch", () => {
	gulp.watch(HTML_PATH, gulp.series("minify-html"));
	gulp.watch(EJS_PATH, gulp.series("minify-ejs"));
	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(JS_FILES, gulp.series("minify-js"));
	// Other watchers ...
});

gulp.task("default", gulp.parallel("minify-html", "minify-ejs", "minify-css", "minify-js", "copy", "watch"));

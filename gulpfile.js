
//npm remove gulp gulp-concat gulp-uglify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-minify-inline gulp-replace gulp-rename gulp-minify-ejs
//npm install -D gulp gulp-concat gulp-uglify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-minify-inline gulp-replace gulp-rename gulp-minify-ejs
const fs = require("fs"); //file system module
const path = require("path"); //file and directory paths
const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const minifyejs = require("gulp-minify-ejs");
const uglify = require('gulp-uglify');
const concat = require("gulp-concat");
const cssmin = require("gulp-clean-css");
const cssInline = require('gulp-minify-inline');
const strip = require("gulp-strip-comments");
//const replace = require("gulp-replace");
//const rename = require("gulp-rename");

// Settings
const HTML_PATH = [ "src/views/**/*.html", "src/views/**/*.ejs" ];
const MODULES = [ "src/*.js", "src/routes/**/*.js", "src/lib/**/*.js", "src/i18n/**/*.js", "src/dao/**/*.js", "src/controllers/**/*.js", "certs/*.pem" ]
const CSS_FILES = [
	"src/public/css/style.css", "src/public/css/menu.css", "src/public/css/progressbar.css", "src/public/css/form.css", "src/public/css/table.css", "src/public/css/print.css"
];
const JS_LIB = [
	"src/public/js/lib/array-box.js", "src/public/js/lib/date-box.js", "src/public/js/lib/dom-box.js", "src/public/js/lib/graph-box.js", 
	"src/public/js/lib/i18n-box.js", "src/public/js/lib/number-box.js", "src/public/js/lib/string-box.js", "src/public/js/lib/tree-box.js", "src/public/js/lib/validator-box.js", 
	"src/public/js/lib/util-box.js"
];
const JS_UAE = [
	"src/public/js/lib/array-box.js", "src/public/js/lib/date-box.js", "src/public/js/lib/dom-box.js", "src/public/js/lib/i18n-box.js", 
	"src/public/js/lib/number-box.js", "src/public/js/lib/string-box.js", "src/public/js/lib/validator-box.js"
];
const JS_WEB = [ "src/public/js/web/form.js" ];

// Task to minify all views (HTML's and EJS's)
gulp.task("minify-html", () => {
	const config = {
		collapseWhitespace: true,
		removeComments: false, //removeComments => remove CDATA
		removeRedundantAttributes: true //remove attr with default value
	};
	return gulp.src(HTML_PATH)
				.pipe(strip()).pipe(htmlmin(config)).pipe(cssInline()).pipe(minifyejs())
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
	return gulp.src(JS_LIB)
				.pipe(concat("lib-min.js"))
				.pipe(uglify())
				.pipe(gulp.dest("src/public/js"))
				.pipe(gulp.dest("dist/public/js"));
});
gulp.task("minify-js-uae", () => {
	return gulp.src(JS_UAE)
				.pipe(concat("uae-min.js"))
				.pipe(uglify())
				.pipe(gulp.dest("src/public/js"))
				.pipe(gulp.dest("dist/public/js"));
});
gulp.task("minify-js-web", () => {
	return gulp.src(JS_WEB)
				.pipe(concat("web-min.js"))
				.pipe(uglify())
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
	//gulp.src("src/components").pipe(gulp.symlink("node_modules/app"));
	gulp.src("src/controllers").pipe(gulp.symlink("node_modules/app"));
	gulp.src("src/dao").pipe(gulp.symlink("node_modules/app"));
	gulp.src("src/i18n").pipe(gulp.symlink("node_modules/app"));
	gulp.src("src/lib").pipe(gulp.symlink("node_modules/app"));
	return gulp.src("src/views").pipe(gulp.symlink("node_modules/app"));
});

// Tasks to copy files once
gulp.task("copy-files", () => {
	if (fs.existsSync("dist/dbs"))
		return gulp; //initialize statics once
	gulp.src("src/dbs/**/*").pipe(gulp.dest("dist/dbs"));
	gulp.src("src/public/*.json").pipe(gulp.dest("dist/public"));
	gulp.src("src/public/files/**/*").pipe(gulp.dest("dist/public/files"));
	return gulp.src("src/public/img/**/*").pipe(gulp.dest("dist/public/img"));
});

gulp.task("watch", () => {
	gulp.watch(HTML_PATH, gulp.series("minify-html"));
	gulp.watch(MODULES, gulp.series("copy-modules"));
	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(JS_LIB, gulp.series("minify-js"));
	gulp.watch(JS_UAE, gulp.series("minify-js-uae"));
	gulp.watch(JS_WEB, gulp.series("minify-js-web"));
	// Other watchers ...
});

gulp.task("default", gulp.parallel("minify-html", 
									"minify-css", 
									"minify-js", "minify-js-uae", "minify-js-web",
									"copy-modules", "symlinks", "copy-files", 
									"watch"));

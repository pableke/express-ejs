
//npm remove gulp gulp-concat gulp-uglify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-minify-ejs gulp-gh-pages
//npm install --save-dev gulp gulp-concat gulp-uglify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-minify-ejs gulp-gh-pages
import fs from "fs"; //file system module
import gulp from "gulp"; // automatizer module
import htmlmin from "gulp-htmlmin";
import minifyejs from "gulp-minify-ejs";
import uglify from 'gulp-uglify';
import concat from "gulp-concat";
import cssmin from "gulp-clean-css";
import strip from "gulp-strip-comments";
import deploy from "gulp-gh-pages";

const CSS_FILES = "src/public/css/**/*.css";
const JS_FILES = [ "src/**/*.js", "src/**/*.mjs" ];
const HTML_PATH = [ "src/**/*.html", "src/**/*.ejs" ];
const RM_OPTS = { recursive: true, force: true };

const fnConcat = (source, dest, name) => gulp.src(source).pipe(concat(name)).pipe(gulp.dest(dest));

// Tasks to copy sources to dist
gulp.task("modules", done => {
	const FOLDERS = [ // Structure
		"dist", "dist/public", "dist/views", 
		"dist/public/files", "dist/public/files/uploads/", "dist/public/files/thumbs/"
	];
	FOLDERS.forEach(dir => (fs.existsSync(dir) || fs.mkdirSync(dir)));
	gulp.src("src/**/*").pipe(gulp.dest("dist/")).on("end", () => {
		gulp.src("dist").pipe(gulp.symlink("node_modules/app"));
		gulp.src("dist/dao").pipe(gulp.symlink("node_modules/app"));
		gulp.src("dist/ctrl").pipe(gulp.symlink("node_modules/app"));
		gulp.src("dist/i18n").pipe(gulp.symlink("node_modules/app"));
		gulp.src("dist/public/js/lib").pipe(gulp.symlink("node_modules/app"));
		gulp.src("dist/public/js/model").pipe(gulp.symlink("node_modules/app"));
		done();
	});
});

// Task to minify all views (HTML's and EJS's)
gulp.task("minify-html", done => {
	const options = {
		caseSensitive: true,
		sortClassName: true,
		collapseWhitespace: true,
		removeComments: true, //removeComments => remove CDATA
		removeRedundantAttributes: true //remove attr with default value
	};
	return gulp.src(HTML_PATH).pipe(strip()).pipe(htmlmin(options)).pipe(minifyejs()).pipe(gulp.dest("dist"));
});
// Tasks to minify CSS's
gulp.task("minify-css", done => {
	const config = { level: {1: { specialComments: 0 }} };
	fs.rmSync("dist/public/css/styles-min.css", RM_OPTS); // NO lo duplico
	gulp.src(CSS_FILES).pipe(cssmin(config)).pipe(gulp.dest("dist/public/css")).on("end", () => {
		fnConcat("dist/public/css/**/*.css", "dist/public/css", "styles-min.css").on("end", done);
	});
});
// Tasks to minify JS's
gulp.task("minify-js", done => {
	const JS_UAE = [
		"dist/public/js/uae/lib/array-box.js", "dist/public/js/uae/lib/date-box.js", "dist/public/js/uae/lib/dom-box.js", 
		"dist/public/js/uae/lib/i18n-box.js",  "dist/public/js/uae/lib/number-box.js", "dist/public/js/uae/lib/string-box.js", 
		"dist/public/js/uae/lib/validator-box.js", "dist/public/js/uae/lib/util-box.js"
	];
	const JS_UAE_IRSE = [
		"dist/public/js/uae/irse/i18n.js", "dist/public/js/uae/irse/perfil.js", "dist/public/js/uae/irse/organicas.js", 
		"dist/public/js/uae/irse/imputacion.js", "dist/public/js/uae/irse/rutas.js", "dist/public/js/uae/irse/dietas.js", 
		"dist/public/js/uae/irse/irse.js"
	];

	gulp.src(JS_FILES).pipe(uglify()).pipe(gulp.dest("dist")).on("end", () => {
		fnConcat(JS_UAE, "dist/public/js/uae", "uae-min.js");
		fnConcat(JS_UAE_IRSE, "dist/public/js/uae", "irse-min.js").on("end", done);
	});
});

// Task to build dist when deployment on server
gulp.task("deploy", ["modules", "minify-html", "minify-css", "minify-js"]);

gulp.task("watch", () => {
	gulp.watch(HTML_PATH, gulp.series("minify-html"));
	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(JS_FILES, gulp.series("minify-js"));
	// Other watchers ...
});

gulp.task("default", gulp.series("modules", "minify-html", "minify-css", "minify-js", "watch"));

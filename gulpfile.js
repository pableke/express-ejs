
//npm remove gulp gulp-concat gulp-uglify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-rename gulp-minify-ejs
//npm install -D gulp gulp-concat gulp-uglify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-rename gulp-minify-ejs
import fs from "fs"; //file system module
import path from "path"; //file and directory paths
import { spawn } from "child_process";
import gulp from "gulp"; // automatizer module
import htmlmin from "gulp-htmlmin";
import minifyejs from "gulp-minify-ejs";
import uglify from 'gulp-uglify';
import concat from "gulp-concat";
import cssmin from "gulp-clean-css";
import strip from "gulp-strip-comments";
import rename from "gulp-rename";

const CSS_FILES = "src/**/*.css";
const JS_FILES = [ "src/**/*.js", "src/**/*.mjs" ];
const HTML_PATH = [ "src/**/*.html", "src/**/*.ejs" ];
const RM_OPTS = { recursive: true, force: true };

function symdir(source, dest, name) {
	const name1 = path.basename(source);
	fs.rmSync(path.join(dest, name), RM_OPTS);
	return gulp.src(source).pipe(gulp.symlink(dest)).on("end", () => {
		fs.renameSync(path.join(dest, name1), path.join(dest, name));
	});
}
function fnConcat(source, dest, name) {
	return gulp.src(source).pipe(concat(name)).pipe(gulp.dest(dest));
}

// Server task
var node;
gulp.task("server", done => {
	if (node) node.kill();
	node = spawn("node", [ "./dist/index.js" ], { stdio: "inherit" });
	node.on("close", function(code) {
		if (code === 8)
			gulp.log("Error detected, waiting for changes...");
	});
	done();
});

// Tasks to copy sources to dist
gulp.task("modules", done => {
	const FOLDERS = [ // Structure
		"dist", "dist/modules", "dist/public", "dist/views", 
		"dist/public/files", "dist/public/files/uploads/", "dist/public/files/thumbs/"
	];
	fs.rmSync("dist/views", RM_OPTS);
	FOLDERS.forEach(dir => (fs.existsSync(dir) || fs.mkdirSync(dir)));

	gulp.src("dist").pipe(gulp.symlink("node_modules/app"));
	gulp.src("dist/modules").pipe(gulp.symlink("node_modules/app"));
	gulp.src("src/**/*").pipe(gulp.dest("dist/")).on("end", done);
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
	gulp.src(CSS_FILES).pipe(cssmin(config)).pipe(gulp.dest("dist")).on("end", () => {
		fnConcat("dist/modules/**/*.css", "dist/public", "styles-min.css").on("end", done);
	});
});
// Tasks to minify JS's
gulp.task("minify-js", done => {
	const stream = gulp.src(JS_FILES).pipe(uglify()).pipe(gulp.dest("dist"));
	stream.on("end", done);
});

// Tasks for module WEB
gulp.task("module-web", done => {
	gulp.src("dist/modules/web").pipe(gulp.symlink("node_modules/app"));
	gulp.src("dist/public/js/lib").pipe(gulp.symlink("node_modules/app"));
	symdir("dist/modules/web/public/js", "dist/public/js", "web");
	symdir("dist/modules/web/views", "dist/views", "web").on("end", done);
});
// Tasks for module TEST
gulp.task("module-test", done => {
	gulp.src("dist/modules/test").pipe(gulp.symlink("node_modules/app"));
	symdir("dist/modules/test/public/js", "dist/public/js", "test");
	symdir("dist/modules/test/views", "dist/views", "test").on("end", done);
});
// Tasks for module UAE
gulp.task("module-uae", done => {
	gulp.src("dist/modules/uae").pipe(gulp.symlink("node_modules/app"));
	symdir("dist/modules/uae/public/js", "dist/public/js", "uae");

	const JS_UAE = [
		"dist/modules/uae/public/js/lib/array-box.js", "dist/modules/uae/public/js/lib/date-box.js", "dist/modules/uae/public/js/lib/dom-box.js", 
		"dist/modules/uae/public/js/lib/i18n-box.js",  "dist/modules/uae/public/js/lib/number-box.js", "dist/modules/uae/public/js/lib/string-box.js", 
		"dist/modules/uae/public/js/lib/validator-box.js", "dist/modules/uae/public/js/lib/util-box.js"
	];
	fnConcat(JS_UAE, "dist/public/js/uae", "uae-min.js");

	const JS_UAE_IRSE = [
		"dist/modules/uae/public/js/irse/i18n.js", "dist/modules/uae/public/js/irse/perfil.js", "dist/modules/uae/public/js/irse/organicas.js", 
		"dist/modules/uae/public/js/irse/imputacion.js", "dist/modules/uae/public/js/irse/rutas.js", "dist/modules/uae/public/js/irse/dietas.js", 
		"dist/modules/uae/public/js/irse/irse.js"
	];
	fnConcat(JS_UAE_IRSE, "dist/public/js/uae", "irse-min.js").on("end", done);
});

gulp.task("watch", () => {
	gulp.watch(HTML_PATH, gulp.series("minify-html"));
	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(JS_FILES, gulp.series("minify-js", "server"));
	// Other watchers ...
});

gulp.task("default", gulp.series("modules", "minify-html", "minify-css", "minify-js", 
								"module-web", "module-test", "module-uae",
								"server", "watch"));

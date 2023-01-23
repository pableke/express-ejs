
//npm remove gulp gulp-concat gulp-uglify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-minify-inline gulp-replace gulp-rename gulp-minify-ejs
//npm install -D gulp gulp-concat gulp-uglify gulp-clean-css gulp-htmlmin gulp-strip-comments gulp-minify-inline gulp-replace gulp-rename gulp-minify-ejs
import fs from "fs"; //file system module
import path from "path"; //file and directory paths
import url from "url"; // Url handler
import gulp from "gulp"; // automatizer module
import htmlmin from "gulp-htmlmin";
import minifyejs from "gulp-minify-ejs";
import uglify from 'gulp-uglify';
import concat from "gulp-concat";
import cssmin from "gulp-clean-css";
import cssInline from 'gulp-minify-inline';
import strip from "gulp-strip-comments";
//const replace from "gulp-replace");
//const rename from "gulp-rename");

// Settings
const FOLDERS = [ "dist", "dist/controllers", "dist/dao", "dist/i18n", "dist/routes" ];
const MODULES = [ "src/*.js", "src/controllers/**/*.js", "src/dao/**/*.js", "src/i18n/**/*.js", "src/routes/**/*.js" ];
const HTML_PATH = [ "src/views/**/*.html", "src/views/**/*.ejs" ];
const CSS_FILES = [ "src/public/css/web/**/*.css" ];
const JS_MOD = [ "src/public/js/mod/**/*.js", "src/public/js/mod/**/*.mjs" ];
const JS_WEB = [ "src/public/js/web/**/*.js", "src/public/js/web/**/*.mjs" ];
const JS_UAE = [
	"src/public/js/lib/array-box.js", "src/public/js/lib/date-box.js", "src/public/js/lib/dom-box.js", "src/public/js/lib/i18n-box.js", 
	"src/public/js/lib/number-box.js", "src/public/js/lib/string-box.js", "src/public/js/lib/validator-box.js", "src/public/js/uae/util-box.js"
];
const JS_UAE_IRSE = [
	"src/public/js/uae/irse/i18n.js", "src/public/js/uae/irse/perfil.js", "src/public/js/uae/irse/organicas.js", "src/public/js/uae/irse/imputacion.js", 
	"src/public/js/uae/irse/rutas.js", "src/public/js/uae/irse/dietas.js", "src/public/js/uae/irse/irse.js"
];
const JS_UAE_PRESTO = [ "src/public/js/uae/presto/**/*.js", "src/public/js/uae/presto/**/*.mjs" ];
const JS_UAE_XECO = [ "src/public/js/uae/xeco/**/*.js", "src/public/js/uae/xeco/**/*.mjs" ];

// Task to minify all views (HTML's and EJS's)
gulp.task("minify-html", done => {
	const config = {
		collapseWhitespace: true,
		removeComments: false, //removeComments => remove CDATA
		removeRedundantAttributes: true //remove attr with default value
	};
	var stream = gulp.src(HTML_PATH).pipe(strip()).pipe(htmlmin(config)).pipe(cssInline()).pipe(minifyejs())
				//.pipe(replace('<base href="src/">', '<base href="dist/">'))
				.pipe(gulp.dest("dist/views"));
	stream.on("end", () => {
		gulp.src("dist/views").pipe(gulp.symlink("node_modules/app"));
		done();
	});
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
gulp.task("minify-js", done => {
	var stream = gulp.src(JS_MOD).pipe(uglify()).pipe(gulp.dest("dist/public/js/mod"));
	stream.on("end", () => {
		gulp.src("dist/public/js/mod").pipe(gulp.symlink("node_modules/app"));
		done();
	});
});
gulp.task("minify-js-web", () => {
	return gulp.src(JS_WEB)
				.pipe(concat("web-min.js"))
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
gulp.task("minify-js-uae-irse", () => {
	return gulp.src(JS_UAE_IRSE)
				.pipe(concat("irse-min.js"))
				.pipe(uglify())
				.pipe(gulp.dest("src/public/js/uae"))
				.pipe(gulp.dest("dist/public/js/uae"));
});
gulp.task("minify-js-uae-presto", () => {
	return gulp.src(JS_UAE_PRESTO)
				.pipe(concat("presto-min.js"))
				.pipe(uglify())
				.pipe(gulp.dest("src/public/js/uae"))
				.pipe(gulp.dest("dist/public/js/uae"));
});
gulp.task("minify-js-uae-xeco", () => {
	return gulp.src(JS_UAE_XECO)
				.pipe(concat("xeco-min.js"))
				.pipe(uglify())
				.pipe(gulp.dest("src/public/js/uae"))
				.pipe(gulp.dest("dist/public/js/uae"));
});

// Tasks to copy sources to dist
gulp.task("copy-modules", () => {
	FOLDERS.forEach(dir => (fs.existsSync(dir) || fs.mkdirSync(dir)));
	MODULES.forEach((mod, i) => gulp.src(mod).pipe(gulp.dest(FOLDERS[i])));
	gulp.src("src/public/*.json").pipe(gulp.dest("dist/public"));
	gulp.src("src/public/files/**/*").pipe(gulp.dest("dist/public/files"));
	return gulp.src("src/public/img/**/*").pipe(gulp.dest("dist/public/img"));
});

// Task to create symlink in root => node_modules
gulp.task("symlinks", () => {
	gulp.src("dist/dao").pipe(gulp.symlink("node_modules/app"));
	gulp.src("dist/i18n").pipe(gulp.symlink("node_modules/app"));
	gulp.src("dist/controllers").pipe(gulp.symlink("node_modules/app"));

	gulp.src("dist").pipe(gulp.symlink("node_modules/app"));
	//const root = url.fileURLToPath(new URL(".", import.meta.url));
	//fs.symlink(root + "dist/config.js", root + "node_modules/app", console.error);
});

gulp.task("watch", () => {
	gulp.watch(HTML_PATH, gulp.series("minify-html"));
	gulp.watch(MODULES, gulp.series("copy-modules"));
	gulp.watch(CSS_FILES, gulp.series("minify-css"));
	gulp.watch(JS_MOD, gulp.series("minify-js"));
	gulp.watch(JS_WEB, gulp.series("minify-js-web"));
	gulp.watch(JS_UAE, gulp.series("minify-js-uae"));
	gulp.watch(JS_UAE_IRSE, gulp.series("minify-js-uae-irse"));
	gulp.watch(JS_UAE_PRESTO, gulp.series("minify-js-uae-presto"));
	gulp.watch(JS_UAE_XECO, gulp.series("minify-js-uae-xeco"));
	// Other watchers ...
});

gulp.task("default", gulp.parallel("minify-html", 
									"minify-css", 
									"minify-js", "minify-js-web", "minify-js-uae", "minify-js-uae-irse", "minify-js-uae-presto", "minify-js-uae-xeco",
									"copy-modules", "symlinks", 
									"watch"));

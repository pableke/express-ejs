
const gulp = require("gulp");
const minifyejs = require("gulp-minify-ejs");

gulp.task("minify-html", function() {
	return gulp.src(["src/views/**/*.ejs", "src/views/**/*.html"])
				.pipe(minifyejs())
				//.pipe(rename({suffix:".min"}))
				.pipe(gulp.dest("dist/views"))
});

gulp.task("default", gulp.parallel("minify-html"));

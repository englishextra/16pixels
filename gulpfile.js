/*global require */
/*!
 * @see {@link https://github.com/mildrenben/surface/blob/master/gulpfile.js}
 * @see {@link https://www.webstoemp.com/blog/gulp-setup/}
 * @see {@link https://gulpjs.com/plugins/blackList.json}
 * @see {@link https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885}
 * @see {@link https://stackoverflow.com/questions/36897877/gulp-error-the-following-tasks-did-not-complete-did-you-forget-to-signal-async}
 * @see {@link https://zzz.buzz/2016/11/19/gulp-4-0-upgrade-guide/}
 * @see {@link https://blog.khophi.co/migrate-gulp-4-complete-example/}
 * @see {@link https://www.joezimjs.com/javascript/complete-guide-upgrading-gulp-4/}
 * @see {@link https://codeburst.io/switching-to-gulp-4-0-271ae63530c0}
 */

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var minifyCss = require("gulp-clean-css");
var cleanCssOptions = {
	level: {
		1: {
			specialComments: 0
		}
	}
};
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");

var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

/*!
 * @see {@link https://github.com/postcss/autoprefixer#options}
 */
var autoprefixer = require("gulp-autoprefixer");
var autoprefixerOptions;
autoprefixerOptions = {
	browsers: ["last 2 versions"]
};

/*!
 * @see {@link https://github.com/beautify-web/js-beautify}
 * a JSON-formatted file indicated by the --config parameter
 * a .jsbeautifyrc file containing JSON data at any level of the filesystem above $PWD
 * using external config may cause
 * failure to find it
 * if the input/output files reside higher
 * than the config file itself
 */
/* var beautify = require("gulp-jsbeautifier"); */
var beautifyOptions;
beautifyOptions = {
	/* "config": ".jsbeautifyrc", */
	"editorconfig": false,
	"indent_size": 4,
	"indent_char": "\t",
	"indent_with_tabs": true,
	"eol": "\n",
	"end_with_newline": true,
	"indent_level": 0,
	"preserve_newlines": true,
	"max_preserve_newlines": 10,
	"html": {
		"indent_inner_html": true,
		"indent_scripts": false,
		"js": {},
		"css": {}
	},
	"css": {
		"newline_between_rules": true
	},
	"js": {
		"space_in_paren": false,
		"space_in_empty_paren": false,
		"jslint_happy": false,
		"space_after_anon_function": true,
		"space_after_named_function": false,
		"brace_style": "collapse",
		"unindent_chained_methods": false,
		"break_chained_methods": true,
		"keep_array_indentation": true,
		"unescape_strings": false,
		"wrap_line_length": 0,
		"e4x": false,
		"comma_first": false,
		"operator_position": "before-newline"
	}
};

/*!
 * @see {@link https://prettier.io/docs/en/options.html}
 * using external config may cause
 * failure to find it
 * if the input/output files reside higher
 * than the config file itself
 */
var prettier = require("gulp-prettier");
var prettierOptions;
prettierOptions = {
	/* "config": ".prettierrc", */
	"tabWidth": 4,
	"useTabs": true,
	"endOfLine": "lf",
	"printWidth:": 0
};

var stripDebug = require("gulp-strip-debug");

var csslint = require("gulp-csslint");

var options = {
	libPaths: {
		scss: "./scss/*.scss",
		css: "./css"
	},
};

gulp.task("compile-css", function () {
	return gulp.src(options.libPaths.scss)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass({
			errLogToConsole: true
		}))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(prettier(prettierOptions))
	/* .pipe(beautify(beautifyOptions)) */
	.pipe(plumber.stop())
	.pipe(gulp.dest(options.libPaths.css))
	.pipe(rename(function (path) {
			path.basename += ".min";
		}))
	.pipe(minifyCss(cleanCssOptions))
	.pipe(sourcemaps.write("."))
	.pipe(gulp.dest(options.libPaths.css));
});

gulp.task("lint-css", function () {
	return gulp.src(options.libPaths.css)
	.pipe(csslint())
	.pipe(csslint.formatter())
	.pipe(csslint.failFormatter());
});

/*!
 * @see {@link https://browsersync.io/docs/gulp}
 */
gulp.task("browser-sync", gulp.series(gulp.parallel(
			"lint-css"), function watchChanges() {

		browserSync.init({
			server: "./"
		});

		gulp.watch("./*.html").on("change", reload);
		gulp.watch("./css/*.css").on("change", reload);
		gulp.watch("./scss/*.scss", gulp.parallel("compile-css")).on("change", reload);
	}));

gulp.task("default", gulp.task("browser-sync"));

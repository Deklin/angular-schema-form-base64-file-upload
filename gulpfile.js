var gulp = require('gulp');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var streamqueue = require('streamqueue');
var fs = require('fs');
var minifyHtml = require('gulp-minify-html');

gulp.task('default', ['minify', 'connect', 'watch']);

gulp.task('connect', function () {
    connect.server({
        root: ['demo', './'],
        livereload: true,
    });
});

gulp.task('reload', ['minify'], function () {
    gulp.src('./dist/**/*.*').pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./src/**', './demo/**'], ['reload']);
});

gulp.task('minify', function () {
    var files = JSON.parse(fs.readFileSync('sources.json', 'utf-8'));
    var stream = streamqueue({ objectMode: true },
        gulp.src(['src/templates/**/*.html'])
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(templateCache({
                standalone: true,
                root: 'src/templates/',
            })),
        gulp.src(files)
    )
        .pipe(concat('angular-schema-form-base64-file-upload.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(uglify())
        .pipe(rename('angular-schema-form-base64-file-upload.min.js'))
        .pipe(gulp.dest('./dist'));

    return stream;
});

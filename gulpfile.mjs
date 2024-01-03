import gulp from 'gulp';
import sassModule from 'gulp-sass';
import dartSass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import pug from 'gulp-pug';

const sass = sassModule(dartSass);
const bs = browserSync.create();

// Pug
gulp.task('pug', function() {
    return gulp.src('src/**/*.pug')
        .pipe(pug({ pretty: true })) // встановіть `pretty: false` для мініфікації HTML
        .pipe(gulp.dest('dist/'))
        .pipe(bs.stream());
});

// SCSS/SASS
gulp.task('sass', function() {
    return gulp.src('src/css/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'))
        .pipe(bs.stream());
});

// JavaScript
gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(bs.stream());
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('dist/images'));
});

// Запуск BrowserSync та спостереження за файлами
gulp.task('serve', function() {
    bs.init({
        server: "./dist"
    });

    gulp.watch('src/**/*.pug', gulp.series('pug'));
    gulp.watch('src/css/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/**/*.js', gulp.series('scripts'));
    gulp.watch("dist/*.html").on('change', bs.reload);
});

// Задача за замовчуванням
gulp.task('default', gulp.series('pug', 'sass', 'scripts', 'images', 'serve'));

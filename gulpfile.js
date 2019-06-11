var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    concatCss = require('gulp-concat-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps');


// компиляция sass

gulp.task('sass', () => {
    gulp.src('app/sass/**/*.+(sass|scss)')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 version', '>1%', 'ie 8', 'ie 7']))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

//Live reload

gulp.task('watch', ['sass'], () => {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        notify: false
    });

    gulp.watch('app/sass/**/*.+(sass| scss)', ['sass']);
    gulp.watch('app/**/*.(html|js)', browserSync.reload);
});

//конкотинация библиотек

gulp.task('concat-js', () => {
    gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/slick-carousel/slick/slick.min.js',
        'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
        'node_modules/inputmask/dist/jquery.inputmask.bundle.js',
        'node_modules/isotope-layout/dist/isotope.pkgd.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

gulp.task('concat-css', () => {
    gulp.src([
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css'
    ])
        .pipe(concatCss('libs.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('app/css'));
});

gulp.task('concat-all', ['concat-js', 'concat-css']);

//Минификация СВОИХ css / js

gulp.task('js-min', () => {
    gulp.src('app/js/main.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/js'));
});

gulp.task('css-min', () => {
    gulp.src('app/css/style.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

gulp.task('all-min', ['js-min', 'css-min']);

// Подготовить проект к работе

gulp.task('init', ['sass', 'concat-all']);

// Очистить папку build

gulp.task('clean', () => {
    gulp.src('dist', {read: false})
        .pipe(clean());
});

// Собрать проект

gulp.task('build', ['clean', 'sass', 'concat-all', 'all-min'], () => {
    gulp.src('app/css/**/*').pipe(gulp.dest('dist/css'));
    gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));
    gulp.src('app/js/**/*').pipe(gulp.dest('dist/js'));
    gulp.src('app/img/**/*').pipe(gulp.dest('dist/img'));
    gulp.src(['app/*.html', 'app/*.php', 'favicon.*']).pipe(gulp.dest('dist'));
    
});

// Переименовать отимизированіе картинки и удалить исходники

// ===========================
// Переименовать оптимизированные картинки и удалить исходники
// ===========================
gulp.task('img-rr', () => {
    gulp.src('app/img/**/*-min.*')
        .pipe(rename((opt, file) => {
            opt.basename = opt.basename.slice(0, -4);
            gulp.src('app/img/**/' + file).pipe(clean());
            gulp.src(file.history[0], {read: false}).pipe(clean());
            return opt;
        }))
        .pipe(gulp.dest('app/img'));
});
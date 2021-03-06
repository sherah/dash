/*jslint node: true, stupid: true */
// Node modules
var fs          = require('fs'),
    vm          = require('vm'),
    merge       = require('deeply'),
<<<<<<< HEAD
    chalk       = require('chalk'),
    es          = require('event-stream');
=======
    chalk       = require('chalk');
>>>>>>> release-2

// Gulp and plugins
var gulp                    = require('gulp'),
    rjs                     = require('gulp-requirejs-bundler'),
    concat                  = require('gulp-concat'),
    clean                   = require('gulp-clean'),
    replace                 = require('gulp-replace'),
    uglify                  = require('gulp-uglify'),
    htmlreplace             = require('gulp-html-replace'),
    rev                     = require('gulp-rev'),
    jshint                  = require('gulp-jshint'),
    rename                  = require('gulp-rename'),
    replace                 = require('gulp-replace');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;'),
    requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_modules/requirejs/require'
        },
        include: [
            'requireLib',
            'components/nav-bar/nav-bar',
            'components/home/home',
            'components/app-content/app-content',
            'components/utils/date-pickers/date-pickers',
            'components/widgets/fraud-gauge/fraud-gauge',
<<<<<<< HEAD
=======
            'components/widgets/distance-to-goal-chart/distance-to-goal-chart',
            'components/widgets/totals-earned-chart/totals-earned-chart',
            'components/widgets/amt-per-second-chart/amt-per-second-chart',
            'components/boards/bigEnglish/bigEnglishBoard',
            'components/boards/generic-board/generic-board',
            'components/widgets/x-by-y/x-by-y',
            'components/widgets/cat-trombone/cat-trombone'
>>>>>>> release-2
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
<<<<<<< HEAD
            'date-pickers': ['components/utils/date-pickers/date-pickers'],
=======
            'date-pickers': ['components/utils/date-pickers/date-pickers']
>>>>>>> release-2
            // 'vega-timeseries': ['components/visualizers/vega-timeseries/vega-timeseries']

        }
    });

<<<<<<< HEAD
var jsfilesToLint = ['src/app/*.js', 'src/components/*/*.js'];
=======
var jsfilesToLint = ['**/*.js', '!node_modules/**/*.js', '!src/bower_modules/**/*.js'];
>>>>>>> release-2

// linting
gulp.task('lint', function () {
    return gulp.src(jsfilesToLint)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
<<<<<<< HEAD
gulp.task('js', function () {
=======
gulp.task('js', ['clean'], function () {
>>>>>>> release-2
    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(rev())
        .pipe(gulp.dest('./dist/'))
        .pipe(rev.manifest())
        .pipe(rename('js.manifest.json'))
        .pipe(gulp.dest('./dist/'));
});

<<<<<<< HEAD
gulp.task('css', function () {
    return gulp.src(['src/bower_modules/bootstrap/dist/css/bootstrap.css',
                    'src/bower_modules/nouislider/src/jquery.nouislider.css',
                    'src/bower_modules/fontawesome/css/font-awesome.css',
=======
gulp.task('css', ['clean'], function () {
    return gulp.src(['src/bower_modules/bootstrap/dist/css/bootstrap.css',
                    'src/bower_modules/nouislider/src/jquery.nouislider.css',
                    'src/bower_modules/fontawesome/css/font-awesome.css',
                    'src/bower_modules/lato/css/lato.css',
                    'src/bower_modules/c3/c3.css',
                    'src/bower_modules/select2/select2.css',
>>>>>>> release-2
                    'src/css/*.css'])
        .pipe(concat('style.css')).pipe(rev()).pipe(gulp.dest('./dist/'))
        // Add rev-manifest.json as a new src to prevent rev'ing rev-manifest.json
        .pipe(rev.manifest())
        .pipe(rename('css.manifest.json'))
        .pipe(gulp.dest('./dist/'));
});

/** Copies semantic fonts where the css expects them to be**/
<<<<<<< HEAD
gulp.task('fonts', function () {
    return gulp.src(['src/bower_modules/fontawesome/fonts/*{ttf,woff,eot,svg,otf}',
                     'src/bower_modules/lato/font/*{ttf,woff,eot,svg}'])
        .pipe(gulp.dest('./fonts/'));
=======
gulp.task('font', ['clean'], function () {
    return gulp.src(['src/bower_modules/lato/font/*{ttf,woff,eot,svg}'])
        .pipe(gulp.dest('./dist/font/'));
});
gulp.task('fonts', ['clean'], function () {
    return gulp.src(['src/bower_modules/fontawesome/fonts/*{ttf,woff,eot,svg,otf}'])
        .pipe(gulp.dest('./dist/fonts/'));
>>>>>>> release-2
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
// with their versioned counterpart
// updates the main require.js file bundle configuration (scripts.js, see above)
// with references to versioned bundles
gulp.task('replace', ['css', 'js'], function () {

    // these manifests have been created by task rev.manifest before
    var jsManifest = JSON.parse(fs.readFileSync('./dist/js.manifest.json', 'utf8'));
    var cssManifest = JSON.parse(fs.readFileSync('./dist/css.manifest.json', 'utf8'));

    // figure out what bundles do we have setup on requirejs
    var bundles = Object.getOwnPropertyNames(jsManifest).filter(function (p) {
        return p !== 'scripts.js';
    });

    var regex = '';
    bundles.forEach(function (element, index, array) {
        var l = element.length;
        // we are trying to match  "project-selector" (quotes-included)
<<<<<<< HEAD
        regex = regex + '\"(' + element.substr(0, element.length - 3) + ')\"\:|';
=======
        regex = regex + '\"(' + element.substr(0, l - 3) + ')\":|';
>>>>>>> release-2

    });

    //remove last '|', out come should be like: "(project-selector)"|"(vega-timeseries)"
    regex = regex.substring(0, regex.length - 1);

    // this build system is so inflexible that makes me want to cry
    function replaceByVersion(match) {
        // remove quotes from match and add ".js"
        // so we can key on the manifest with versions
        match = match.substring(1, match.length - 2);
<<<<<<< HEAD
        match = match + ".js";
=======
        match = match + '.js';
>>>>>>> release-2
        var version = jsManifest[match];

        version = '\"' + version + '\":';
        return version;
    }

<<<<<<< HEAD
    var regexObj = new RegExp(regex, "g");
=======
    var regexObj = new RegExp(regex, 'g');
>>>>>>> release-2

    gulp.src(['./dist/' + jsManifest['scripts.js']])
        .pipe(replace(regexObj, replaceByVersion))
        .pipe(gulp.dest('./dist/'));

    return gulp.src('./src/index.html')
        .pipe(htmlreplace({
            'css': cssManifest['style.css'],
            'js': jsManifest['scripts.js']
        }))
        .pipe(gulp.dest('./dist/'));
});



// Removes all files from ./dist/
gulp.task('clean', function () {
    return gulp.src('./dist/**/*', {
            read: false
        })
        .pipe(clean());
});

<<<<<<< HEAD
gulp.task('default', ['clean', 'replace', 'lint', 'fonts'], function (callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
    console.log('\nPlaced font files in ' + chalk.magenta('fonts/\n'));
=======
gulp.task('images', function() {
    return gulp.src('./src/images/**/*')
           .pipe(gulp.dest('./dist/images/'));
});

gulp.task('default', ['clean', 'replace', 'lint', 'font', 'fonts', 'images'], function (callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
    console.log('\nPlaced font files in ' + chalk.magenta('font/\n'));

    console.log('\nWatching changes... You\'re free to kill off this task now.');
>>>>>>> release-2
});

function logWatcher(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}
gulp.watch('./src/**/*.js', ['js']).on('change', logWatcher);
<<<<<<< HEAD
gulp.watch('./src/**/*.html', ['html']).on('change', logWatcher);
=======
gulp.watch('./src/**/*.html', ['replace']).on('change', logWatcher);
>>>>>>> release-2
gulp.watch('./src/**/*.css', ['css']).on('change', logWatcher);

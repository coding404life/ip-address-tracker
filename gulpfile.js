// ----This file Made by: Yahya Email: 'coding404life@gmail.com' ----
// #Install the gulp command line utility
// npm install --global gulp-cli
// #Create a package.json file in your project directory
// npm init
// #Install the gulp package in your devDependencies
// npm install --save-dev gulp
// #install other gulp-plugins
// 
//npm install --save-dev autoprefixer browser-sync cssnano gulp gulp-concat gulp-image gulp-notify gulp-postcss gulp-replace gulp-sass gulp-sourcemaps gulp-uglify
//---------------------------------------------------


//Initialize modules
const {
    src,
    dest,
    watch,
    series,
    parallel,
    task
} = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss')
const replace = require('gulp-replace')
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const image = require('gulp-image');
const notify = require("gulp-notify");
// const uglifyEs = require('gulp-uglify-es').default;

//file path variables
const files = {
    scssPath: './scss/**/*.scss',
    cssPath: './css/**/*.css',
    jsPath: './js/**/*.js',
    htmlPath: './*.html',
    imagesPath: './images/**'
}

// Sass Task
function scssTask() {
    //my scss file path
    return src(files.scssPath)
        //init sourcemaps
        .pipe(sourcemaps.init())
        //compile sass files into css
        .pipe(sass().on('error', sass.logError))
        //use autoprefixer for vendor prefixes and cssnano to minify
        .pipe(postcss([autoprefixer('last 2 version'), cssnano()]))
        //finish and write the sourcemaps file
        .pipe(sourcemaps.write('.'))
        //set the destination into dist folder for final files
        .pipe(dest('./dist/css'))
        //add notify for sass 
        .pipe(notify("Sass Changes Saved!"))
        //stream changes to all browsers
        .pipe(browserSync.stream());
}

// Js Task
function jsTask() {
    //my js files path
    return src(files.jsPath)
        //concat the js files into one file called all.js
        .pipe(concat('all.js'))
        //minify the js files
        // .pipe(uglifyEs().on('error', console.error))
        //add notify for js 
        .pipe(notify("Js Changes Saved!"))
        //set the destination to dist folder
        .pipe(dest('./dist/js'))
        //stream changes to all browsers
        .pipe(browserSync.stream());
}

// Cachebusting Task
// get the date and time
const cbString = new Date().getTime();

async function cacheBusting() {
    //changes on index.html file
    return src('index.html')
        //replace ?cb=123 to a random number so the browser don't cashe our files
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        //destination of html file after replace
        .pipe(dest('.'));
}
//images compression
async function imgComp() {
    //images source file
    src('./images/*')
        //gulp image compress
        .pipe(image())
        //notify the images been compressed
        .pipe(notify("images Compressed"))
        .pipe(dest('./dist/images'))
        .pipe(browserSync.stream());
}

//notify html
async function htmlTask() {
    //html src  
    src("./index.html")
        //notify this message 
        .pipe(notify("Html Changes Saved!"))
        //stream changes to all browsers
        .pipe(browserSync.stream());
}

// Watch Tasks
function watchTask() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    watch(files.scssPath, parallel(scssTask)).on('change', browserSync.reload);
    watch(files.jsPath, parallel(jsTask)).on('change', browserSync.reload);
    watch(files.htmlPath, parallel(htmlTask)).on('change', browserSync.reload);
    watch(files.imagesPath, parallel(imgComp)).on('change', browserSync.reload);
}

// Defualt Task
exports.default = series(
    parallel(imgComp, scssTask, jsTask),
    cacheBusting,
    watchTask,
    htmlTask,
    imgComp
);
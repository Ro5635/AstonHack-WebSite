/**
* Gulpfile
*
* Gulp is responsible for the compiling of the SASS content within the site and the combining of the page segments
* (header, footer etc) together into single complete pages. This is a bit contrived but I did not want to use jekyll.
*
* The javascripts are also combined, perhaps with webpack intergration in the future...  
*
* Astonhack 2017 website
*
*/

const gulp = require('gulp');
// const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const compass = require('gulp-compass');
const sass = require('gulp-ruby-sass');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');

const sassOptions = {
	errLogToConsole: true,
	outputStyle: 'compressed'
};

const autoprefixerOptions = {
	browsers : ['last 2 versions', '> 5%', 'Firefox ESR']
};

// Select all js files in directory or descendant directory's 
const jsFiles = 'Scripts/Base/**/*.js';
const jsDest = 'static/assets/JS';

//SASS Directory
const sassSource = 'sass/**/*.scss';
const sassDest = 'static/assets/stylesheets/';

//
// Gulp Tasks Follow
//


/**
* runTasks
*
* Runs all of the tasks necessary to build the project
*
* THE SASS COMPILE TASK IS CURRENTLY NOT IN THE GUMP BUILD DUE TO ISSUES WITH 
* COMPASS, THIS IS BUILT WITH COMPASS SEPERATLY. THIS IS AN ISSUE UNDER ACTIVE
* DEVELOPEMENT
*/
gulp.task('runTasks', ['compileIndex','compileTicketing', 'scripts'], function(){

});


/**
* Compile index page
*
* Outputted to the route of the static site
*/
gulp.task('compileIndex', function() {
	return gulp.src([
		'partialPages/header.html',
		'partialPages/pageNavigation.html',
		'homePage.html', 
		'partialPages/footer.html'
		])
	.pipe(concat('index.html'))
	.pipe(gulp.dest('./static/'));
});


/**
* Compile the ticketing page
*
* Outputed to the ticketing directory
*/ 
gulp.task('compileTicketing', function(){
	return gulp.src([
		'partialPages/header.html',
		'partialPages/pageNavigation.html',
		'ticketingPage.html', 
		'partialPages/footer.html'
		])
	.pipe(concat('index.html'))
	.pipe(gulp.dest('./static/ticketing/'))

});

/**
* Compile SASS
*
* SASS is compiled and compressed and placed in the CSS directory in the static site
* This is not currently working, this is something to do with Compass, however for now
* I am going to continue to use ruby Compass to compile the SASS; this is due to time 
* constraints.
*/
gulp.task('sass', function(){
	return gulp.src(sassSource)
	.pipe(compass({
			config_file: 'config.rb',
			css: sassDest,
			sass: sassSource
		}))
	// .pipe(sass(sassOptions))
	.pipe(autoprefixer())
	.pipe(gulp.dest(sassDest))

});

/**
* Compile Javascripts
*
* Conjoin the base scripts , minify and transfer to the static directorys.
*/
gulp.task('scripts', function(){
	return gulp.src(jsFiles)
	.pipe(concat('scripts.js'))
	.pipe(gulp.dest(jsDest))
	.pipe(uglify())
	.pipe(rename('scripts.min.js'))
	.pipe(gulp.dest(jsDest))

});

/**
* Minify all of the images in the source Directory and move them over to the static assets folder
*
*/
gulp.task('images', () =>
    gulp.src('sourceMedia/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('static/assets/media/'))
);
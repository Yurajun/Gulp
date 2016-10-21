var gulp            = require('gulp'), // Подключаем Gulp
		stylus          = require('gulp-stylus'), // Подключаем stylus и gulp-stylus
		browserSync     = require('browser-sync'), // Подключаем Browser Sync
		concat          = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
		uglify          = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
		cssnano         = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
		rename          = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
		del             = require('del'), // Подключаем библиотеку для удаления файлов и папок
		imagemin        = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
		pngquant        = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
		cache           = require('gulp-cache'), // Подключаем библиотеку кеширования
		autoprefixer    = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
		haml            = require('gulp-ruby-haml'), // Подключаем пакет для преобразования haml в html также нужно подключить пакет gulp-watch
		debug           = require('gulp-debug'), // Показывает что происходит во время выполгегия задачи
		sourcemaps      = require('gulp-sourcemaps'), // Записывает что происходило с файлом в файл или рядом с ним
		remember        = require('gulp-remember'), //Запоминает те файлы которые через него прошли
		newer           = require('gulp-newer'); // Если такаяже или новая мод файла он не пропускает его дальше


gulp.task('styl', function() { // Создаем task Styl
	return gulp.src('app/styl/**/*.styl')
		.pipe(remember('styles'))
		.pipe(stylus())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: false}))
		.pipe(sourcemaps.write()) // Добовляет итоговую sourceMap в сам файл '.'- писать в тотже каталог
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('haml', function() {
	return gulp.src('app/**/*.haml', {read: true})         //('frontend/**/*.haml', {base: 'frontend'})
		.pipe(haml().on('error', function(e) { console.log(e.message); }))
		.pipe(gulp.dest('app'))
		.pipe(debug({title: 'dest'}));
		//.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'app' // Директория для сервера - app
		},
		notify: false // Отключаем уведомления
	});
});


gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});


gulp.task('css-libs', ['styl'], function() {
	return gulp.src([ // Выбираем файл для минификации
		'app/css/ind_css/styles__mob.css', 
		'app/css/ind_css/styles__480.css',
		'app/css/ind_css/styles__788.css',
		'app/css/ind_css/styles__960.css',
		'app/css/main.css'
		])
		.pipe(cssnano({ minifyFontValues: false, discardUnused: false })) // Сжимаем
		.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
		.pipe(gulp.dest('app/css/min_css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch('app/**/*.styl', ['styl']); // Наблюдение за sass файлами в папке sass
	gulp.watch('app/**/*.haml', ['haml']); // Наблюдение за haml файлами в корне проекта
	gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'styl', 'scripts'], function() {

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'app/css/**/*.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
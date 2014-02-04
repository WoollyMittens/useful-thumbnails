module.exports = function(grunt) {

	// components
	var name = 'thumbnails';
	var components = [
		'../useful-transitions/src/useful-transitions.js',
		'../useful-polyfills/src/useful-polyfills.js',
		'./lib/*.js',
		'./src/*.js'
	];

	// configuration.
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			compass: {
				files: ['./scss/*.{scss,sass}'],
				tasks: ['compass']
			},
			jshint: {
				files: ['./src/*.js'],
				tasks: ['jshint']
			},
			concat: {
				files: ['./src/*.js'],
				tasks: ['concat']
			}
		},
		compass: {
			all: {
				options: {
					sassDir: ['./scss'],
					cssDir: ['./css'],
					environment: 'development'
				}
			},
			prod: {
				options: {
					sassDir: ['./scss'],
					cssDir: ['./css'],
					environment: 'production'
				}
			}
		},
		jshint: {
			files: ['./src/*.js'],
			options: {
				globals: {
					console: true
				}
			}
		},
		concat: {
			all: {
				src: components,
				dest: './js/useful-' + name + '.js'
			}
		},
		uglify: {
			prod: {
				files: {
					//'./js/useful-catalog.js': components
				}
			}
		}
	};

	// named properties
	config.uglify.prod.files['./js/useful-' + name + '.js'] = components;

	// init
	grunt.initConfig(config);

	// dependencies
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// tasts
	grunt.registerTask('default', ['compass', 'jshint', 'concat' , 'watch']);
	grunt.registerTask('watch', ['compass', 'jshint', 'concat' , 'watch']);
	grunt.registerTask('dev', ['compass', 'jshint', 'concat']);
	grunt.registerTask('prod', ['compass', 'uglify']);

};
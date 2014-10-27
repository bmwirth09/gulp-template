'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var template = _.template;

module.exports = function (data, options) {
	if (options.returnFunction && data){
		this.emit('error', new gutil.PluginError('gulp-template', 'Cannot pass data and return a compiled function'));
	}

	// If undefined is passed in for data to _.template, the compiled function is returned, not html
	data = (options.returnFunction) ? undefined : data || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-template', 'Streaming not supported'));
			return;
		}

		if (file.data) {
			data = _.extend(file.data, data);
		}

		try {
			file.contents = new Buffer(template(file.contents.toString(), data, options));
			this.push(file);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-template', err, {fileName: file.path}));
		}

		cb();
	});
};

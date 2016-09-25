'use strict';
var path = require('path');
var pathKey = require('path-key');
var objectAssign = require('object-assign');

module.exports = function (opts) {
	opts = objectAssign({
		cwd: process.cwd(),
		path: process.env[pathKey()]
	}, opts);

	var prev;
	var pth = path.resolve(opts.cwd);

	var ret = [];

	while (prev !== pth) {
		ret.push(path.join(pth, 'node_modules/.bin'));
		prev = pth;
		pth = path.resolve(pth, '..');
	}

	// ensure the running `node` binary is used
	ret.push(path.dirname(process.execPath));

	return ret.concat(opts.path).join(path.delimiter);
};

module.exports.env = function (opts) {
	opts = objectAssign({
		env: objectAssign({}, process.env)
	}, opts);

	var path = pathKey();
	var env = opts.env;

	opts.path = env[path];
	env[path] = module.exports(opts);

	return env;
};

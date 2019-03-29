'use strict';
const path = require('path');
const pathKey = require('path-key');

const npmRunPath = options => {
	options = {
		cwd: process.cwd(),
		path: process.env[pathKey()],
		...options
	};

	let previous;
	let cwdPath = path.resolve(options.cwd);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path.join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path.resolve(cwdPath, '..');
	}

	const execDir = getExecDir(options);

	return result.concat(execDir, options.path).join(path.delimiter);
};

// Ensure the running `node` binary is used.
// Noop if the directory is already in `PATH`
const getExecDir = function (options) {
	const execDir = path.normalize(path.dirname(process.execPath));
	return options.path.split(path.delimiter).some(inputPath => path.normalize(inputPath) === execDir) ?
		[] :
		[execDir];
};

module.exports = npmRunPath;
module.exports.default = npmRunPath;

module.exports.env = options => {
	options = {
		env: process.env,
		...options
	};

	const env = {...options.env};
	const path = pathKey({env});

	options.path = env[path];
	env[path] = module.exports(options);

	return env;
};

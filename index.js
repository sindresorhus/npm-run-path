import process from 'node:process';
import {resolve, join, delimiter} from 'node:path';
import {fileURLToPath} from 'node:url';
import pathKey from 'path-key';

export const npmRunPath = ({
	cwd = process.cwd(),
	path = process.env[pathKey()],
	preferLocal = true,
	execPath = process.execPath,
	addExecPath = true,
} = {}) => {
	const cwdString = cwd instanceof URL ? fileURLToPath(cwd) : cwd;
	const cwdPath = resolve(cwdString);
	const result = [];

	if (preferLocal) {
		applyPreferLocal(result, cwdPath);
	}

	if (addExecPath) {
		applyExecPath(result, execPath, cwdPath);
	}

	return [...result, path].join(delimiter);
};

const applyPreferLocal = (result, cwdPath) => {
	let previous;

	while (previous !== cwdPath) {
		result.push(join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = resolve(cwdPath, '..');
	}
};

// Ensure the running `node` binary is used
const applyExecPath = (result, execPath, cwdPath) => {
	const execPathString = execPath instanceof URL ? fileURLToPath(execPath) : execPath;
	result.push(resolve(cwdPath, execPathString, '..'));
};

export const npmRunPathEnv = ({env = process.env, ...options} = {}) => {
	env = {...env};

	const path = pathKey({env});
	options.path = env[path];
	env[path] = npmRunPath(options);

	return env;
};

import process from 'node:process';
import path from 'node:path';
import pathKey from 'path-key';
import {toPath, traversePathUp} from 'unicorn-magic';

export const npmRunPath = ({
	cwd = process.cwd(),
	path: pathOption = process.env[pathKey()],
	preferLocal = true,
	execPath = process.execPath,
	addExecPath = true,
} = {}) => {
	const cwdPath = path.resolve(toPath(cwd));
	const result = [];

	if (preferLocal) {
		applyPreferLocal(result, cwdPath);
	}

	if (addExecPath) {
		applyExecPath(result, execPath, cwdPath);
	}

	return [...result, pathOption].join(path.delimiter);
};

const applyPreferLocal = (result, cwdPath) => {
	for (const directory of traversePathUp(cwdPath)) {
		result.push(path.join(directory, 'node_modules/.bin'));
	}
};

// Ensure the running `node` binary is used
const applyExecPath = (result, execPath, cwdPath) => {
	result.push(path.resolve(cwdPath, toPath(execPath), '..'));
};

export const npmRunPathEnv = ({env = process.env, ...options} = {}) => {
	env = {...env};

	const pathName = pathKey({env});
	options.path = env[pathName];
	env[pathName] = npmRunPath(options);

	return env;
};

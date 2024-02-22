import process from 'node:process';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import test from 'ava';
import {npmRunPath, npmRunPathEnv} from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const testLocalDir = (t, addExecPath, preferLocal, expectedResult) => {
	t.is(
		npmRunPath({path: '', addExecPath, preferLocal}).split(path.delimiter)[0] === path.join(__dirname, 'node_modules/.bin'),
		expectedResult,
	);
};

test('Adds node_modules/.bin - npmRunPath()', testLocalDir, undefined, undefined, true);
test('"addExecPath: false" still adds node_modules/.bin - npmRunPath()', testLocalDir, false, undefined, true);
test('"preferLocal: false" does not add node_modules/.bin - npmRunPath()', testLocalDir, undefined, false, false);
test('"preferLocal: false", "addExecPath: false" does not add node_modules/.bin - npmRunPath()', testLocalDir, false, false, false);

const testLocalDirEnv = (t, addExecPath, preferLocal, expectedResult) => {
	t.is(
		npmRunPathEnv({env: {PATH: 'foo'}, addExecPath, preferLocal}).PATH.split(path.delimiter)[0] === path.join(__dirname, 'node_modules/.bin'),
		expectedResult,
	);
};

test('Adds node_modules/.bin - npmRunPathEnv()', testLocalDirEnv, undefined, undefined, true);
test('"addExecPath: false" still adds node_modules/.bin - npmRunPathEnv()', testLocalDirEnv, false, undefined, true);
test('"preferLocal: false" does not add node_modules/.bin - npmRunPathEnv()', testLocalDirEnv, undefined, false, false);
test('"preferLocal: false", "addExecPath: false" does not add node_modules/.bin - npmRunPathEnv()', testLocalDirEnv, false, false, false);

test('the `cwd` option changes the current directory', t => {
	t.is(
		npmRunPath({path: '', cwd: '/dir'}).split(path.delimiter)[0],
		path.normalize('/dir/node_modules/.bin'),
	);
});

test('the `cwd` option can be a file URL', t => {
	t.is(
		npmRunPath({path: '', cwd: new URL('file:///dir')}).split(path.delimiter)[0],
		path.normalize('/dir/node_modules/.bin'),
	);
});

test('push `execPath` later in the PATH', t => {
	const pathEnv = npmRunPath({path: ''}).split(path.delimiter);
	t.is(pathEnv[pathEnv.length - 2], path.dirname(process.execPath));
});

const testExecPath = (t, preferLocal, addExecPath, expectedResult) => {
	const pathEnv = npmRunPath({path: '', execPath: 'test/test', preferLocal, addExecPath}).split(path.delimiter);
	t.is(pathEnv[pathEnv.length - 2] === path.resolve('test'), expectedResult);
};

test('can change `execPath` with the `execPath` option - npmRunPath()', testExecPath, undefined, undefined, true);
test('"preferLocal: false" still adds execPath - npmRunPath()', testExecPath, false, undefined, true);
test('"addExecPath: false" does not add execPath - npmRunPath()', testExecPath, undefined, false, false);
test('"addExecPath: false", "preferLocal: false" does not add execPath - npmRunPath()', testExecPath, false, false, false);

const testExecPathEnv = (t, preferLocal, addExecPath, expectedResult) => {
	const pathEnv = npmRunPathEnv({env: {PATH: 'foo'}, execPath: 'test/test', preferLocal, addExecPath}).PATH.split(path.delimiter);
	t.is(pathEnv[pathEnv.length - 2] === path.resolve('test'), expectedResult);
};

test('can change `execPath` with the `execPath` option - npmRunPathEnv()', testExecPathEnv, undefined, undefined, true);
test('"preferLocal: false" still adds execPath - npmRunPathEnv()', testExecPathEnv, false, undefined, true);
test('"addExecPath: false" does not add execPath - npmRunPathEnv()', testExecPathEnv, undefined, false, false);
test('"addExecPath: false", "preferLocal: false" does not add execPath - npmRunPathEnv()', testExecPathEnv, false, false, false);

test('the `execPath` option can be a file URL', t => {
	const pathEnv = npmRunPath({path: '', execPath: pathToFileURL('test/test')}).split(path.delimiter);
	t.is(pathEnv[pathEnv.length - 2], path.resolve('test'));
});

test('the `execPath` option is relative to the `cwd` option', t => {
	const pathEnv = npmRunPath({
		path: '',
		execPath: 'test/test',
		cwd: '/dir',
	}).split(path.delimiter);
	t.is(pathEnv[pathEnv.length - 2], path.normalize('/dir/test'));
});

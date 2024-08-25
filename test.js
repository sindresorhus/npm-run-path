import process from 'node:process';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import test from 'ava';
import {npmRunPath, npmRunPathEnv} from './index.js';

const localBinaryDirectory = fileURLToPath(new URL('node_modules/.bin', import.meta.url));

const testLocalDirectory = (t, addExecPath, preferLocal, expectedResult) => {
	t.is(
		npmRunPath({path: '', addExecPath, preferLocal}).split(path.delimiter)[0] === localBinaryDirectory,
		expectedResult,
	);
};

test('Adds node_modules/.bin - npmRunPath()', testLocalDirectory, undefined, undefined, true);
test('"addExecPath: false" still adds node_modules/.bin - npmRunPath()', testLocalDirectory, false, undefined, true);
test('"preferLocal: false" does not add node_modules/.bin - npmRunPath()', testLocalDirectory, undefined, false, false);
test('"preferLocal: false", "addExecPath: false" does not add node_modules/.bin - npmRunPath()', testLocalDirectory, false, false, false);

const testLocalDirectoryEnv = (t, addExecPath, preferLocal, expectedResult) => {
	t.is(
		npmRunPathEnv({env: {PATH: 'foo'}, addExecPath, preferLocal}).PATH.split(path.delimiter)[0] === localBinaryDirectory,
		expectedResult,
	);
};

test('Adds node_modules/.bin - npmRunPathEnv()', testLocalDirectoryEnv, undefined, undefined, true);
test('"addExecPath: false" still adds node_modules/.bin - npmRunPathEnv()', testLocalDirectoryEnv, false, undefined, true);
test('"preferLocal: false" does not add node_modules/.bin - npmRunPathEnv()', testLocalDirectoryEnv, undefined, false, false);
test('"preferLocal: false", "addExecPath: false" does not add node_modules/.bin - npmRunPathEnv()', testLocalDirectoryEnv, false, false, false);

test('node_modules/.bin is not added twice', t => {
	const firstPathEnv = npmRunPath({path: ''});
	const pathEnv = npmRunPath({path: firstPathEnv});
	const execPaths = pathEnv
		.split(path.delimiter)
		.filter(pathPart => pathPart === localBinaryDirectory);
	t.is(execPaths.length, 1);
});

test('the `cwd` option changes the current directory', t => {
	t.is(
		npmRunPath({path: '', cwd: './dir'}).split(path.delimiter)[0],
		path.resolve('./dir/node_modules/.bin'),
	);
});

test('the `cwd` option can be a file URL', t => {
	t.is(
		npmRunPath({path: '', cwd: new URL('dir', import.meta.url)}).split(path.delimiter)[0],
		fileURLToPath(new URL('dir/node_modules/.bin', import.meta.url)),
	);
});

test('push `execPath` later in the PATH', t => {
	const pathEnv = npmRunPath({path: ''}).split(path.delimiter);
	t.is(pathEnv.at(-1), path.dirname(process.execPath));
});

test('`execPath` is not added twice', t => {
	const firstPathEnv = npmRunPath({path: ''});
	const pathEnv = npmRunPath({path: firstPathEnv});
	const execPaths = pathEnv
		.split(path.delimiter)
		.filter(pathPart => pathPart === path.dirname(process.execPath));
	t.is(execPaths.length, 1);
});

const testExecPath = (t, preferLocal, addExecPath, expectedResult) => {
	const pathEnv = npmRunPath({
		path: '',
		execPath: 'test/test',
		preferLocal,
		addExecPath,
	}).split(path.delimiter);
	t.is(pathEnv.at(-1) === path.resolve('test'), expectedResult);
};

test('can change `execPath` with the `execPath` option - npmRunPath()', testExecPath, undefined, undefined, true);
test('"preferLocal: false" still adds execPath - npmRunPath()', testExecPath, false, undefined, true);
test('"addExecPath: false" does not add execPath - npmRunPath()', testExecPath, undefined, false, false);
test('"addExecPath: false", "preferLocal: false" does not add execPath - npmRunPath()', testExecPath, false, false, false);

const testExecPathEnv = (t, preferLocal, addExecPath, expectedResult) => {
	const pathEnv = npmRunPathEnv({
		env: {PATH: 'foo'},
		execPath: 'test/test',
		preferLocal,
		addExecPath,
	}).PATH.split(path.delimiter);
	t.is(pathEnv.at(-2) === path.resolve('test'), expectedResult);
};

test('can change `execPath` with the `execPath` option - npmRunPathEnv()', testExecPathEnv, undefined, undefined, true);
test('"preferLocal: false" still adds execPath - npmRunPathEnv()', testExecPathEnv, false, undefined, true);
test('"addExecPath: false" does not add execPath - npmRunPathEnv()', testExecPathEnv, undefined, false, false);
test('"addExecPath: false", "preferLocal: false" does not add execPath - npmRunPathEnv()', testExecPathEnv, false, false, false);

test('the `execPath` option can be a file URL', t => {
	const pathEnv = npmRunPath({path: '', execPath: pathToFileURL('test/test')}).split(path.delimiter);
	t.is(pathEnv.at(-1), path.resolve('test'));
});

test('the `execPath` option is relative to the `cwd` option', t => {
	const pathEnv = npmRunPath({
		path: '',
		execPath: 'test/test',
		cwd: './dir',
	}).split(path.delimiter);
	t.is(pathEnv.at(-1), path.resolve('./dir/test'));
});

test('the PATH can remain empty', t => {
	t.is(npmRunPath({path: '', preferLocal: false, addExecPath: false}), '');
});

const testEmptyPath = (t, pathValue, shouldEndWithDelimiter, hasTwoDelimiters) => {
	const pathEnv = npmRunPath({path: pathValue});
	t.not(pathEnv, '');
	t.false(pathEnv.startsWith(path.delimiter));
	t.is(pathEnv.endsWith(path.delimiter), shouldEndWithDelimiter);
	t.is(pathEnv.includes(`${path.delimiter}${path.delimiter}`), hasTwoDelimiters);
};

test('the PATH can be empty', testEmptyPath, '', false, false);
test('the PATH can be ; or :', testEmptyPath, path.delimiter, true, false);
test('the PATH can start with ; or :', testEmptyPath, `${path.delimiter}foo`, false, true);
test('the PATH can end with ; or :', testEmptyPath, `foo${path.delimiter}`, true, false);

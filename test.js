import process from 'node:process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import {npmRunPath, npmRunPathEnv} from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('main', t => {
	t.is(
		npmRunPath({path: ''}).split(path.delimiter)[0],
		path.join(__dirname, 'node_modules/.bin'),
	);

	t.is(
		npmRunPathEnv({env: {PATH: 'foo'}}).PATH.split(path.delimiter)[0],
		path.join(__dirname, 'node_modules/.bin'),
	);
});

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

test('can change `execPath` with the `execPath` option', t => {
	const pathEnv = npmRunPath({path: '', execPath: 'test/test'}).split(
		path.delimiter,
	);
	t.is(pathEnv[pathEnv.length - 2], path.resolve(process.cwd(), 'test'));
});

test('the `execPath` option is relative to the `cwd` option', t => {
	const pathEnv = npmRunPath({
		path: '',
		execPath: 'test/test',
		cwd: '/dir',
	}).split(path.delimiter);
	t.is(pathEnv[pathEnv.length - 2], path.normalize('/dir/test'));
});

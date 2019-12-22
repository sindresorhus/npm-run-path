import path from 'path';
import test from 'ava';
import npmRunPath from '.';

test('main', t => {
	t.is(
		npmRunPath({path: ''}).split(path.delimiter)[0],
		path.join(__dirname, 'node_modules/.bin')
	);

	t.is(
		npmRunPath.env({env: {PATH: 'foo'}}).PATH.split(path.delimiter)[0],
		path.join(__dirname, 'node_modules/.bin')
	);
});

test('push `execPath` later in the PATH', t => {
	const pathEnv = npmRunPath({path: ''}).split(path.delimiter);
	t.is(pathEnv[pathEnv.length - 2], path.dirname(process.execPath));
});

test('can change `execPath` with the `execPath` option', t => {
	const pathEnv = npmRunPath({path: '', execPath: 'test/test'}).split(
		path.delimiter
	);
	t.is(pathEnv[pathEnv.length - 2], path.resolve(process.cwd(), 'test'));
});

test('the `execPath` option is relative to the `cwd` option', t => {
	const pathEnv = npmRunPath({
		path: '',
		execPath: 'test/test',
		cwd: '/dir'
	}).split(path.delimiter);
	t.is(pathEnv[pathEnv.length - 2], path.normalize('/dir/test'));
});

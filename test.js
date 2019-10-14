import path from 'path';
import test from 'ava';
import npmRunPath from '.';

test('main', t => {
	t.is(
		npmRunPath({path: ''}).split(path.delimiter)[1],
		path.join(__dirname, 'node_modules/.bin')
	);

	t.is(
		npmRunPath.env({env: {PATH: 'foo'}}).PATH.split(path.delimiter)[1],
		path.join(__dirname, 'node_modules/.bin')
	);
});

test('push `execPath` to the front of the PATH', t => {
	t.is(
		npmRunPath({path: ''}).split(path.delimiter)[0],
		path.dirname(process.execPath)
	);
});

test('can change `execPath` with the `execPath` option', t => {
	t.is(
		npmRunPath({path: '', execPath: 'test/test'}).split(path.delimiter)[0],
		path.resolve(process.cwd(), 'test')
	);
});

test('the `execPath` option is relative to the `cwd` option', t => {
	t.is(
		npmRunPath({path: '', execPath: 'test/test', cwd: '/dir'}).split(path.delimiter)[0],
		path.normalize('/dir/test')
	);
});

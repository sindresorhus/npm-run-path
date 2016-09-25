import path from 'path';
import test from 'ava';
import m from './';

test(t => {
	t.is(
		m({path: ''}).split(path.delimiter)[0],
		path.join(__dirname, 'node_modules/.bin')
	);
	t.is(
		m.env({env: {PATH: 'foo'}}).PATH.split(path.delimiter)[0],
		path.join(__dirname, 'node_modules/.bin')
	);
});

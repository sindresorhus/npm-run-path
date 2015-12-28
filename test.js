import path from 'path';
import test from 'ava';
import fn from './';

test(t => {
	t.is(fn({path: ''}).split(path.delimiter)[0], path.join(__dirname, 'node_modules/.bin'));
});

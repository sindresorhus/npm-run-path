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

test('does not repeat execPath directory', t => {
	const execDir = path.dirname(process.execPath);
	const result = npmRunPath({path: execDir});
	const execDirs = result.split(path.delimiter).filter(resultPath => resultPath === execDir);
	t.is(execDirs.length, 1);
});

test('does not repeat execPath directory even when using a different form', t => {
	const execDir = `${path.dirname(process.execPath)}/.`;
	const result = npmRunPath({path: execDir});
	const execDirs = result.split(path.delimiter).filter(resultPath => path.normalize(resultPath) === path.normalize(execDir));
	t.is(execDirs.length, 1);
});

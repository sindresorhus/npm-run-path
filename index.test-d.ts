import process from 'node:process';
import {expectType} from 'tsd';
import {npmRunPath, npmRunPathEnv, ProcessEnv} from './index.js';

expectType<string>(npmRunPath());
expectType<string>(npmRunPath({cwd: '/foo'}));
expectType<string>(npmRunPath({cwd: new URL('file:///foo')}));
expectType<string>(npmRunPath({path: '/usr/local/bin'}));
expectType<string>(npmRunPath({execPath: '/usr/local/bin'}));

expectType<ProcessEnv>(npmRunPathEnv());
expectType<ProcessEnv>(npmRunPathEnv({cwd: '/foo'}));
expectType<ProcessEnv>(npmRunPathEnv({cwd: new URL('file:///foo')}));
expectType<ProcessEnv>(npmRunPathEnv({env: process.env})); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
expectType<ProcessEnv>(npmRunPathEnv({execPath: '/usr/local/bin'}));

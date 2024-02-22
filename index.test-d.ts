import process from 'node:process';
import {expectType, expectError} from 'tsd';
import {npmRunPath, npmRunPathEnv, ProcessEnv} from './index.js';

const fileUrl = new URL('file:///foo');

expectType<string>(npmRunPath());
expectType<string>(npmRunPath({cwd: '/foo'}));
expectType<string>(npmRunPath({cwd: fileUrl}));
expectError(npmRunPath({cwd: false}));
expectType<string>(npmRunPath({path: '/usr/local/bin'}));
expectError(npmRunPath({path: fileUrl}));
expectError(npmRunPath({path: false}));
expectType<string>(npmRunPath({execPath: '/usr/local/bin'}));
expectType<string>(npmRunPath({execPath: fileUrl}));
expectError(npmRunPath({execPath: false}));
expectType<string>(npmRunPath({addExecPath: false}));
expectError(npmRunPath({addExecPath: ''}));
expectType<string>(npmRunPath({preferLocal: false}));
expectError(npmRunPath({preferLocal: ''}));

expectType<ProcessEnv>(npmRunPathEnv());
expectType<ProcessEnv>(npmRunPathEnv({cwd: '/foo'}));
expectType<ProcessEnv>(npmRunPathEnv({cwd: fileUrl}));
expectError(npmRunPathEnv({cwd: false}));
expectType<ProcessEnv>(npmRunPathEnv({env: process.env})); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
expectType<ProcessEnv>(npmRunPathEnv({env: {foo: 'bar'}}));
expectType<ProcessEnv>(npmRunPathEnv({env: {foo: undefined}}));
expectError(npmRunPath({env: false}));
expectError(npmRunPath({env: {[Symbol('key')]: 'bar'}}));
expectError(npmRunPath({env: {foo: false}}));
expectType<ProcessEnv>(npmRunPathEnv({execPath: '/usr/local/bin'}));
expectType<ProcessEnv>(npmRunPathEnv({execPath: fileUrl}));
expectError(npmRunPath({execPath: false}));
expectType<ProcessEnv>(npmRunPathEnv({addExecPath: false}));
expectError(npmRunPathEnv({addExecPath: ''}));
expectType<ProcessEnv>(npmRunPathEnv({preferLocal: false}));
expectError(npmRunPathEnv({preferLocal: ''}));

import {expectType} from 'tsd';
import npmRunPath = require('.');
import {ProcessEnv} from '.';

expectType<string>(npmRunPath());
expectType<string>(npmRunPath({cwd: '/foo'}));
expectType<string>(npmRunPath({path: '/usr/local/bin'}));
expectType<string>(npmRunPath({execPath: '/usr/local/bin'}));

expectType<ProcessEnv>(npmRunPath.env());
expectType<ProcessEnv>(npmRunPath.env({cwd: '/foo'}));
expectType<ProcessEnv>(npmRunPath.env({env: process.env}));
expectType<ProcessEnv>(npmRunPath.env({execPath: '/usr/local/bin'}));

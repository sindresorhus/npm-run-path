import {expectType} from 'tsd-check';
import npmRunPath, {ProcessEnv} from '.';

expectType<string>(npmRunPath());
expectType<string>(npmRunPath({cwd: '/foo'}));
expectType<string>(npmRunPath({path: '/usr/local/bin'}));

expectType<ProcessEnv>(npmRunPath.env());
expectType<ProcessEnv>(npmRunPath.env({cwd: '/foo'}));
expectType<ProcessEnv>(npmRunPath.env({env: process.env}));

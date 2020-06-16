import {expectType} from 'tsd';
import codeExcerpt = require('.');
import {ExcerptLine} from '.';

codeExcerpt('x', 1);
codeExcerpt('x', 1, {around: 3});

expectType<ExcerptLine[] | undefined>(codeExcerpt('x', 1));
expectType<number>(codeExcerpt('x', 1)![0].line);
expectType<string>(codeExcerpt('x', 1)![0].value);

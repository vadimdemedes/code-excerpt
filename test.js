import test from 'ava';
import codeExcerpt from './';

function trimExcerpt(excerpt) {
	return excerpt.map(({line, value}) => ({line, value: value.trim()}));
}

const source = `
'use strict';

function someFunc() {}

module.exports = () => {
	const a = 1;
	const b = 2;
	const c = 3;

	someFunc();
};
`.trim();

test('fail when code is missing', t => {
	t.throws(() => codeExcerpt(), 'Source code is missing.');
});

test('fail when line number is missing', t => {
	t.throws(() => codeExcerpt(source), 'Line number must start from `1`.');
});

test('fail when line number is bigger than total number of lines', t => {
	t.throws(() => codeExcerpt(source, 100, 'Line number `100` is bigger than a total number of lines (11).'));
});

test('excerpt in the middle', t => {
	const excerpt = codeExcerpt(source, 5);

	t.deepEqual(trimExcerpt(excerpt), [
		{line: 2, value: ''},
		{line: 3, value: 'function someFunc() {}'},
		{line: 4, value: ''},
		{line: 5, value: 'module.exports = () => {'},
		{line: 6, value: 'const a = 1;'},
		{line: 7, value: 'const b = 2;'},
		{line: 8, value: 'const c = 3;'}
	]);
});

test('excerpt in the beginning', t => {
	const excerpt = codeExcerpt(source, 1);

	t.deepEqual(trimExcerpt(excerpt), [
		{line: 1, value: '\'use strict\';'},
		{line: 2, value: ''},
		{line: 3, value: 'function someFunc() {}'},
		{line: 4, value: ''}
	]);
});

test('excerpt in the end', t => {
	const excerpt = codeExcerpt(source, 11);

	t.deepEqual(trimExcerpt(excerpt), [
		{line: 8, value: 'const c = 3;'},
		{line: 9, value: ''},
		{line: 10, value: 'someFunc();'},
		{line: 11, value: '};'}
	]);
});

test('extract custom number of lines around', t => {
	const excerpt = codeExcerpt(source, 5, {around: 1});

	t.deepEqual(trimExcerpt(excerpt), [
		{line: 4, value: ''},
		{line: 5, value: 'module.exports = () => {'},
		{line: 6, value: 'const a = 1;'}
	]);
});

test('convert tabs to spaces for consistent output', t => {
	const excerpt = codeExcerpt(source, 5, {around: 10});

	t.deepEqual(excerpt, [
		{line: 1, value: '\'use strict\';           '},
		{line: 2, value: '                        '},
		{line: 3, value: 'function someFunc() {}  '},
		{line: 4, value: '                        '},
		{line: 5, value: 'module.exports = () => {'},
		{line: 6, value: '  const a = 1;          '},
		{line: 7, value: '  const b = 2;          '},
		{line: 8, value: '  const c = 3;          '},
		{line: 9, value: '                        '},
		{line: 10, value: '  someFunc();           '},
		{line: 11, value: '};                      '}
	]);
});

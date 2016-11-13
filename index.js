'use strict';

const tabsToSpaces = require('convert-to-spaces');

function generateLineNumbers(line, around) {
	const lineNumbers = [];

	const min = line - around;
	const max = line + around;

	for (let lineNumber = min; lineNumber <= max; lineNumber++) {
		lineNumbers.push(lineNumber);
	}

	return lineNumbers;
}

function extendLines(source) {
	const lines = source.split('\n');
	const maxLength = Math.max.apply(null, lines.map(line => line.length));

	return lines
		.map(line => {
			if (line.length < maxLength) {
				line += ' '.repeat(maxLength - line.length);
			}

			return line;
		})
		.join('\n');
}

module.exports = (source, line, options) => {
	if (typeof source !== 'string') {
		throw new TypeError('Source code is missing.');
	}

	if (!line || line < 1) {
		throw new TypeError('Line number must start from `1`.');
	}

	source = extendLines(tabsToSpaces(source)).split('\n');

	if (line > source.length) {
		throw new TypeError(`Line number \`${line}\` is bigger than a total number of lines (${source.length}).`);
	}

	options = Object.assign({
		around: 3
	}, options);

	return generateLineNumbers(line, options.around)
		.filter(line => source[line - 1] !== undefined)
		.map(line => ({line, value: source[line - 1]}));
};

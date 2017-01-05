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

function extendLines(lines) {
	const maxLength = Math.max.apply(null, lines.map(line => line.value.length));

	return lines
		.map(line => {
			if (line.value.length < maxLength) {
				line.value += ' '.repeat(maxLength - line.value.length);
			}

			return line;
		});
}

module.exports = (source, line, options) => {
	if (typeof source !== 'string') {
		throw new TypeError('Source code is missing.');
	}

	if (!line || line < 1) {
		throw new TypeError('Line number must start from `1`.');
	}

	source = tabsToSpaces(source).split('\n');

	if (line > source.length) {
		throw new TypeError(`Line number \`${line}\` is bigger than a total number of lines (${source.length}).`);
	}

	options = Object.assign({
		around: 3,
		equalLength: true
	}, options);

	const output = generateLineNumbers(line, options.around)
		.filter(line => source[line - 1] !== undefined)
		.map(line => ({line, value: source[line - 1]}));

	return options.equalLength ? extendLines(output) : output;
};

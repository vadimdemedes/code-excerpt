import tabsToSpaces from 'convert-to-spaces';

const generateLineNumbers = (line: number, around: number): number[] => {
	const lineNumbers: number[] = [];

	const min = line - around;
	const max = line + around;

	for (let lineNumber = min; lineNumber <= max; lineNumber++) {
		lineNumbers.push(lineNumber);
	}

	return lineNumbers;
};

interface Options {
	around?: number;
}

export interface CodeExcerpt {
	line: number;
	value: string;
}

const codeExcerpt = (
	source: string,
	line: number,
	options: Options = {},
): CodeExcerpt[] | undefined => {
	if (typeof source !== 'string') {
		throw new TypeError('Source code is missing.');
	}

	if (!line || line < 1) {
		throw new TypeError('Line number must start from `1`.');
	}

	const lines = tabsToSpaces(source).split(/\r?\n/);

	if (line > lines.length) {
		return;
	}

	return generateLineNumbers(line, options.around ?? 3)
		.filter(line => lines[line - 1] !== undefined)
		.map(line => ({line, value: lines[line - 1]!}));
};

export default codeExcerpt;

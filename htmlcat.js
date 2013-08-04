#!/usr/local/bin/node

/*!
 * ================================================================
 * 
 * htmlcat
 * https://github.com/fluidblue/htmlcat
 * 
 * Copyright by Max Geissler
 * http://maxgeissler.com
 * 
 * You should have received a copy of the license along with this
 * program; if not, see <https://github.com/fluidblue/htmlcat>
 * 
 * ================================================================
 */

var fs = require('fs');
var colors = require('colors');
var path = require('path');
var optimist = require('optimist');

/* Global variables section */

// Regular expression matching the include pattern:
// {% include path/to/filename.ext %}
var reIncludePattern = /\{(\s*)%(\s*)include(\s+)(.*)(\s*)%(\s*)\}/gi;

// Regular expression matching the filename in an include pattern
var reFilename = /include(\s+)(.*)(\s*)%/i;

// Print additional information
var verboseMode = false;

/* End of global variables section */

// Recursively process file
function processFile(file, parentFile)
{
	try
	{
		data = fs.readFileSync(file, 'utf8');
	}
	catch (err)
	{
		console.log(('Error: Cannot read file ' + file + ' (included in ' + parentFile + ')').red);

		if (verboseMode)
			console.log(err);

		process.exit(1);
	}

	// Check extension
	switch (path.extname(file))
	{
		// Recursively process these files
		case ".htm":
		case ".html":
		case ".txt":
			break;

		// Only read content for these files
		default:
			return data;
	}

	// Replace function
	var fnReplace = function (includePattern)
	{
		// Get filename
		nestedFile = includePattern.match(reFilename)[2];

		// Remove whitespaces after filename
		nestedFile = nestedFile.trim();

		// Apply path
		nestedFile = path.resolve(path.dirname(file) + '/' + nestedFile);
		
		// Log
		if (verboseMode)
			console.log('Info: Found ' + includePattern + ' => Processing ' + nestedFile);

		// Recursively process file
		return processFile(nestedFile, file);
	}

	return data.replace(reIncludePattern, fnReplace);
}

// Save data to file
function saveFile(file, data)
{
	fs.writeFile(file, data, function (err)
	{
		if (err)
		{
			console.log(('Error: Cannot save output file ' + file).red);
			console.log(err);
			process.exit(1);
		}

		console.log('Finished.'.green);
	});
}

function getArgv()
{
	return optimist.usage('Concatenate HTML files.\nUsage: $0')
		.demand('i')
		.alias('i', 'in')
		.describe('i', 'Input file')

		.alias('o', 'out')
		.describe('o', 'Output file')
		.default('o', 'out.htm')

		.alias('v', 'verbose')
		.describe('v', 'Verbose mode')
		.boolean('v')

		.argv;
}

// Main entry
function main()
{
	// Get command line options
	var argv = getArgv();

	// Greet the user
	console.log('Welcome to htmlcat.'.blue);

	// Get input and output filenames
	var inFile = argv.in;
	var outFile = argv.out;
	verboseMode = argv.verbose;

	if (outFile == undefined || outFile === '')
		outFile = 'out.htm';

	if (path.resolve(inFile) === path.resolve(outFile))
	{
		console.log('Error: Output file cannot be the same as the input file.'.red);
		process.exit(1);
	}

	console.log('Input file: ' + inFile + '\nOutput file: ' + outFile);

	// Process files and save content to output file
	saveFile(outFile, processFile(inFile));
}

// Start
main();

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
var argv = require('optimist').argv;
var colors = require('colors');
var asyncReplace = require('async-replace');
var path = require('path');

// Recursively process files
function processFile(file, callback)
{
	fs.readFile(file, 'utf8', function (err, data)
	{
		if (err)
		{
			console.log(("Error: Cannot read file " + file).red);
			console.log(err);
			process.exit(1);
		}

		// Regular expression matching the include pattern:
		// {% include path/to/filename.ext %}
		var reIncludePattern = /\{(\s*)%(\s*)include(\s+)(.*)(\s*)%(\s*)\}/gi;

		var fnReplace = function (includePattern, p1, p2, p3, offset, string, done)
		{
			// Get filename
			var reFilename = /include(\s+)(.*)(\s*)%/i;
			nestedFile = includePattern.match(reFilename)[2];

			// Remove whitespaces after filename
			nestedFile = nestedFile.trim();

			// Apply path
			nestedFile = path.resolve(path.dirname(file) + "/" + nestedFile);
			
			console.log("Info: Found " + includePattern + " => Processing " + nestedFile);

			// Recursively process file
			processFile(nestedFile, function (data)
			{
				// Pass processed data

				// TODO: Not working. Bug in async-replace module?
				//done(null, data);
			});
		}

		asyncReplace(data, reIncludePattern, fnReplace, function (err, result)
		{
			// TODO: Check err

			// Pass processed data
			callback(result);
		});

		// data = data.replace(reIncludePattern, function(includePattern) 
		// {
		// 	// Get filename
		// 	var reFilename = /include(\s+)(.*)(\s*)%/i;
		// 	filename = includePattern.match(reFilename)[2];

		// 	// Remove whitespaces after filename
		// 	filename = filename.trim();

		// 	console.log(includePattern);
		// 	console.log(filename);

		// 	processFile(filename, function (data)
		// 	{
		// 		asd
		// 	});

		// 	return "X";
		// });
	});
}

// Save data to file
function saveFile(file, data)
{
	fs.writeFile(file, data, function (err)
	{
		if (err)
		{
			console.log(("Error: Cannot save output file " + file).red);
			console.log(err);
			process.exit(1);
		}

		console.log('Finished.');
	});
}

// Greet the user
console.log("Welcome to htmlcat.");

// Get input and output filenames
var inFile = argv._[0];
var outFile = argv.out;
//var verboseMode = argv.verbose;

if (outFile == undefined || outFile === "")
	outFile = "out.htm";

if (inFile === outFile)
{
	console.log("Error: Output file cannot be the same as the input file.".red);
	process.exit(1);
}

console.log("Input file: " + inFile + "\nOutput file: " + outFile);

// Process files
processFile(inFile, function(data)
{
	// Save content to output file
	saveFile(outFile, data);
});

# htmlcat

htmlcat concatenates HTML files. With htmlcat, you can include HTML files into each other.


## Syntax

Just use standard HTML. If you want to include another file use

    {% include path/to/file.htm %}

You can use this include pattern anywhere, even inside tag attributes:

    <a href="{% include location.txt %}">Link</a>

As seen above you are not limited to HTML files, but you can include any text file with any extension.
Files are recursively parsed, this means you can include files, that include more files.

Note: Only .htm and .html are parsed. Other files can only be included.


## Install

Install htmlcat with the node package manager:

    npm install -g htmlcat

After that, you can use it from the commandline:

    htmlcat --in index.htm --out out.htm


## Example

File index.htm:

    <!DOCTYPE html>
    <html>
    <head>
    	  <title>{% include title.txt %}</title>
    </head>
    <body>
      	{% include a.htm %}
      	<div>
      		  {% include b.htm %}
      	</div>
    </body>
    </html>

File title.txt

    Title

File a.htm

    Content A
    <a href="#">Link</a>
    {% include b.htm %}
    More text

File b.htm

    Some more content in <b>file B</b>...

will be concatenated to:

    <!DOCTYPE html>
    <html>
        <head>
            <title>Title</title>
        </head>
        <body>
          Content A
          <a href="#">Link</a>
          Some more content in <b>file B</b>...
          More text
          <div>
              Some more content in <b>file B</b>...
          </div>
        </body>
    </html>


## Bugs

Please report bugs to <https://github.com/fluidblue/htmlcat/issues>


## License

Copyright (C) 2013 Max Geissler

This program is free software, licensed under the GNU General Public License (GPL).
Please see the [License](LICENSE) for further information.

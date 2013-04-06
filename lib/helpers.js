/*
 * helper-lib
 * https://github.com/assemble/helper-lib
 *
 * Copyright (c) 2013 Assemble, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

/*
 * Add any handlebars helpers here and they'll
 * be loaded into templates.js so they can
 * be used inside your handlebars templates
 */

(function() {

  // figure out if this is node or browser
  var isServer = (typeof process !== 'undefined');

  var register = function(Handlebars) {

    var Dates     = require('./utils/dates');
    var HTML      = require('./utils/html');
    var Utils     = require('./utils/utils');
    
    var __indexOf = [].indexOf || function(item) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) {
          return i;
        }
      } return -1;
    };

    // if(isServer) {
    var assemble = require('../../../assemble.js');
    var fs       = require('fs');
    var util     = require('util');
    var path     = require('path');
    var dest     = './';
    var markdown = assemble.Markdown({gfm: true, highlight: 'auto'});
    // }

    /**
     * Authors
     * 
     * Reads in data from an "AUTHORS" file to generate markdown formtted
     * author or list of authors for a README.md. Accepts a second optional 
     * parameter to a different file than the default.
     *
     * Syntax: {{authors [file]}}
     * 
     */
    Handlebars.registerHelper('authors', function(authors) {
      if (Utils.isUndefined(authors)) {
        authors = fs.readFileSync('./AUTHORS', 'utf8');
      } else {
        authors = fs.readFileSync(authors, 'utf8');
      }
      var matches = authors.replace(/(.*?)\s*\((.*)\)/g, '[$1]' + '($2)') || [];
      return new Handlebars.SafeString(matches);
    });

    /**
     * Embed 
     * 
     * Embeds code from an external file as preformatted text. The first parameter
     * requires a path to the file you want to embed. There is a second optional 
     * parameter to specify (force) syntax highlighting for a specific language. 
     * 
     * Pattern: 
     *     {{ embed [file] [lang] }}
     *     
     * Usage:
     *
     *     {{ embed 'src/examples/Gruntfile.js' 'javascript' }}
     * 
     */
    Handlebars.registerHelper('embed', function(file, language) {
      file = fs.readFileSync(file, 'utf8');
      if (Utils.isUndefined(language)) {
        language = '';
      }
      var result = '``` ' + language + '\n' + file + '\n```';
      return new Handlebars.SafeString(result);
    });

    /**
     * Basename
     * Returns the basename of a given file. 
     *
     * Usage:
     *     {{base "docs/toc.md"}}
     *     
     * Returns:
     *     toc
     */
    Handlebars.registerHelper('basename', function(base, ext) {
      var fullName = path.basename(base, ext);
      base = path.basename(base, path.extname(fullName))
      return base;
    });

    /**
     * Relative path
     * Returns the derived relative path from one to the other.
     */
    Handlebars.registerHelper('relative', function(from, to) {
      var relativePath = path.relative(from, to);

      if(relativePath === "." || relativePath.length === 0) {
        relativePath = dest;
      }
      relativePath = Utils.urlNormalize(path.relative(
        path.resolve(path.join(dest, relative)),
        path.resolve(relativePath)
      ));
      return relativePath;
    });

    /**
     * Gist
     *
     * Downloads and embeds public GitHub Gists by adding only 
     * the Id of the Gist. The helper also accepts an optional 
     * second parameter for targeting a specific file on the Gist.
     * 
     * Usage: <script src="https://gist.github.com/jonschlinkert/886631fbb7d4efacba50.js"></script>
     *        <script src="https://gist.github.com/jonschlinkert/886631fbb7d4efacba50#file-pagination-js"></script>
     *     {{ gist [id] [file] }}
     *
     */
    Handlebars.registerHelper('gist', function(id, file) {
      id = Handlebars.Utils.escapeExpression(id);
      if (Utils.isUndefined(file)) {
        file = '';
      }
      var result = '<script src="https://gist.github.com/' + id + '.js"></script>';
      return new Handlebars.SafeString(result);
    });

    /**
     * link helper function.
     *
     * This will escape the passed in parameters, but mark the response as safe,
     * so Handlebars will not try to escape it even if the "triple-stash" is not used.
     *
     * Usage:
     *
     *     {{link 'href' 'title'}}
     *
     */
    Handlebars.registerHelper('link', function(url, text) {
      url  = Handlebars.Utils.escapeExpression(url);
      text = Handlebars.Utils.escapeExpression(text);
      var result = '<a class="" href="' + url + '" title="' + text + '">' + text + '</a>';
      return new Handlebars.SafeString(result);
    });


    /* Handlebars Helpers - Dan Harper (http://github.com/danharper) 
     *
     * This program is free software. It comes without any warranty, to
     * the extent permitted by applicable law. You can redistribute it
     * and/or modify it under the terms of the Do What The Fuck You Want
     * To Public License, Version 2, as published by Sam Hocevar. See
     * http://sam.zoy.org/wtfpl/COPYING for more details. */

    /**
     * If Equals
     * if_eq this compare=that
     */
    Handlebars.registerHelper('if_eq', function(context, options) {
      if (context === options.hash.compare) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    /**
     * Unless Equals
     * unless_eq this compare=that
     */
    Handlebars.registerHelper('unless_eq', function(context, options) {
      if (context === options.hash.compare) {
        return options.inverse(this);
      }
      return options.fn(this);
    });


    /**
     * If Greater Than
     * if_gt this compare=that
     */
    Handlebars.registerHelper('if_gt', function(context, options) {
      if (context > options.hash.compare) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    /**
     * Unless Greater Than
     * unless_gt this compare=that
     */
    Handlebars.registerHelper('unless_gt', function(context, options) {
      if (context > options.hash.compare) {
        return options.inverse(this);
      }
      return options.fn(this);
    });


    /**
     * If Less Than
     * if_lt this compare=that
     */
    Handlebars.registerHelper('if_lt', function(context, options) {
      if (context < options.hash.compare) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    /**
     * Unless Less Than
     * unless_lt this compare=that
     */
    Handlebars.registerHelper('unless_lt', function(context, options) {
      if (context < options.hash.compare) {
        return options.inverse(this);
      }
      return options.fn(this);
    });


    /**
     * If Greater Than or Equal To
     * if_gteq this compare=that
     */
    Handlebars.registerHelper('if_gteq', function(context, options) {
      if (context >= options.hash.compare) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    /**
     * Unless Greater Than or Equal To
     * unless_gteq this compare=that
     */
    Handlebars.registerHelper('unless_gteq', function(context, options) {
      if (context >= options.hash.compare) {
        return options.inverse(this);
      }
      return options.fn(this);
    });


    /**
     * If Less Than or Equal To
     * if_lteq this compare=that
     */
    Handlebars.registerHelper('if_lteq', function(context, options) {
      if (context <= options.hash.compare) {
        return options.fn(this);
      }
      return options.inverse(this);
    });

    /**
     * Unless Less Than or Equal To
     * unless_lteq this compare=that
     */
    Handlebars.registerHelper('unless_lteq', function(context, options) {
      if (context <= options.hash.compare) {
        return options.inverse(this);
      }
      return options.fn(this);
    });

    /**
     * Convert new line (\n) to <br>
     * from http://phpjs.org/functions/nl2br:480
     */
    Handlebars.registerHelper('nl2br', function(text) {
      var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
      return new Handlebars.SafeString(nl2br);
    });

    /**
     * Hyphenate
     * Replace spaces in string with hyphens.
     */
    Handlebars.registerHelper('hyphenate', function(tag) {
      return tag.split(' ').join('-');
    });

    /**
     * Dashify
     * Replace periods in string with hyphens.
     */
    Handlebars.registerHelper('dashify', function(tag) {
      return tag.split('.').join('-');
    });

    /**
     * To Lower Case
     * Turns a string to lowercase.
     */
    Handlebars.registerHelper('lowercase', function(str) {
      return str.toLowerCase();
    });

    /**
     * To Upper Case
     * Turns a string to uppercase.
     */
    Handlebars.registerHelper('uppercase', function(str) {
      return str.toUpperCase();
    });

    /**
     * Capitalize First
     *
     */
    Handlebars.registerHelper('capitalizeFirst', function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    });

    /**
     * Capitalize Each
     *
     */
    Handlebars.registerHelper('capitalizeEach', function(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
      });
    });

    /**
     * Title Case
     *
     */
    Handlebars.registerHelper('titleize', function(str) {
      var capitalize, title, word, words;
      title = str.replace(/[ \-_]+/g, ' ');
      words = title.match(/\w+/g);
      capitalize = function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      };
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = words.length; _i < _len; _i++) {
          word = words[_i];
          _results.push(capitalize(word));
        }
        return _results;
      })()).join(' ');
    });

    /**
     * Sentence
     *
     */
    Handlebars.registerHelper('sentence', function(str) {
      return str.replace(/((?:\S[^\.\?\!]*)[\.\?\!]*)/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    });

    /**
     * Reverse
     * Reverses a string.
     */
    Handlebars.registerHelper('reverse', function(str) {
      return str.split('').reverse().join('');
    });

    /**
     * Truncate
     * Truncates a string given a specified `length`, providing a custom string to denote an `omission`.
     *
     * Parameters:
     *
     *    length [int] - The number of characters to keep (Required)
     *    omission [string] - A string to denote an omission (Optional)
     *
     * Usage:
     *    {{truncate "Bender should not be allowed on tv." 31 "..."}}
     *    Bender should not be allowed...
     */
    Handlebars.registerHelper('truncate', function(str, length, omission) {
      if (Utils.isUndefined(omission)) {
        omission = '';
      }
      if (str.length > length) {
        return str.substring(0, length - omission.length) + omission;
      } else {
        return str;
      }
    });

    /**
     * Center
     * Centers a string using non-breaking spaces.
     */
    Handlebars.registerHelper('center', function(str, spaces) {
      var i, space;
      space = '';
      i = 0;
      while (i < spaces) {
        space += '&nbsp;';
        i++;
      }
      return "" + space + str + space;
    });


    // ==========================================================
    //
    // COLLECTIONS
    //
    // ==========================================================


    /**
     * First
     * Returns the first item in a collection.
     */
    Handlebars.registerHelper('first', function(array, count) {
      if (Utils.isUndefined(count)) {
        return array[0];
      } else {
        return array.slice(0, count);
      }
    });

    /**
     * withFirst
     * Use the first item in a collection inside a block.
     */
    Handlebars.registerHelper('withFirst', function(array, count, options) {
      var item, result;
      if (Utils.isUndefined(count)) {
        options = count;
        return options.fn(array[0]);
      } else {
        array = array.slice(0, count);
        result = '';
        for (item in array) {
          result += options.fn(array[item]);
        }
        return result;
      }
    });

    /**
     * Last
     * Returns the last item in a collection. Opposite of `first`.
     */
    Handlebars.registerHelper('last', function(array, count) {
      if (Utils.isUndefined(count)) {
        return array[array.length - 1];
      } else {
        return array.slice(-count);
      }
    });

    /**
     * With Last
     * Use the last item in a collection inside a block. Opposite of `withFirst`.
     */
    Handlebars.registerHelper('withLast', function(array, count, options) {
      var item, result;
      if (Utils.isUndefined(count)) {
        options = count;
        return options.fn(array[array.length - 1]);
      } else {
        array = array.slice(-count);
        result = '';
        for (item in array) {
          result += options.fn(array[item]);
        }
        return result;
      }
    });

    /**
     * After
     * Returns all of the items in the collection after the specified count.
     */
    Handlebars.registerHelper('after', function(array, count) {
      return array.slice(count);
    });

    /**
     * With After
     * Use all of the items in the collection after the specified count inside a block.
     */
    Handlebars.registerHelper('withAfter', function(array, count, options) {
      var item, result;
      array = array.slice(count);
      result = '';
      for (item in array) {
        result += options.fn(array[item]);
      }
      return result;
    });

    /**
     * Before
     * Returns all of the items in the collection before the specified count. Opposite of `after`.
     */
    Handlebars.registerHelper('before', function(array, count) {
      return array.slice(0, -count);
    });

    /**
     * With Before
     * Use all of the items in the collection before the specified count inside a block. Opposite of `withAfter`.
     */
    Handlebars.registerHelper('withBefore', function(array, count, options) {
      var item, result;
      array = array.slice(0, -count);
      result = '';
      for (item in array) {
        result += options.fn(array[item]);
      }
      return result;
    });

    /**
     * Join
     * Joins all elements of a collection into a string using a separator if specified.
     */
    Handlebars.registerHelper('join', function(array, separator) {
      return array.join(Utils.isUndefined(separator) ? ' ' : separator);
    });

    /**
     * Sort
     * Returns the collection sorted.
     */
    Handlebars.registerHelper('sort', function(array, field) {
      if (Utils.isUndefined(field)) {
        return array.sort();
      } else {
        return array.sort(function(a, b) {
          return a[field] > b[field];
        });
      }
    });

    /**
     * With Sort
     * Uses the sorted collection inside the block.
     */
    Handlebars.registerHelper('withSort', function(array, field, options) {
      var item, result, _i, _len;
      result = '';
      if (Utils.isUndefined(field)) {
        options = field;
        array = array.sort();
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          item = array[_i];
          result += options.fn(item);
        }
      } else {
        array = array.sort(function(a, b) {
          return a[field] > b[field];
        });
        for (item in array) {
          result += options.fn(array[item]);
        }
      }
      return result;
    });

    /**
     * Length
     * Returns the length of the collection.
     */
    Handlebars.registerHelper('length', function(array) {
      return array.length;
    });

    /**
     * Length Equal
     * Conditionally render a block based on the length of a collection.
     */
    Handlebars.registerHelper('lengthEqual', function(array, length, options) {
      if (array.length === length) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * Empty
     * Conditionally render a block if the collection is empty.
     */
    Handlebars.registerHelper('empty', function(array, options) {
      if (array.length <= 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * Any
     * Conditionally render a block if the collection isn't empty. Opposite of `empty`
     */
    Handlebars.registerHelper('any', function(array, options) {
      if (array.length > 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * inArray
     * Conditionally render a block if a specified value is in the collection.
     */
    Handlebars.registerHelper('inArray', function(array, value, options) {
      if (array.indexOf(value) !== -1) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * eachIndex
     * Current implementation of the default Handlebars loop
     * helper {{#each}} adding index (0-based index) to the loop context.
     */
    Handlebars.registerHelper('eachIndex', function(context, options) {
      var data, i, j, ret;
      ret = '';
      if (options.data !== null) {
        data = Handlebars.createFrame(options.data);
      }
      if (context && context.length > 0) {
        i = 0;
        j = context.length;
        while (i < j) {
          if (data) {
            data.index = i;
          }
          context[i].index = i;
          ret = ret + options.fn(context[i]);
          i++;
        }
      } else {
        ret = options.inverse(this);
      }
      return ret;
    });

    /**
     * Add
     * Returns the sum of two numbers.
     */
    Handlebars.registerHelper('add', function(value, addition) {
      return value + addition;
    });

    /**
     * Subtract
     * Returns the difference of two numbers. Opposite of `add`
     */
    Handlebars.registerHelper('subtract', function(value, substraction) {
      return value - substraction;
    });

    /**
     * Divide
     * Returns the division of two numbers.
     */
    Handlebars.registerHelper('divide', function(value, divisor) {
      return value / divisor;
    });

    /**
     * Multiply
     * Returns the multiplication of two numbers.
     */
    Handlebars.registerHelper('multiply', function(value, multiplier) {
      return value * multiplier;
    });

    /**
     * Floor
     * Returns the value rounded down to the nearest integer.
     */
    Handlebars.registerHelper('floor', function(value) {
      return Math.floor(value);
    });

    /**
     * Ceil
     * Returns the value rounded up to the nearest integer.
     */
    Handlebars.registerHelper('ceil', function(value) {
      return Math.ceil(value);
    });

    /**
     * Round
     * Returns the value rounded to the nearest integer.
     */
    Handlebars.registerHelper('round', function(value) {
      return Math.round(value);
    });

    /**
     * To Fixed
     * Returns exactly `digits` after the decimal place.
     * The number is rounded if necessary, and the fractional
     * part is padded with zeros if necessary so that it has the specified length.
     */
    Handlebars.registerHelper('toFixed', function(number, digits) {
      if (Utils.isUndefined(digits)) {
        digits = 0;
      }
      return number.toFixed(digits);
    });

    /**
     * To Precision
     * Returns the number in fixed-point or exponential
     * notation rounded to `precision` significant digits.
     */
    Handlebars.registerHelper('toPrecision', function(number, precision) {
      if (Utils.isUndefined(precision)) {
        precision = 1;
      }
      return number.toPrecision(precision);
    });

    /**
     * To Exponential
     * Returns the number in exponential notation with one
     * digit before the decimal point, rounded to `fractions`
     * digits after the decimal point.
     */
    Handlebars.registerHelper('toExponential', function(number, fractions) {
      if (Utils.isUndefined(fractions)) {
        fractions = 0;
      }
      return number.toExponential(fractions);
    });

    /**
     * To Int
     * Returns an integer.
     */
    Handlebars.registerHelper('toInt', function(number) {
      return parseInt(number, 10);
    });

    /**
     * To Float
     * Returns a floating point number.
     */
    Handlebars.registerHelper('toFloat', function(number) {
      return parseFloat(number);
    });

    /**
     * Add Commas
     * Adds commas to a number.
     */
    Handlebars.registerHelper('addCommas', function(number) {
      return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    });

    /**
     * Is
     * Conditionally render a block if the condition is true.
     */
    Handlebars.registerHelper('is', function(value, test, options) {
      if (value === test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * Isn't
     * Conditionally render a block if the condition is false. Opposite of `is`.
     */
    Handlebars.registerHelper('isnt', function(value, test, options) {
      if (value !== test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * Greater Than
     * Conditionally render a block if the value is greater than a given number.
     */
    Handlebars.registerHelper('gt', function(value, test, options) {
      if (value > test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * Greater than or equal to
     * Conditionally render a block if the value is greater than
     * or equal to a given number.
     */
    Handlebars.registerHelper('gte', function(value, test, options) {
      if (value >= test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * Less Than
     * Conditionally render a block if the value is less than
     * a given number. Opposite of `gt`.
     */
    Handlebars.registerHelper('lt', function(value, test, options) {
      if (value < test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * Conditionally render a block if the value is less than or
     * equal to a given number. Opposite of `gte`.
     *
     */
    Handlebars.registerHelper('lte', function(value, test, options) {
      if (value <= test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * Or
     * Conditionally render a block if one of the values is truthy.
     */
    Handlebars.registerHelper('or', function(testA, testB, options) {
      if (testA || testB) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    /**
     * And
     * Conditionally render a block if both values are truthy.
     */
    Handlebars.registerHelper('and', function(testA, testB, options) {
      if (testA && testB) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });



    /**
     * Format Phone Number
     * from: http://blog.teamtreehouse.com/handlebars-js-part-2-partials-and-helpers
     * Helper function to output a formatted phone number
     *
     * Usage:
     *
     *     {{formatPhoneNumber phoneNumber}}
     */
    Handlebars.registerHelper("formatPhoneNumber", function(phoneNumber) {
      phoneNumber = phoneNumber.toString();
      return "(" + phoneNumber.substr(0,3) + ") " + phoneNumber.substr(3,3) + "-" + phoneNumber.substr(6,4);
    });


    /**
     * Format Date
     * Formats a date into a string given a format. Accepts any
     * value that can be passed to `new Date()`. This helper is a port of
     * [formatDate-js](http://https://github.com/michaelbaldry/formatDate-js)
     * by [Michael Baldry](https://github.com/michaelbaldry).
     */
    Handlebars.registerHelper('formatDate', function(date, format) {
      date = new Date(date);
      return Dates.format(date, format);
    });

    /**
     * Now
     * Returns the current date.
     */
    Handlebars.registerHelper('now', function(format) {
      var date;
      date = new Date();
      if (Utils.isUndefined(format)) {
        return date;
      } else {
        return Dates.format(date, format);
      }
    });

    /**
     * Time Ago
     * Returns a human-readable time phrase from the given date.
     */
    Handlebars.registerHelper('timeago', function(date) {
      var interval, seconds;
      date = new Date(date);
      seconds = Math.floor((new Date() - date) / 1000);
      interval = Math.floor(seconds / 31536000);
      if (interval > 1) {
        return "" + interval + " years ago";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return "" + interval + " months ago";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return "" + interval + " days ago";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return "" + interval + " hours ago";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return "" + interval + " minutes ago";
      }
      if (Math.floor(seconds) === 0) {
        return 'Just now';
      } else {
        return Math.floor(seconds) + ' seconds ago';
      }
    });



    // ==========================================================
    //
    // INFLECTIONS
    //
    // ==========================================================


    /**
     * Inflect
     * Returns the plural or singular form of a word based on a count.
     *
     * Parameters:
     *
     *     singular [string] - The singular form of the word. (Required)
     *     plural [string] - The plural form of the word. (Required)
     *     include [boolean] - whether or not to include the count before the word. (Optional)
     *
     * Usage:
     *
     *     enemies = 0
     *     friends = 1
     *
     *     {{inflect enemies "enemy" "enemies"}}
     *     {{inflect friends "friend" "friends" true}}
     *
     *     enemies
     *     1 friend
     */
    Handlebars.registerHelper('inflect', function(count, singular, plural, include) {
      var word;
      word = count > 1 || count === 0 ? plural : singular;
      if (Utils.isUndefined(include) || include === false) {
        return word;
      } else {
        return "" + count + " " + word;
      }
    });

    /**
     * Ordinalize
     * Turns a number into an ordinal string.
     * Taken from the templating library
     * [Walrus](https://github.com/jeremyruppel/walrus)
     * by [Jeremy Ruppel](https://github.com/jeremyruppel).
     *
     * Usage:
     *
     *     {{ordinalize 3}}
     *     {{ordinalize 1}}
     *     {{ordinalize 22}}
     *
     *     3rd
     *     1st
     *     22nd
     */
    Handlebars.registerHelper('ordinalize', function(value) {
      var normal, _ref;
      normal = Math.abs(Math.round(value));
      _ref = normal % 100;
      if (__indexOf.call([11, 12, 13], _ref) >= 0) {
        return "" + value + "th";
      } else {
        switch (normal % 10) {
          case 1:
            return "" + value + "st";
          case 2:
            return "" + value + "nd";
          case 3:
            return "" + value + "rd";
          default:
            return "" + value + "th";
        }
      }
    });




    /**
     * <ul>
     * Creates an unordered list.
     * Parameters:
     *
     *     hash [html attributes] - HTML attributes to use on the ul element. (Optional)
     *
     * Usage:
     *
     * // Data
     *     collection = [
     *             name: 'Leela'
     *        deliveries: 8021,
     *             name: 'Bender'
     *        deliveries: 239,
     *             name: 'Fry'
     *             deliveries: 1
     *     ]
     *
     * // Template
     *     {{#ul collection class="deliveries-list"}}
     *         {{name}} - {{inflect deliveries "delivery" "deliveries" true}}
     *     {{/ul}}
     *
     *
     * // Result:
     *     <ul class="deliveries-list">
     *       <li> Leela - 8021 deliveries </li>
     *       <li> Bender - 239 deliveries </li>
     *       <li> Fry - 1 delivery </li>
     *     </ul>
     */
    Handlebars.registerHelper('ul', function(context, options) {
      return ("<ul " + (HTML.parseAttributes(options.hash)) + ">") + context.map(function(item) {
        return "<li>" + (options.fn(item)) + "</li>";
      }).join('\n') + "</ul>";
    });


    /**
     * <ol>
     * Same as the `ul` helper but creates and ordered list.
     */
    Handlebars.registerHelper('ol', function(context, options) {
      return ("<ol " + (HTML.parseAttributes(options.hash)) + ">") + context.map(function(item) {
        return "<li>" + (options.fn(item)) + "</li>";
      }).join('\n') + "</ol>";
    });

    /**
     * <br>
     * Returns `<br>` tags based on a count.
     * Usage:
     *
     *     {{br 5}}
     *
     *     <br><br><br><br><br>
     */
    Handlebars.registerHelper('br', function(count, options) {
      var br, i;
      br = '<br>';
      if (!Utils.isUndefined(count)) {
        i = 0;
        while (i < count - 1) {
          br += '<br>';
          i++;
        }
      }
      return Utils.safeString(br);
    });

    /**
     * Each Property
     * Loop through an objects properties
     * Usage:
     *
     *     {{#eachProperty object}}
     *         {{property}}: {{value}}<br/>
     *     {{/eachProperty }}
     */
    Handlebars.registerHelper('eachProperty', function(context, options) {
      var ret = "";
      for (var prop in context) {
        ret = ret + options.fn({
          property: prop,
          value: context[prop]
        });
      }
      return ret;
    });


    /**
     * Inline Partials
     * Loop through an object's properties
     * Usage:
     *
     *     {{{include "scripts"}}}
     *
     * and then:
     *
     *     {{#extend "scripts"}}
     *     <script>
     *        document.write('foo bar!');
     *     </script>
     *     {{/extend}}
     */

    var inlinePartials = {};

    Handlebars.registerHelper('extend', function(name, context) {
      var include = inlinePartials[name];
      if (!include) {
        include = inlinePartials[name] = [];
      }

      include.push(context.fn(this));
    });
    Handlebars.registerHelper('include', function(name) {
      var val = (inlinePartials[name] || []).join('\n');

      // clear the include
      inlinePartials[name] = [];
      return val;
    });


    // ==========================================================
    //
    // LOGGING
    //
    // ==========================================================


    /**
     * Log
     * Simple console.log()
     *
     * Parameters: none.
     *
     * Usage:
     *
     *     {{log "Hi console :)"}}
     *
     *     Hi console :)
     */
    Handlebars.registerHelper('log', function(value) {
      return console.log(value);
    });

    /**
     * Debug
     * Simple console.debug() that shows the current context.

     * Parameters: none.
     *
     * Usage:
     *
     *     collection = [
     *             name: 'Leela'
     *             deliveries: 8021
     *         ,
     *             name: 'Bender'
     *             deliveries: 239
     *         ,
     *             name: 'Fry'
     *             deliveries: 1
     *     ]
     *
     *     {{#withFirst collection}}
     *         {{debug name}}
     *     {{/withFirst}}
     *
     *     Context: { deliveries: 8021, name: "Leela" }
     *     Value: Leela
     */
    Handlebars.registerHelper('debug', function(value) {
      console.log('Context: ', this);
      if (!Utils.isUndefined(value)) {
        console.log('Value: ', value);
      }
      return console.log('-----------------------------------------------');
    });




    // ==========================================================
    //
    // MISCELLANEOUS
    //
    // ==========================================================

    /**
     * Default
     * Provides a default or fallback value if a value doesn't exist.
     *
     * Usage:
     *
     *     title = ''
     *
     *     {{default title "Not title available."}}
     *
     *     Not title available.
     *
     */
    Handlebars.registerHelper('default', function(value, defaultValue) {
      return value !== null ? value : defaultValue;
    });


    /**
     * Markdown
     *
     * Markdown helper used to write markdown inside and
     * rendered the markdown inline with the HTML
     *
     * Usage:
     *
     *     {{#markdown}}
     *       # This is a title.
     *     {{/markdown}}
     *
     * Renders to:
     *     <h1>This is a title </h1>
     *
     */
    Handlebars.registerHelper('markdown', function(options) {
      var content = options.fn(this);
      return markdown.convert(content);
    });


    if(isServer) {
      /******************************
      * Markdown helper used to read in a file and inject
      * the rendered markdown into the HTML.
      *
      * Usage:
      *
      *     {{md ../path/to/file.md}}
      *
      *******************************/
      Handlebars.registerHelper('md', function(path) {
        var content = markdown.read(path);
        return content;
      });

    }

  };

  module.exports = {
    register: register
  };

}).call(this);
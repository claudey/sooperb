/*
* Utility functions
*/

/* Method Augmenting Functions */
// Return an array of unique items in an existing array
Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};

// Returns true/false based on whether item exists host array
Array.prototype.isMember = function(item) {
    return this.indexOf(item) != -1;
}

// Shortcut: Uses isMember to reverse the logic
Array.prototype.isAlien = function(item) {
    return !this.isMember(item);
}

// Returns a new array with all members of the existing array
Array.prototype.clone = function() {
    return this.slice(0);
}

// returns the host array's length if no argument is provided
// otherwise it counts the occurences of item in the array
Array.prototype.count = function (item) {
    if (arguments.length == 0) {
        return this.length;
    } else {
        var self = this.clone();
        var foundIndex = self.indexOf(item);
        if (foundIndex == -1) return 0;
        else {
            var found = 1; self.splice(foundIndex, 1);
            while (self.indexOf(item) != -1) {
                found++; self.splice(self.indexOf(item), 1);
            }
            return found;
        }
    }
}

// Compares two arrays for equality
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

// Remove preceeding/trailing whitespace from string
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};

// Flattens values in multi-dimensional array into a 1-d array
function flatten(arr) {
    if (!hasArray(arr)) {
        return arr;
    } else {
        var first = head(arr);
        first = isArray(first) ? first : [first];
        var rem = tail(arr);
        return flatten(first).concat(flatten(rem));
    }
}

// Return first item in an array
function head(arr) {
    return arr.length > 0 ? arr[0] : [];
}

// Returns all elements in the array excluding the first item
function tail(arr) {
    return arr.length > 1 ? arr.slice(1) : [];
}

// Checks if its argument is an array
function isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
}

// Presumes arr to be an array. Returns true/false depending on whether arr contains an array
function hasArray(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (isArray(arr[i]))
            return true;
    }
    return false;
}

// CReturns whether or not field is empty
function notEmpty (field) {
	return field.val() != "";
}

// Checks the extension of file, to see if its an image file
function isImageFile(file) {
	var fileExt = file.substring(file.lastIndexOf('.') + 1).toLowerCase();
	var validExtsRe = /^(jpg|jpeg|bmp|tiff|gif|png)$/i;
	return validExtsRe.test(fileExt);
}

// Returns whether or not arr is empty
function isNotEmptyArray(arr) {
    return arr.length != 0;
}

// Returns arry of numbers from start to but not including end
// If only one argument is specified, that arg is used as end
// Start, in that case begins from 0
function range(start, end) {
    var res = [];
    if (arguments.length == 1) {
        end = arguments[0];
        start = 0;
    }
    if (typeof start != 'number' || typeof end != 'number' || start >= end) {
        return res;
    }
    for (; start < end; start++) {
        res.push(start);
    }
    return res;
}
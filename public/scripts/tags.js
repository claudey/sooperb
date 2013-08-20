// HTML Tag Regexp
var tagReg = /<([a-zA-Z0-9 #=%:"\[\]\.\-\/]+)\/?>/gi;

function getClassNames (tag) {
    var classRe = /(class=(("|')([a-zA-z0-9 _\-]+)("|')))/i;
    return (classRe.test(tag)) ? tag.match(classRe)[4].trim().split(' ') : [];
}

function getClasses(str) {
    var tags = str.match(tagReg);
    return flatten(tags.map(getClassNames).filter(isNotEmptyArray)).unique();
}

// Is a tag present within str
function hasTag(str) {
    return tagReg.test(str);
}

// Get tag names of all tags present within str
function getTags(str, tag) {
    var tags = str.match(tagReg);
    if (!tags) tags = [];
    if (!tag) {
        return tags.map(getTagName).filter(isNotClosingTag).unique();
    } else {
        return tags.filter(function(item) {
            var tagRe = new RegExp('^(<' + tag + '([a-zA-Z0-9 =:"\.\-]*)\/?>)$', 'i');
            return tagRe.test(item);
        });
    }
}

// Count the occurences of a given tag within str
function count(tag, str) {
    if (hasTag(str)) {
        var tags = str.match(tagReg);
        return tags.map(getTagName).filter(isNotClosingTag).count(tag);
    } else return 0;
}

// Returns tag name of a given tag
function getTagName(tag) {
    if (tag.indexOf(' ') != -1) {
        return tag.substring(tag.indexOf('<')+1, tag.indexOf(' '));
    }
    return tag.substring(tag.indexOf('<')+1, tag.indexOf('>'));
}

// Returns whether tag is a closing tag or not
function isNotClosingTag(tag) {
    return tag.charAt(0) != '/';
}

// Returns true only if all items in: tagsUsed are members of: allowedTags
function checkTags(tagsUsed, allowedTags) {
    for (var i = 0; i < tagsUsed.length; i++) {
        var tag = tagsUsed[i];
        if (allowedTags.isAlien(tag)) {
            return false;
        }
    }
    return true;
}

// Returns true only if all items in: classesUsed are members of: allowedClasses
function checkClasses(classesUsed, allowedClasses) {
    for (var i = 0; i < classesUsed.length; i++) {
        var className = classesUsed[i];
        if (allowedClasses.isAlien(className)) {
            return false;
        }
    }
    return true;
}

function noBadTags(str, allowedTags) {
    return (hasTag(str)) ? checkTags(getTags(str), allowedTags) : true; 
}
function noBadClasses(str, allowedClasses) {
    return (hasTag(str)) ? checkClasses(getClasses(str), allowedClasses) : true; 
}
/// <summary>
/// Class constructor
/// </summary>
function stringBuilder() {
    this._container = new Array();
}

/// <summary>
/// Appends the text to the end of the container.
/// </summary>
stringBuilder.prototype.append = function (value) {
    if (value) {
        this._container.push(value);
    }
};

/// <summary>
/// Appends the text and a new line separator to the end of the container.
/// </summary>
stringBuilder.prototype.appendLine = function (value) {
    if (value) {
        this._container.push(value);
        this._container.push('\n');
    }
};

stringBuilder.prototype.replace = function (text, replace) {
    if (text) {
        var len = this._container.length;
        for (var index = 0; index < len; ++index) {
            if (this._container[index] == text) {
                this._container[index] = replace;
            }
        }
    }
};

/// <summary>
/// Returns true if the internal container contains the specified text, otherwise False.
/// </summary>
stringBuilder.prototype.contains = function (text) {
    if (text) {
        if (stringBuilder.prototype.length() == 0) {
            return false;
        }
        var len = stringBuilder.prototype.length();
        for (var index = 0; index < len; ++index) {
            if (this._container[index] == text) {
                return true;
            }
        }
    }

    return (stringBuilder.prototype.length() == 0);
};

/// <summary>
/// Gets the character at the nominated position within the internal container.
/// </summary>
stringBuilder.prototype.charAt = function (position) {
    if ((position == null) || (typeof (position) == 'undefined')) {
        throw new Exception('The position marker cannot be used to locate the character within the StringBuilder class.');
    }

    var index = parseInt(position.toString());

    if ((index < 0) || (index >= this._container.length)) {
        throw new Exception('The position marker cannot be used to locate the character within the StringBuilder class.');
    }

    return this._container[index];
};


/// <summary>
/// Clears the entries within the internal container.
/// </summary>
stringBuilder.prototype.clear = function () {
    this._container = new Array();
};

/// <summary>
/// Obtains the commencement position of the specified text within the internal text based container.
/// </summary>
stringBuilder.prototype.indexOf = function (text) {

    var pos = -1;

    if ((text === undefined) || (text == null) || !text || (this.length() == 0)) {
        return pos;
    }

    var filter = new String(text);
    if (filter.length > this.length()) {
        return pos;
    }

    var len = this.length();

    for (var index = 0; index < len; ++index) {
        if (this._container[index] == filter) {
            pos = index;
            break;
        }
    }

    return pos;
};

/// <summary>
/// Verifies whether the internal container is empty.
/// </summary>
stringBuilder.prototype.isEmpty = function () {
    return (this._container.length == 0);
};

/// <summary>
/// Gets the length of the internal container.
/// </summary>
stringBuilder.prototype.length = function () {
    return this._container.length;
};

/// <summary>
/// Splits the text based content within the internal container by the specified separator.
/// </summary>
/// <returns>
/// Array based strings that have been separated by the specified separator.
/// </returns>
stringBuilder.prototype.split = function (separator) {

    if (this._container.length == 0) {
        return null;
    }

    if ((separator === undefined) || (separator == null) || (separator.toString().length == 0)) {
        return this._container;
    }

    var res = new Array();

    var position = 0, nextpos = -1;

    while ((nextpos = this._container.indexOf(separator, position)) > position) {

        var content = this._container.slice(position, nextpos - 1);

        res.push(content);

        position = nextpos + 1;
    }

    if (position < this._container.length) {
        res.push(this._container.slice(position, this._container.length - 1));
    }

    return res;
}

/// <summary>
/// Removes whitespaces from the internal textual container.
/// </summary>
stringBuilder.prototype.trim = function (text, replacement) {

    if ((text === undefined) || (text === null)) {

        this.replace('\n', '');

    } else {

        if ((replacement === undefined) || (replacement === null)) {

            this.replace(text, '');

        } else {

            this.replace(text, replacement);

        }
    }
}

/// <summary>
/// Gets the contents of the internal container as a string.
/// </summary>
stringBuilder.prototype.toString = function () {
    var val = this._container.join();
    var res = '';
    for (var index = 0; index < val.length; ++index) {
        if (val.charAt(index) != ',') {
            res = res + val.charAt(index);
        }
    }
    return res;
};
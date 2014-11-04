/// <summary>
/// Class constructor
/// </summary>
function WorkerThread(service, delay) {

    /*
    *   Members
    */

    this._tasks = new Array();

    this.append(service, delay);
}

/// <summary>
/// Registers the service (function reference) within the internal collection.
/// </summary>
WorkerThread.prototype.append = function (service, delay) {

    if ((service !== undefined) && (service != null) && (typeof (service) == 'function')) {

        var task = {};
        task.handle = null;
        task.delay = ((delay === undefined) || (delay == null)) ? 0 : (typeof (delay) == 'number') ? delay : 0;
        task.service = service;

        this._tasks.push(task);
    }
}

WorkerThread.prototype.clear = function () {

    if (this._tasks.length == 0) {

        return;
    }

    this._tasks.clear();

}

/// <summary>
/// Starts the specified worker thread (function reference) that is preserved within the internal collection 
/// or initiates every registered worker thread (function reference) within the internal collection if the
/// function reference was not provided.
/// </summary>
WorkerThread.prototype.start = function (service) {

    if (this._tasks.length == 0) {

        return;
    }

    if ((service === undefined) || (service == null)) {

        while (this._tasks.length > 0) {

            var task = this._tasks.shift();

            if ((task.service != null) && (typeof (task.service) == 'function')) {

                try {

                    var fn = function () { task.service; clearTimeout(task.handle); };

                    task.handle = window.setTimeout(fn, task.delay);

                } catch (err) {

                }
            }
        }

    } else if (typeof (service) == 'function') {

        var collection = new Array();

        while (this._tasks.length > 0) {

            var task = this._tasks.shift();

            if ((task.service != null) && (typeof (task.service) == 'function')) {

                if (task.service == service) {

                    try {

                        var fn = function () { task.service; clearTimeout(task.handle); };

                        task.handle = window.setTimeout(fn, task.delay);

                    } catch (err) {

                    }

                } else {

                    collection.push(task);
                }
            }
        }

        while (collection.length > 0) {

            this._tasks.push(collection.shift());
        }
    }

}

/*
*
*/
WorkerThread.prototype.stop = function (service) {

    if (this._tasks.length == 0) {

        return;
    }

    if ((service === undefined) || (service == null)) {

        while (this._tasks.length > 0) {

            var task = this._tasks.shift();

            if ((task.handle !== undefined) && (task.handle != null)) {

                try {

                    clearTimeout(task.handle);

                    task.handle = null;

                } catch (err) {

                }
            }
        }

    } else if (typeof (service) == 'function') {

        var collection = new Array();

        while (this._tasks.length > 0) {

            var task = this._tasks.shift();

            if ((task.service != null) && (typeof (task.service) == 'function')) {

                if ((task.service == service) && (task.handle !== undefined) && (task.handle != null)) {

                    try {

                        clearTimeout(task.handle);

                    } catch (err) {

                    }

                } else {

                    collection.push(task);
                }
            }
        }

        while (collection.length > 0) {

            this._tasks.push(collection.shift());
        }
    }

}
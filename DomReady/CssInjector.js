/**
 * The CSS injector, do not modify this
 */

function readFile(path, encoding = 'utf-8') {
    return new Promise((resolve, reject) => {
        window._fs.readFile(path, encoding, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

class CssInjector {
    constructor() {
        this.watch();
        this.watcher = null;
        this.styleTag = null;
    }

    destroy() {
        if (this.watcher != null) {
            this.watcher.close();
            this.watcher = null;
        }
        if (this.styleTag != null) {
            this.styleTag.innerHTMl = "";
        }
    }

    watch() {
        readFile(this.path).then(css => {
            this.rawCss = css;

            if (this.styleTag == null) {
                this.styleTag = document.createElement('style');
                document.head.appendChild(this.styleTag);
            }
            this.styleTag.innerHTML = this.rawCss;

            if (this.watcher == null) {
                this.watcher = window._fs.watch(this.path, { encoding: 'utf-8' },
                    eventType => {
                        if (eventType == 'change') {
                            readFile(this.path).then(css => {
                                this.rawCss = css;
                                this.styleTag.innerHTML = this.rawCss;
                            });
                        }
                    });
            }
        });
    }

    set(location) {
        this.destroy();
        this.setPath(location);
        this.watch();
    }

    setPath(location) {
        if (location.endsWith('.css'))
            window.$localStorage.setItem('customCss', location);
        else throw new Error('Invalid CSS File');
    }

    get path() {
        return window.$localStorage.getItem('customCss');
    }
}

module.exports = CssInjector;
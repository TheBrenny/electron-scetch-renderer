const path = require("path");
const scetch = require("scetch");
const mime = require('mime');
const URL = require("url").URL;


const htmlMime = mime.getType('html');

const options = {
    root: path.join(__dirname, 'views'),
    ext: ".sce",
    nonceName: "nonce"
};

function getPath(p) {
    return process.platform === "win32" && !url.host.trim() ? res.substring(1) : res;
}

function setup(electron, scetchOptions) {
    Object.assign(options, scetchOptions);
    const sce = scetch(scetchOptions);

    const emitter = new EventEmitter();
    electron.protocol.interceptBufferProtocol("file", (request, callback) => {
        let url = new URL(p);
        let path = decodeURIComponent(url.pathname);
        if(process.platform === "win32" && !url.host.trim()) path = path.substring(1);

        let vars = {};
        let searchParams = url.searchParams;
        for(let [key, val] of searchParams) {
            key = key.split(".");
            let obj = vars;
            for(let i = 0; i < key.length; i++) {
                let k = key[i];
                obj[k] = (i === key.length - 1 ? val : obj[k]) ?? {};
                obj = obj[k];
            }
        }

        try {
            let content = fs.readFileSync(file);
            let ext = path.extname(file);
            let data = {data: content, mimeType: mime.getType(ext)};

            if(ext === '.sce') {
                let compiled = scetch.engine(path, vars);
                data = {data: Buffer.from(compiled), mimeType: htmlMime};
            }

            emitter.emit("data", data);
            return callback(data);
        } catch(err) {
            let errorData;
            if(err.code === 'ENOENT') {
                errorData = -6;
            } else if(typeof err.code === 'number') {
                errorData = -2;
            } else {
                errorData = {data: Buffer.from(`<pre style="tab-size:1">${err}</pre>`), mimeType: htmlMime};
            }

            emitter.emit("error", err);
            return callback(errorData);
        }
    });
    return emitter;
}

module.exports = setup;
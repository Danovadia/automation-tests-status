const _ = require("lodash");

const getData = (callback) => { 
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data.txt", true);
    xhr.onload = function (e) {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
        callback(xhr.responseText)
        } else {
        console.error(xhr.statusText);
        }
    }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(null);
}

const parse = function(data) {
    let parsedData = {
        updated: null,
        tests: [],
        progress: {}
    };
    let dataLines = data.split('\n');

    dataLines.forEach(line => {
        if (line.startsWith('#')) {
            return parsedData.updated = line.slice(1);
        }

        let key = line.split('=')[0];
        let value = line.split('=')[1];

        if (!_.isNull(key) && !_.isNull(value)) {
            parsedData.tests.push({
                name: key,
                value: Number(value)
            })
        }
    })

    parsedData.tests = _.sortBy(parsedData.tests, "name")

    return parsedData;
}

module.exports = parse;
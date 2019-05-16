const _ = require("lodash");

const pieKeys = ["openissue", "fail", "pass", "total", "skip"];
// const infoTableKeys = ["brand", "apk_version", "amount_of_emulators", "automation_branch", "tests_groups", "os_version"];

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
        infoTable: [],
        progress: {}
    };
    let dataLines = data.split('\n');

    dataLines.forEach(line => {
        if (line.startsWith('#')) {
            return parsedData.updated = line.slice(1);
        }

        let key = line.split('=')[0];
        let value = line.split('=')[1];

        if (!_.includes(line, '=')) {
            key = line;
            value = '';
        }

        if (_.isNull(key) || _.isNull(value)) {
            return
        } else if (_.includes(pieKeys, key)) {
            parsedData.tests.push({
                name: key,
                value: Number(value)
            })
        } else if (key === "started") {
            parsedData.started = value;
        } else {
            parsedData.infoTable.push({
                name: key,
                value: value
            })
        }
    })

    parsedData.tests = _.sortBy(parsedData.tests, "name")
    parsedData.started = _.compact(parsedData.started.split(" "));
    
    return parsedData;
}

module.exports = parse;
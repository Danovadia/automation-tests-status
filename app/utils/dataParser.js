export const getData = (callback) => { 
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

export const parse = function(data) {
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

        parsedData.tests.push({
            name: key,
            value: Number(value)
        })
    })

    parsedData.tests = parsedData.tests.reverse()
    return parsedData;
}
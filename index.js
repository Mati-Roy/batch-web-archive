let fs = require('fs');
//let http = require('http');
var https = require('https');

function main() {
    fs.readFile(process.argv[2], 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        processFile(data);
    });

}

function processFile(fileContent) {
    let csvRows = csvToArray(fileContent);
    saveAllFrom(csvRows, 0)

}

function saveAllFrom(csvRows, index) {
    let url = csvRow[index];

    https.get('https://web.archive.org/save/' + url, function (res) {
        console.log("statusCode: ", res.statusCode); // <======= Here's the status code
        if (res.statusCode < 300) {
            //success
        }
        else {
            console.log(res.statusMessage);
        }

        if (index < csvRows.length) {
            saveAllFrom(csvRows, index + 1)
        }
    }).on('error', function (e) {
        console.error(e);
    });

}

function csvToArray(strData, strDelimiter) {
    strDelimiter = (strDelimiter || ",");
    let objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    let arrData = [[]];
    let arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {
        let strMatchedDelimiter = arrMatches[1];

        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter)
            arrData.push([]);

        let strMatchedValue;

        if (arrMatches[2])
            strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
        else
            strMatchedValue = arrMatches[3];

        arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
}

main()
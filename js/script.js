function main() {
    let fileElement = document.getElementById("file");

    fileElement.addEventListener('change', (event) => {
        const fileList = event.target.files;
        console.log(fileList);
        const file = fileList[0];

        const reader = new FileReader();
        reader.onload = (fileData) => { processFile(fileData.target.result) };
        reader.readAsText(file);

        csvToArray
    });
}

function processFile(fileContent) {
    let csvRows = csvToArray(fileContent);
    for (let csvRow of csvRows) {
        console.log(csvRow);
        let url = csvRow[0];
        fetch("https://web.archive.org/save/" + url).then(() => { }).catch(() => {
            document.getElementById("message").innerHTML += `Error saving for: ${url}<br/>`;
        })
    }
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
var request = require('request');
var fs = require('fs')

exports.handler = async (event) => {
    console.log(`Starting data mining at: ${new Date()}`);

    const urlMap = {
        'confirmed': 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv',
        'recovered' : 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv',
        'death' : 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv'
    }

    result = {}
    for (let key in urlMap) {
        console.log(`processing ${key} `)
        result = await processDataType(key, urlMap[key])
        console.log(`processed ${key} with ${result.length} number of data points`)

        let data = JSON.stringify(result);
        fs.writeFileSync(`../../public/${key}.json`, data);
    } 

    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify(recordList),
    // };

    // console.log(result.confirmed)
    return result;
};

async function processDataType(type, url) {
    recordList = [];
    let { response, body } = await get(url)
  
    if (response.statusCode !== 200) {
        return error(response, body)
    }
    var csv = body.split('\n')
    csv.pop()// remove last null element //todo

    csv = csv.map(row => CSVtoArray(row))
    header = csv.shift();
    header.splice(0, 4)
    headerDates = header.map(row => new Date(row))

    csv.forEach(row => {
        // console.log(row)
        headerDates.forEach((date, i) => {
            recordList.push({
                provinceState : row[0],
                countryRegion : row[1],
                lat : row[2],
                long : row[3],
                type : type,                  
                date : date,
                numberOfCase : parseInt(row[i + 4]) || 0 // header is ahead :)
            })
        })
    });

    // console.log(recordList)
    return recordList        

}


async function get (url) {
    return new Promise((resolve, reject) => {
      request.get(url, (error, response, body) => {
        if (error) return reject(error)
        return resolve({ body, response })
      })
    })
  }

// Disgusting
// Return array of string values, or NULL if CSV string not well formed.
function CSVtoArray(text) {
    // var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    // if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};

this.handler()
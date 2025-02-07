const fs = require('fs');
const path = require('path');

function convertSrtToJson(srtFilePath, name, title, id) {
    const content = fs.readFileSync(srtFilePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const jsonData = {
        name: name,
        id: id,
        title: title,
        lyrics: []
    };

    let currentStartTimeMs = 0;
    let subtitleText = ''; // Accumulate subtitle lines
    let expectingSubtitleText = false; // Flag to track when to expect subtitle text

    lines.forEach(line => {
        line = line.trim();

        if (line.includes('-->')) {
            // Time to reset for the next subtitle block
            if (subtitleText) {
                jsonData.lyrics.push({
                    line: subtitleText,
                    time: currentStartTimeMs
                });
                subtitleText = ''; // Clear accumulated text
            }

            // Extract start time in milliseconds
            const [startTime,] = line.split(' --> ');
            const [hours, minutes, seconds] = startTime.split(':');
            const [sec, ms] = seconds.split(',');
            currentStartTimeMs = (parseInt(hours) * 3600000) + (parseInt(minutes) * 60000) + (parseInt(sec) * 1000) + parseInt(ms);
            expectingSubtitleText = true; // Next lines should be subtitle text until an empty line
        } else if (line && expectingSubtitleText) {
            // Accumulate subtitle lines, separated by a space if not the first line
            subtitleText += (subtitleText ? ' ' : '') + line;
        } else if (!line) {
            // Empty line indicates the end of a subtitle block
            expectingSubtitleText = false;
        }
    });

    // Handle any final accumulated subtitle text
    if (subtitleText) {
        jsonData.lyrics.push({
            line: subtitleText,
            time: currentStartTimeMs
        });
    }

    // Adding the first line with a placeholder time as a marker for the beginning
    jsonData.lyrics.unshift({
        line: "",
        time: -1
    });

    // Adding the last line with a placeholder time as a marker for the end
    jsonData.lyrics.push({
        line: "",
        time: 99999999
    });

    return jsonData;
}


function convertAllSrtFilesInFolder(folderPath) {
    const resultFolderPath = path.join(__dirname, 'result');
    if (!fs.existsSync(resultFolderPath)) {
        fs.mkdirSync(resultFolderPath);
    }

    fs.readdirSync(folderPath).forEach(file => {
        if (file.endsWith('.srt')) {
            const srtFilePath = path.join(folderPath, file);
            const id = path.basename(file, path.extname(file));
            const jsonFilePath = path.join(resultFolderPath, `${id}.json`);

            const jsonResult = convertSrtToJson(srtFilePath, "Maria Del Rio", "J'adore la nouvelle identité", id);
            fs.writeFileSync(jsonFilePath, JSON.stringify(jsonResult, null, 2));

            console.log(`Converted ${file} to ${id}.json`);
        }
    });
}

// Usage
const srtFolderPath = '/Users/Valou/code/rtl-github/projets/contact-max/convert/srt';
convertAllSrtFilesInFolder(srtFolderPath);

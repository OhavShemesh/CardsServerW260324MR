const fs = require("fs")
const path = require("path");
const { currentTime } = require("../../utils/timeHelper");
const { getUser } = require("../../users/models/usersAccessDataService");

const { year, month, day, hours, minutes, seconds } = currentTime();
const timeAndDate = `[${year}-${month}-${day} ${hours}-${minutes}-${seconds}]`

const folderPath = path.join(__dirname, "..", "..", "logs");
const filePath = path.join(folderPath, `${timeAndDate}.txt`);

const makeLogsFolder = () => {
    fs.mkdir(path.join(folderPath), { recursive: true }, (err) => {
        if (err) {
            console.log(err);

        } else {
            console.log("your folder created successfuly");

        }
    })
}

const makeLogsFiles = (status, errorMessage) => {

    message = {
        "time": timeAndDate,
        "status": status,
        "error message": errorMessage

    }

    fs.writeFile(filePath, JSON.stringify(message, null, 4), (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log("File written successfully at", filePath);
        }
    });
};
module.exports = { makeLogsFolder, makeLogsFiles }
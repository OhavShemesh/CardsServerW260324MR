const { handleError } = require("../../utils/handleErrors");

let emailsArray = [];
let blackList = [];

const blockUser = (email, success) => {
    if (success) {
        emailsArray = [];
    } else {
        emailsArray.push(email);
    }

    let count = emailsArray.filter(item => item === email).length;

    if (count >= 3) {
        blackList.push(email);

        let num = 0;

        const interval = setInterval(() => {
            num++;

            if (num >= 86400) {
                blackList = blackList.filter(item => item !== email);
                emailsArray = [];
                clearInterval(interval);
            }
        }, 1000);
    }
};

const checkBlackList = (email, res) => {
    if (blackList.includes(email)) {
        let errorMessage = "Email has been blocked for 24 hours. Please try again later.";
        return handleError(res, 409, errorMessage);
    }
};

module.exports = { blockUser, checkBlackList };

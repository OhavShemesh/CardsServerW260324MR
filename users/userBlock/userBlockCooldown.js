const { handleError } = require("../../utils/handleErrors");

let emailsArray = [];
let blackList = [];

const blockUser = (email, success) => {
    if (success) {
        emailsArray = [];
    } else {
        emailsArray.push(email);
        console.log("emailsArray", emailsArray);
    }

    let count = emailsArray.filter(item => item === email).length;

    if (count >= 3) {
        blackList.push(email);
        console.log(`User ${email} added to blacklist.`);

        let num = 0;

        const interval = setInterval(() => {
            num++;
            console.log(num);

            if (num >= 86400) {
                blackList = blackList.filter(item => item !== email);
                console.log(`User ${email} removed from blacklist.`);
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

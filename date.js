/* eslint-disable indent */
const monthArr = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

const formatDate = (date) => {
    const newDate = date.split('-');
    const year = newDate[0];
    const month = findMonth(parseInt(newDate[1]));
    const day = newDate[2];
    return `${month} ${day}, ${year}`;
};

const findMonth = (month) => {
    for (let i = 1; i < monthArr.length + 1; i++) {
        if (i === month) {
            return monthArr[i];
        }
    }
};

module.exports = formatDate;







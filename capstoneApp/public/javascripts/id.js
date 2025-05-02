let currentUid = null;

function getID() {
    return currentUid;
}

function changeID(val) {
    currentUid = val;
}

module.exports = {getID, changeID};
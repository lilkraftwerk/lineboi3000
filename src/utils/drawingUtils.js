import _ from 'lodash';

export const getStartCoordsFromFirstTempLines = tempLines => {
    if (tempLines[0] == null) {
        return false;
    }
    if (tempLines[0][0] == null) {
        return false;
    }
    if (tempLines[0][0][0] == null) {
        return false;
    }

    if (tempLines[0][0][1] == null) {
        return false;
    }

    return _.clone([tempLines[0][0][0], tempLines[0][0][1]]);
};

export const getFirstLineFromTempLines = tempLines => {
    if (tempLines[0] == null) {
        return false;
    }

    return _.clone(tempLines[0]);
};

import {
    SELECT_DRAW_MODE,
    SELECT_MAIN_MODE,
    SET_FILL_LINES,
    SET_FONT_NAME,
    SET_MULTIPLY_CANVAS_OPTIONS,
    SET_OPTION_BY_KEY,
    SET_SELECT_COORDS,
    SET_SELECT_OPTION_BY_KEY,
    SET_TEXT_CONTENT,
    SET_TEXT_SIZE
} from './drawingActions';

const initState = {
    mainMode: 'draw',
    mode: 'pen',
    textContent: 'L',
    textSize: 150,
    textFill: true,
    textOutline: true,
    textDistanceBetweenLetters: 10,
    textDistanceBetweenWords: 50,
    fontName: 'VCR_OSD_MONO.ttf',
    pointsOnEachLine: 5,
    multiplyCanvasOptions: {
        x: 2,
        y: 2
    },
    selectCoords: [],
    hullCoords: [],
    fillLines: [],
    angle: 90,
    distanceBetweenLines: 5,
    distanceBetweenPoints: 2,
    lineMode: 'vertical',
    showPreviewLines: false,
    randomLineDensity: 5,
    eraserRadius: 20,
    fillRadius: 20,
    fillCircle: true,
    fillAngle: 90,
    fillSquareAndCircle: false,
    pointsOnCircle: 50,
    templateIntensity: 50,
    selectedTemplate: 'frame',
    rainTemplateMinPercent: 25,
    rainTemplateMaxPercent: 75,
    rainTemplatePointDistance: 5,
    rainTemplateLineCount: 50,
    rainTemplateStartFromTop: true,
    rainTemplateMinDistanceBetweenLines: 1,
    circleFrameTemplateRadius: 75,
    circleFrameTemplatePointsOnCircle: 500,
    manyCirclesTemplateCount: 15,
    manyCirclesTemplatePoints: 5
};

const drawingReducer = (state = initState, action) => {
    switch (action.type) {
        case SELECT_MAIN_MODE:
            return {
                ...state,
                mainMode: action.value
            };
        case SELECT_DRAW_MODE:
            return {
                ...state,
                mode: action.value
            };
        case SET_TEXT_CONTENT:
            return {
                ...state,
                textContent: action.value
            };
        case SET_FONT_NAME:
            return {
                ...state,
                fontName: action.value
            };
        case SET_TEXT_SIZE:
            return {
                ...state,
                textSize: action.value
            };
        case SET_MULTIPLY_CANVAS_OPTIONS:
            return {
                ...state,
                multiplyCanvasOptions: {
                    ...state.multiplyCanvasOptions,
                    [action.value.axis]: action.value.multiplyFactor
                }
            };
        case SET_SELECT_COORDS:
            return {
                ...state,
                selectCoords: action.value.selectCoords,
                hullCoords: action.value.hullCoords
            };
        case SET_SELECT_OPTION_BY_KEY:
            return {
                ...state,
                selectOptions: {
                    ...state.selectOptions,
                    [action.value.key]: action.value.value
                }
            };
        case SET_OPTION_BY_KEY:
            return {
                ...state,
                [action.value.key]: action.value.value
            };
        case SET_FILL_LINES:
            return {
                ...state,
                fillLines: action.value.fillLines
            };
        default:
            return state;
    }
};

export default drawingReducer;

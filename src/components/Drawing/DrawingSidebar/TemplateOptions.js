import _ from 'lodash';
import React from 'react';
import { setOptionByKey } from 'store/drawing/drawingActions';
import { EmojiButton } from 'components/common/SidebarButton/SidebarButton';
import PercentClicker from 'components/common/PercentClicker/PercentClicker';
import { connect } from 'react-redux';

const TEMPLATE_TYPES = {
    frame: {
        displayName: 'frame',
        emoji: 'framedpicture'
    },
    circleFrame: {
        displayName: 'one circle',
        emoji: 'redcircle'
    },
    manyCircles: {
        displayName: 'many circles',
        emoji: 'manycircles'
    },
    squares: {
        displayName: 'many squares',
        emoji: 'manysquares'
    },
    rain: {
        displayName: 'rain',
        emoji: 'rain'
    }
};

const TemplateOptionsComponent = (props) => {
    const {
        templateIntensity,
        addTemplateToCurrentLayer,
        selectedTemplate,
        rainTemplateMaxPercent,
        rainTemplateMinPercent,
        rainTemplateLineCount,
        rainTemplatePointDistance,
        rainTemplateStartFromTop,
        rainTemplateMinDistanceBetweenLines,
        circleFrameTemplateRadius,
        circleFrameTemplatePointsOnCircle,
        manyCirclesTemplateCount,
        manyCirclesTemplatePoints,
        dispatch
    } = props;

    return (
        <>
            {Object.keys(TEMPLATE_TYPES).map((templateType) => {
                const { displayName, emoji } = TEMPLATE_TYPES[templateType];

                return (
                    <EmojiButton
                        text={displayName}
                        key={displayName}
                        disabled={selectedTemplate === templateType}
                        style={{ gridColumn: 'span 2' }}
                        emoji={emoji}
                        onClick={() => {
                            dispatch(
                                setOptionByKey({
                                    key: 'selectedTemplate',
                                    value: templateType
                                })
                            );
                        }}
                    />
                );
            })}
            <PercentClicker
                setValue={(value) => {
                    dispatch(
                        setOptionByKey({
                            key: 'templateIntensity',
                            value
                        })
                    );
                }}
                float={false}
                title="point intensity"
                minLabel="small"
                maxLabel="lots"
                minValue={5}
                maxValue={50}
                currentValue={templateIntensity}
            />
            {selectedTemplate === 'circleFrame' && (
                <>
                    <PercentClicker
                        setValue={(value) => {
                            dispatch(
                                setOptionByKey({
                                    key: 'circleFrameTemplateRadius',
                                    value
                                })
                            );
                        }}
                        float={false}
                        title="radius percent"
                        minLabel="1"
                        maxLabel="100"
                        minValue={1}
                        maxValue={100}
                        currentValue={circleFrameTemplateRadius}
                    />
                    <PercentClicker
                        setValue={(value) => {
                            dispatch(
                                setOptionByKey({
                                    key: 'circleFrameTemplatePointsOnCircle',
                                    value
                                })
                            );
                        }}
                        float={false}
                        title="points on circle"
                        minLabel="1"
                        maxLabel="5000"
                        minValue={1}
                        maxValue={5000}
                        currentValue={circleFrameTemplatePointsOnCircle}
                    />
                </>
            )}
            {selectedTemplate === 'manyCircles' && (
                <>
                    <PercentClicker
                        setValue={(value) => {
                            dispatch(
                                setOptionByKey({
                                    key: 'manyCirclesTemplateCount',
                                    value
                                })
                            );
                        }}
                        float={false}
                        title="circle count"
                        minLabel="1"
                        maxLabel="100"
                        minValue={1}
                        maxValue={100}
                        currentValue={manyCirclesTemplateCount}
                    />
                    <PercentClicker
                        setValue={(value) => {
                            dispatch(
                                setOptionByKey({
                                    key: 'manyCirclesTemplatePoints',
                                    value
                                })
                            );
                        }}
                        float={false}
                        title="points on circle"
                        minLabel="a few"
                        maxLabel="a lot"
                        minValue={1}
                        maxValue={10}
                        currentValue={manyCirclesTemplatePoints}
                    />
                </>
            )}

            {selectedTemplate === 'rain' && (
                <>
                    <PercentClicker
                        setValue={(value) => {
                            dispatch(
                                setOptionByKey({
                                    key: 'rainTemplateLineCount',
                                    value
                                })
                            );
                        }}
                        float={false}
                        title="rain count"
                        minLabel="1"
                        maxLabel="100"
                        minValue={1}
                        maxValue={100}
                        currentValue={rainTemplateLineCount}
                    />
                    <PercentClicker
                        setValue={(value) => {
                            dispatch(
                                setOptionByKey({
                                    key: 'rainTemplateMinPercent',
                                    value
                                })
                            );
                        }}
                        float={false}
                        title="min height %"
                        minLabel="1"
                        maxLabel="100"
                        minValue={1}
                        maxValue={100}
                        currentValue={rainTemplateMinPercent}
                    />
                    <PercentClicker
                        setValue={(value) => {
                            dispatch(
                                setOptionByKey({
                                    key: 'rainTemplateMaxPercent',
                                    value
                                })
                            );
                        }}
                        float={false}
                        title="max height %"
                        minLabel="1"
                        maxLabel="100"
                        minValue={1}
                        maxValue={100}
                        currentValue={rainTemplateMaxPercent}
                    />
                    <PercentClicker
                        setValue={(value) => {
                            dispatch(
                                setOptionByKey({
                                    key: 'rainTemplateMinDistanceBetweenLines',
                                    value
                                })
                            );
                        }}
                        float={false}
                        title="min distance between"
                        minLabel="1"
                        maxLabel="50"
                        minValue={1}
                        maxValue={100}
                        currentValue={rainTemplateMinDistanceBetweenLines}
                    />
                    <PercentClicker
                        setValue={(value) => {
                            dispatch(
                                setOptionByKey({
                                    key: 'rainTemplatePointDistance',
                                    value
                                })
                            );
                        }}
                        float={false}
                        title="distance between points"
                        minLabel="1"
                        maxLabel="100"
                        minValue={1}
                        maxValue={50}
                        currentValue={rainTemplatePointDistance}
                    />
                    <label>
                        start at top
                        <input
                            type="checkbox"
                            defaultChecked={rainTemplateStartFromTop}
                            onChange={() => {
                                dispatch(
                                    setOptionByKey({
                                        key: 'rainTemplateStartFromTop',
                                        value: !rainTemplateStartFromTop
                                    })
                                );
                            }}
                        />
                    </label>
                </>
            )}
            <button
                style={{ gridColumn: 'span 4' }}
                type="button"
                onClick={() => {
                    addTemplateToCurrentLayer(selectedTemplate);
                }}
            >
                apply
            </button>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        ...state.drawingReducer
    };
};

export default connect(mapStateToProps)(TemplateOptionsComponent);

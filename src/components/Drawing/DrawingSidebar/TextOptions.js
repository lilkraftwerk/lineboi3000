import React from 'react';
import {
    setTextContent,
    setTextSize,
    setFontName,
    setSelectOptionByKey,
    setOptionByKey
} from 'store/drawing/drawingActions';
import { SidebarItem } from 'components/common/SidebarContainer';
import ItemSelector from 'components/common/ItemSelector';
import PercentClicker from 'components/common/PercentClicker';

const FONT_NAMES = [
    'VCR_OSD_MONO.ttf',
    'dotmatrixbold.ttf',
    'ka1.ttf',
    'kindergarten.ttf',
    'dotmatrix.ttf',
    'grunewald.ttf',
    'kemcopixelbold.ttf',
    'mariokartds.ttf'
];

const TextOptions = props => {
    const {
        textContent,
        textSize,
        textFill,
        textOutline,
        textDistanceBetweenLines,
        textDistanceBetweenPoints,
        textDistanceBetweenLetters,
        textDistanceBetweenWords,
        textFillIsHorizontal,
        dispatch
    } = props;

    return (
        <SidebarItem title="text options" height={2}>
            <label htmlFor="textContent" style={{ gridColumn: 'span 2' }}>
                text content
            </label>
            <input
                id="textContent"
                style={{ gridColumn: 'span 2' }}
                value={textContent}
                type="text"
                onChange={e => {
                    dispatch(setTextContent(e.target.value));
                }}
            />
            <PercentClicker
                setValue={value => {
                    dispatch(setTextSize(Number(value)));
                }}
                float={false}
                title="font size"
                minLabel="2"
                maxLabel="400"
                minValue={2}
                maxValue={400}
                currentValue={textSize}
            />
            <ItemSelector
                spanCount={4}
                onChange={selectedFontName => {
                    dispatch(setFontName(selectedFontName));
                }}
                items={FONT_NAMES.map(currentFont => ({
                    key: currentFont,
                    title: currentFont
                }))}
                showConfirmButton={false}
            />
            <label>
                outline
                <input
                    type="checkbox"
                    defaultChecked={textOutline}
                    onChange={() => {
                        dispatch(
                            setOptionByKey({
                                key: 'textOutline',
                                value: !textOutline
                            })
                        );
                    }}
                />
            </label>
            <label>
                fill
                <input
                    type="checkbox"
                    defaultChecked={textFill}
                    onChange={() => {
                        dispatch(
                            setOptionByKey({
                                key: 'textFill',
                                value: !textFill
                            })
                        );
                    }}
                />
            </label>{' '}
            <button
                style={{ gridColumn: 'span 4' }}
                type="button"
                onClick={() => {
                    dispatch(
                        setOptionByKey({
                            key: 'textFillIsHorizontal',
                            value: !textFillIsHorizontal
                        })
                    );
                }}
            >
                {textFillIsHorizontal ? 'horizontal fill' : 'vertical fill'}
            </button>
            <PercentClicker
                setValue={value => {
                    dispatch(
                        setSelectOptionByKey({
                            key: 'textDistanceBetweenLines',
                            value
                        })
                    );
                }}
                float={false}
                title="distance between lines"
                minLabel="1"
                maxLabel="15"
                minValue={1}
                maxValue={15}
                currentValue={textDistanceBetweenLines}
            />
            <PercentClicker
                setValue={value => {
                    dispatch(
                        setSelectOptionByKey({
                            key: 'textDistanceBetweenPoints',
                            value
                        })
                    );
                }}
                float={false}
                title="distance between points"
                minLabel="1"
                maxLabel="15"
                minValue={1}
                maxValue={15}
                currentValue={textDistanceBetweenPoints}
            />
            <PercentClicker
                setValue={value => {
                    dispatch(
                        setSelectOptionByKey({
                            key: 'textDistanceBetweenLetters',
                            value
                        })
                    );
                }}
                float={false}
                title="distance between letters"
                minLabel="1"
                maxLabel="15"
                minValue={1}
                maxValue={30}
                currentValue={textDistanceBetweenLetters}
            />
            <PercentClicker
                setValue={value => {
                    dispatch(
                        setSelectOptionByKey({
                            key: 'textDistanceBetweenWords',
                            value
                        })
                    );
                }}
                float={false}
                title="distance between words"
                minLabel="1"
                maxLabel="100"
                minValue={1}
                maxValue={100}
                currentValue={textDistanceBetweenWords}
            />
        </SidebarItem>
    );
};

export default TextOptions;

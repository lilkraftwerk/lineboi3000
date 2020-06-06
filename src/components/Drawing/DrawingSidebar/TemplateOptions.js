import React from 'react';
import { setOptionByKey } from 'store/drawing/drawingActions';
import { SidebarItem } from 'components/common/SidebarContainer';
import PercentClicker from 'components/common/PercentClicker';
import { connect } from 'react-redux';

const TEMPLATE_TYPES = ['frame', 'squares', 'circles', 'randomLines'];

const TemplateOptionsComponent = (props) => {
    const { templateIntensity, addTemplateToCurrentLayer, dispatch } = props;

    return (
        <SidebarItem title="templates" height={2}>
            {TEMPLATE_TYPES.map((templateType) => (
                <button
                    style={{ gridColumn: 'span 2' }}
                    type="button"
                    onClick={() => {
                        addTemplateToCurrentLayer(templateType);
                    }}
                >
                    {templateType}
                </button>
            ))}
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
        </SidebarItem>
    );
};

const mapStateToProps = (state) => {
    return {
        ...state.drawingReducer
    };
};

export default connect(mapStateToProps)(TemplateOptionsComponent);

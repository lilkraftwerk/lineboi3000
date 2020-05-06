import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
// import styles from './Options.styles.css';

export default class SaveAndLoad extends React.Component {
    componentDidMount() {
        this.getDrawings();
    }

    async getDrawings() {
        const response = await fetch('/drawings');
        const json = response.json();
    }

    render() {
        return <div>save load</div>;
    }
}

SaveAndLoad.defaultProps = {};

SaveAndLoad.propTypes = {
    originalLines: PropTypes.arrayOf(PropTypes.number).isRequired,
    updateRenderLines: PropTypes.func.isRequired
};

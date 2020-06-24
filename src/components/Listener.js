import React from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { newProject, loadProject } from 'store/rootActions';

class Listener extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;

        ipcRenderer.on('menu:newProject', () => {
            dispatch(newProject());
        });

        ipcRenderer.on('menu:onOpenProjectSelect', (event, projectState) => {
            dispatch(loadProject(projectState));
        });
    }

    render() {
        return <div style={{ display: 'none' }} />;
    }
}

export default connect()(Listener);

import React, { PureComponent, Component, useCallback } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { actions } from 'react-redux-form';
import Sidebar from './SidebarComponent';
import Database from './DatabaseComponent';
import Visualisation from './VisualisationComponent';
import SOMModel from './ModelComponent';
import DetailedDataset from './DetailedDatasetComponent';
import MetadataForm from './MetadataForm';
import ConnectionUploading from './ConnectionUploading';
import BindedDatasets from './Modal/BindedDatasets';
import AllDataset from './AlldatasetsComponent';
import AllModel from './AllModelsComponents';
import compareProps from '../others/compareProps';

import {
    fetchDatasetFiles, uploadDataset, fetchUploadedDataset, submitMetadata, deleteOneDataset, queryDatasets,
    fetchModelFiles, uploadModel, fetchUploadedModel, deleteOneModel, editModelDescription,
    sendNameForDetailedData, connectUploading, clearConnectionFiles, bindModel, queryModels, getBindedDatasets,
    deleteOneBindedDataset, downloadFile,
    fetchAllDatasetFiles, queryAllDatasets, fetchAllModels
} from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        user: state.user,
        metadata: state.metadata,
        datasetFiles: state.datasetFiles,
        modelFiles: state.modelFiles,
        detailedData: state.detailedData,
        allDatasetFiles: state.allDatasetFiles,
        allModels: state.allModels,
        connectionFiles: state.connectionFiles
    }
}

const mapDispatchToProps = dispatch => ({
    connectUploading: (files, onUploadProgress, username) => dispatch(connectUploading(files, onUploadProgress, username)),
    clearConnectionFiles: () => dispatch(clearConnectionFiles()),
    bindModel: (modelname, username, datasetname) => dispatch(bindModel(modelname, username, datasetname)),
    getBindedDatasets: (modelname, username) => dispatch(getBindedDatasets(modelname, username)),
    deleteOneBindedDataset: (datasetName, userName) => { dispatch(deleteOneBindedDataset(datasetName, userName)) },

    fetchDatasetFiles: (userName) => { dispatch(fetchDatasetFiles(userName)) },
    uploadDataset: (dataset, onUploadProgress, username) => dispatch(uploadDataset(dataset, onUploadProgress, username)),
    fetchUploadedDataset: (username) => { dispatch(fetchUploadedDataset(username)) },
    deleteDataset: (datasetName, userName) => { dispatch(deleteOneDataset(datasetName, userName)) },
    queryDatasets: (inputValue, userName) => { dispatch(queryDatasets(inputValue, userName)) },

    downloadFile: (datasetName, downloadName, downloadType, username) => { dispatch(downloadFile(datasetName, downloadName, downloadType, username)) },

    fetchModelFiles: (userName, isLoading) => { dispatch(fetchModelFiles(userName, isLoading)) },
    uploadModel: (model, onUploadProgress, username) => dispatch(uploadModel(model, onUploadProgress, username)),
    fetchUploadedModel: (username) => { dispatch(fetchUploadedModel(username)) },
    deleteModel: (name, userName) => { dispatch(deleteOneModel(name, userName)) },
    editModelDescription: (name, description, username) => { dispatch(editModelDescription(name, description, username)) },
    queryModels: (inputValue, userName) => { dispatch(queryModels(inputValue, userName)) },

    fetchAllDatasetFiles: () => { dispatch(fetchAllDatasetFiles()) },
    queryAllDatasets: (inputValue) => { dispatch(queryAllDatasets(inputValue)) },

    fetchAllModels: () => { dispatch(fetchAllModels()) },

    submitMetadata: (metadata) => { dispatch(submitMetadata(metadata)) },
    sendNameForDetailedData: (datasetName, userName) => { dispatch(sendNameForDetailedData(datasetName, userName)) }
});

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDataset: ''
        }
    }

    componentDidMount() {
        this.props.fetchModelFiles(sessionStorage.getItem('verifiedUsername'));
        this.props.fetchDatasetFiles(sessionStorage.getItem('verifiedUsername'));
        this.props.fetchAllDatasetFiles();
        this.props.fetchAllModels();
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("start should");
        // if the metadata itself needs to be updated, return true
        //console.log("compareMetadata: ", this.props.metadata.metadata);
        //console.log("nextMetadata: ", nextProps.metadata.metadata);

        const compareBindedDatasets = (currentBindedDatasets, nextBindedDatasets) => {
            //console.log("current: ", currentBindedDatasets);
            //console.log("next: ", nextBindedDatasets)
            if (currentBindedDatasets.length !== nextBindedDatasets.length) {
                return true;
            }
            else {
                const result = currentBindedDatasets.map((eachValue, index) => {
                    return Object.values(eachValue).map((eachAttr, attrIndex) => {
                        return eachAttr !== Object.values(nextBindedDatasets[index])[attrIndex] ? "update" : "noUpdate";
                    })
                });

                const result_final = result.map(eachResult => {
                    return eachResult.includes("update") ? "update" : "noUpdate";
                });

                return result_final.includes("update");
            }
        };

        if (compareProps(this.props.metadata.metadata[0], nextProps.metadata.metadata[0], this.props.modelFiles.modelFiles, nextProps.modelFiles.modelFiles)) {
            console.log("because of metadata");
            return true
        }
        else {
            if (compareBindedDatasets(this.props.datasetFiles.datasetFiles, nextProps.datasetFiles.datasetFiles)) {
                console.log("because of dataset files");
                return true;
            }
            else if (this.props.connectionFiles.connectionFiles[0] !== nextProps.connectionFiles.connectionFiles[0]) {
                console.log("because of connection files");
                return true
            }

            else if (compareBindedDatasets(this.props.connectionFiles.bindedDatasets, nextProps.connectionFiles.bindedDatasets)) {
                console.log("because of binded datasets");
                return true
            }
            else {
                console.log("not update");
                return false;
            }
        }
    }

    render() {
        const DatasetWithName = ({ match }) => {
            let selectedDataset = this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0] == undefined ? localStorage.getItem('datasetname-detaileddata') :
                this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0].FileName;
            //localStorage.setItem('datasetname-detaileddata', selectedDataset);
            //console.log("detaileddata for name: ", selectedDataset);

            return (
                <DetailedDataset
                    selectedDataset={this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0]}
                    sendNameForDetailedData={this.props.sendNameForDetailedData}
                    detailedData={this.props.detailedData.detailedData}
                    isLoading_detailedData={this.props.detailedData.isLoading}
                    errMess_detailedData={this.props.detailedData.errMess}

                    metadata={this.props.metadata.metadata[0]}
                    isLoading_metadata={this.props.metadata.isLoading}
                    errMess_metadata={this.props.metadata.errMess} />
            );
        };

        const DatasetSelect = ({ match }) => {
            let datasetName = this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0] == undefined ? localStorage.getItem('datasetname-metadata') :
                this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0].FileName;
            console.log("dataset name: ", datasetName);
            localStorage.setItem('datasetname-metadata', datasetName);

            return (
                <MetadataForm dataset={this.props.datasetFiles.datasetFiles.filter(dataset => dataset.FileName === match.params.datasetName)[0]}
                    submitMetadata={this.props.submitMetadata}
                    fetchDatasetFiles={this.props.fetchDatasetFiles}
                    sendNameForDetailedData={this.props.sendNameForDetailedData}
                    detailedData={this.props.detailedData.detailedData}
                    isLoading_detailedData={this.props.detailedData.isLoading}
                    errMess_detailedData={this.props.detailedData.errMess}

                    metadata={this.props.metadata.metadata[0]}
                    isLoading_metadata={this.props.metadata.isLoading}
                    errMess_metadata={this.props.metadata.errMess}
                />
            );
        };

        const ModelSelect = ({ match }) => {
            let modelName = this.props.modelFiles.modelFiles.filter(model => model.FileName === match.params.modelName)[0] == undefined ? localStorage.getItem('modelname') :
                this.props.modelFiles.modelFiles.filter(model => model.FileName === match.params.modelName)[0].FileName;
            console.log("model name: ", modelName);
            localStorage.setItem('modelname', modelName);

            return (
                <BindedDatasets modelName={this.props.modelFiles.modelFiles.filter(model => model.FileName === match.params.modelName)[0]}
                    getBindedDatasets={this.props.getBindedDatasets}
                    isBindLoading={this.props.isBindLoading}
                    bindedDatasets={this.props.connectionFiles.bindedDatasets}
                    isBindLoading={this.props.connectionFiles.isLoading}

                    deleteDataset={this.props.deleteOneBindedDataset}
                    editModelDescription={this.props.editModelDescription}
                    fetchModelFiles={this.props.fetchModelFiles}
                />
            );
        };

        return (
            <Row>
                <Col className="sidebar" md="3"><Sidebar username={this.props.user.userInfo} /></Col>
                <Col className="main-page">
                    <Switch>
                        <Route path="/uploading" component={() =>
                            <ConnectionUploading connectUploading={this.props.connectUploading}
                                connectionFiles={this.props.connectionFiles.connectionFiles}
                                uploadingStatus={this.props.connectionFiles.uploadingStatus}
                                clearConnectionFiles={this.props.clearConnectionFiles}
                            />} />

                        <Route exact path="/mydatabase" component={() =>
                            <Database datasetFiles={this.props.datasetFiles.datasetFiles}
                                isLoading={this.props.datasetFiles.isLoading}
                                isQuery={this.props.datasetFiles.isQuery}
                                errMess={this.props.datasetFiles.errMess}
                                uploadDataset={this.props.uploadDataset}
                                fetchUploadedDataset={this.props.fetchUploadedDataset}
                                deleteDataset={this.props.deleteDataset}
                                fetchDatasetFiles={this.props.fetchDatasetFiles}
                                queryDatasets={this.props.queryDatasets}

                                modelFiles={this.props.modelFiles.modelFiles}
                                bindModel={this.props.bindModel}

                                downloadFile={this.props.downloadFile}

                                allDatasetFiles={this.props.allDatasetFiles.datasetFiles}
                                isAllLoading={this.props.allDatasetFiles.isLoading}
                                allErrMess={this.props.allDatasetFiles.errMess}
                                fetchAllDatasetFiles={this.props.fetchAllDatasetFiles}
                                queryAllDatasets={this.props.queryAllDatasets}
                            />} />
                        <Route path='/alldataset/:datasetName' component={DatasetWithName} />
                        <Route path="/metadata-form/:datasetName" component={DatasetSelect} />
                        <Route path="/mymodels/:modelName" component={ModelSelect} />
                        <Route exact path="/mymodels" component={() => <SOMModel
                            modelFiles={this.props.modelFiles.modelFiles}
                            isLoading={this.props.modelFiles.isLoading}
                            errMess={this.props.modelFiles.errMess}
                            uploadModel={this.props.uploadModel}
                            fetchUploadedModel={this.props.fetchUploadedModel}
                            deleteModel={this.props.deleteModel}
                            editModelDescription={this.props.editModelDescription}
                            fetchModelFiles={this.props.fetchModelFiles}
                            fetchDatasetFiles={this.props.fetchDatasetFiles}

                            connectUploading={this.props.connectUploading}
                            connectionFiles={this.props.connectionFiles.connectionFiles}
                            clearConnectionFiles={this.props.clearConnectionFiles}
                            bindedDatasets={this.props.connectionFiles.bindedDatasets}
                            getBindedDatasets={this.props.getBindedDatasets}

                            queryModels={this.props.queryModels}
                            isBindLoading={this.props.connectionFiles.isLoading}
                        />} />
                        <Route path="/visualisation" component={Visualisation} />

                        <Route path="/allmodels" component={() => <AllModel
                            fetchAllModels={this.props.fetchAllModels}
                            allModels={this.props.allModels.modelFiles}
                        />} />

                        <Route exact path="/alldataset" component={() =>
                            <AllDataset datasetFiles={this.props.allDatasetFiles.datasetFiles}
                                isLoading={this.props.allDatasetFiles.isLoading}
                                errMess={this.props.allDatasetFiles.errMess}
                                fetchDatasetFiles={this.props.fetchAllDatasetFiles}
                                queryDatasets={this.props.queryAllDatasets}
                            />} />
                        <Redirect to="/mymodels" />
                    </Switch>
                </Col>
            </Row>

        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

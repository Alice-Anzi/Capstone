import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { IconButton, Modal, TableRow } from '@material-ui/core';
import TableChartIcon from '@material-ui/icons/TableChart';
import { Link } from 'react-router-dom';

import { Loading } from './LoadingComponent';
import DownloadFile from '../components/Modal/downloadFile';
import SearchAllDatasets from './SearchAllDatasets';

class AllDataset extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    this.props.fetchDatasetFiles();
  }

  // to create a flexible table head, where the number of columns depends on the attributes in the datafile.
  // dataset: array. JSON data stored inside.
  tableHead(datasets) {
    if (datasets !== undefined) {
      return (
        <thead style={{backgroundColor: '#FFE399', color: "black"}}>
          <tr>
            <th width="12%">File name</th>
            <th width="20%">Description</th>
            <th width="12%">User name</th>
            <th width="8%">Operation</th>
          </tr>
        </thead>
      );
    }

    return (
      <div>The table for storing uploaded datasets does not exist</div>
    );
  }

  tableBody(datasets) {
    // when there is no uploaded dataset in the database
    if (datasets.length === 0) {
      return (
        <tbody />
      );
    }
    else { // where are dataset stored in the database
      return (
        <tbody>
          {datasets.map((eachDataset, index) =>
            <tr key={index}>
              <td key={'name'}>{eachDataset.FileName}</td>
              <td key={'Description'}>{eachDataset.Description}</td>
              <td key={'Username'}>{eachDataset.UserName}</td>
              <td key={"operateEachDataset"}>{this.operateDataset(true, eachDataset.FileName, eachDataset.UserName)}</td>
            </tr>
          )}
        </tbody>
      );
    }

  }

  //showOperate: bool. the delete button and the create button will be disable
  operateDataset(showOperate, fileName, userName) {
    /**
     if (icons === "add only") {
            return (
                <Container>
                    <Row>
                        <DatasetUpload addDataset={this.props.datasetfile} />
                    </Row>
                </Container>
            );
        }*/
    if (showOperate) {
      return (
        <Container>
          <Row>
            <Link to={`/alldataset/${fileName}?userName=${userName}&fileName=${fileName}`}>
              <IconButton aria-label="detailed data" component="span">
                <TableChartIcon />
              </IconButton>
            </Link>

            <DownloadFile downloadFile={this.props.downloadFile} datasetName={fileName} userName={userName}/>
          </Row>
        </Container>
      );
    }
  }

  renderDatasetTable(datasets, isLoading, errMess) {
    if (isLoading) {
      return (
        <Loading />
      );
    }
    else if (errMess) {
      return (
        <h4>{errMess}</h4>
      );
    }
    else {
      return (
        <Table hover style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
          {this.tableHead(datasets)}
          {this.tableBody(datasets)}
        </Table>
      );
    }
  }

  render() {
    return (
      <Container>
        <Col className="search-box" >
          <SearchAllDatasets queryDatasets={this.props.queryDatasets}/>
        </Col>

        <Col className="database">
          {this.renderDatasetTable(this.props.datasetFiles, this.props.isLoading, this.props.errMess)}
        </Col>
      </Container>
    );
  }
}

export default AllDataset;

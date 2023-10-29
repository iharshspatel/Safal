import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Styles from './ArchitectTable.module.css'
import axios from 'axios'
import Add from '../../../Assets/Add.svg'
import MaterialTable from 'material-table';
import { Paper } from '@material-ui/core';
import Modal from '../../Layout/Modal/Modal';
import ArchitectEditForm from '../../Forms/ArchitectEditForm';
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select'
import { dateformater } from '../Utils/util';
import MaterialReactTable from 'material-react-table';
import { ExportToCsv } from 'export-to-csv';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useSelector } from 'react-redux';
const ArchitecTable = ({ modalHandler, refresh, isOpen }) => {
  const [architects, setArchitects] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [tabledata, setTableData] = useState([]);
  const [orginalData, setOriginalData] = useState([]);
  const [startDate, setStartDate] = useState(new Date('2022-08-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let [selectedBranch,setSelectedBranch] = useState(null);
  let [selectedSalesman,setSelectedSalesman] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const startDateHandler = (e) => {
    setStartDate(new Date(e.target.value));
  }

  const endDateHandler = (e) => {
    setEndDate(new Date(e.target.value));
  }

  const submitDateRangeHandler = (e) => {
    console.log(startDate, endDate);
    console.log(architects)
    let data = architects.filter((item) => {
      let date = item.date;
      date = new Date(date);
      if(!date){
        return false;
      }
      if (date < endDate && date > startDate) {
        return true
      }
      else {
        return false
      }
    })
    setTableData(data)
  }

  const delteHandler = async (mobileno) => {

    if(window.confirm("Are you sure ?")){
      const data = await axios.delete(`/api/v1/architect/delete/${mobileno}`);
      fetchArchitect();
    }
  }

  const fetchArchitect = async () => {
    const { data } = await axios.get("/api/v1/architect/getall");
    console.log(data);
    const newarchitects = data.architects.map((item)=>{
      // console.log(item.date);
      let formateddate = item.date ? (item.date) : new Date('01/01/1799');
      console.log(formateddate);
      return {
        date:formateddate,
        name:item.name,
        address:item.address,
        area:item.area,
        mobileno:item.mobileno,
        salesmen:item.salesmen.map((req)=>req.name).join('-'),
        branchname:item.branches.map((req)=>req.branchname).join('-'),
        remarks:item.remarks
      }
    });
    console.log(newarchitects, "<========================");
    setOriginalData(data.architects);
    setTableData(newarchitects);
    setArchitects(newarchitects);
  }

  const getArchitectData = (mobileno) => {
    alert(mobileno);
    let architect = orginalData.filter((item) => item.mobileno === mobileno);
    console.log(architect);
    setEditModalData(architect[0]);
    setEditModal(true);
  }


  const fetchBranches = async () => {
    const { data } = await axios.get("/api/v1/branch/getall");

    const branches = data.branches.map((branch) => (
      {
        branchname: branch.branchname,
        value: branch.branchname,
        label: branch.branchname

      }
    ))
    setBranches(branches);
  }
  const sleep = time => {
    return new Promise(resolve => setTimeout(resolve, time));
  };

  const handlebranch = (selected) => {
    console.log(selected);
    setSelectedBranch(selected.value)
    fetchFilteredArchitects(selectedSalesman, selected.value);
  }
  const [salesman, setSalesman] = useState([]);
  const fetchSalesmen = async () => {
    const { data } = await axios.get("/api/v1/salesman/getall");

    const salesmen = data.salesmans.map((branch) => (
      {
        name: branch.name,
        value: branch.name,
        label: branch.name

      }
    ))
    setSalesman(salesmen);
  }

  const handlesalesman = (selected) => {
    setSelectedSalesman(selected.value);
    fetchFilteredArchitects(selected.value, selectedBranch);
  }

  
  const fetchFilteredArchitects =(salesman, branch) => {

    let filteredData = orginalData.filter((item)=>{
      let isBranch = false;
      let isSalesman = false;
      if(item.branches.length === 0 && branch===null){
        isBranch = true;
      }

      if(item.salesmen.length === 0 && salesman===null){
        isSalesman = true;
      }
      item.branches.forEach((branchObject)=>{
        if(Object.values(branchObject).includes(branch) || branch===null || branch===""){
        isBranch = true;
      }})
      item.salesmen.forEach((salesmanObj)=>{
        if(Object.values(salesmanObj).includes(salesman) || salesman===null || salesman===""){
          isSalesman = true;
        }})

      console.log(isBranch, isSalesman)
      if(isSalesman && isBranch){
        return true
      }
    })
    console.log(filteredData);
    let data = filteredData.map((item)=>{
      let formateddate = item.date ? item.date : '01/01/1799';
      return {
        date:formateddate,
        name:item.name,
        address:item.address,
        area:item.area,
        mobileno:item.mobileno,
        salesmen:item.salesmen.map((req)=>req.name).join('-'),
        branchname:item.branches.map((req)=>req.branchname).join('-'),
        remarks:item.remarks
        
      }
      })
    console.log(data.length, "<++++++++++THIS IS THE LENGTH");
    setArchitects(data);
    setTableData(data);  
  }


  useEffect(() => {
    fetchBranches();
    fetchArchitect();
    fetchSalesmen();
  }, [refresh]);

  const customStyles = {
    control: base => ({
      ...base,
      minHeight: 55
    }),
    dropdownIndicator: base => ({
      ...base,
      padding: 4
    }),
    clearIndicator: base => ({
      ...base,
      padding: 4
    }),
    multiValue: base => ({
      ...base,

    }),
    valueContainer: base => ({
      ...base,
      padding: '0px 6px'
    }),
    input: base => ({
      ...base,
      margin: 0,
      padding: 0
    })
  };
  const handleCallbackCreate = async(childData) => {

    toast.success("Architect edited");
    const { data } = await axios.get("/api/v1/architect/getall");
    setOriginalData(data.architects);
    // fetchArchitect();
    window.scrollTo(0, 0)
  }

  useEffect(()=>{
    fetchFilteredArchitects(selectedSalesman,selectedBranch)
    console.log(`SET FILTERED DATA AGAIN`)
  },[orginalData]);

  const columns = useMemo(
    () => [
      { header: 'Date', accessorKey: 'date', type: "date", dateSetting: { locale: "en-GB" },
      Cell: ({cell})=>(dateformater(cell.getValue())) },
      { header: 'Name', accessorKey: 'name' },
      { header: 'Address', accessorKey: 'address' },
      { header: 'Area', accessorKey: 'area' },
      { header: 'Mobile Number', accessorKey: 'mobileno' },
      {header: 'Salesman', accessorKey:'salesmen'},
      {header: 'BranchName', accessorKey:'branchname'},
      { header: 'Remarks', accessorKey: 'remarks' },
    ],
    [],
  );
  const ops = [
    { header: 'Date', accessorKey: 'date', type: "date", dateSetting: { locale: "en-GB" }, Cell: ({cell})=>(dateformater(cell.getValue())) },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Address', accessorKey: 'address' },
    { header: 'Area', accessorKey: 'area' },
    { header: 'Mobile Number', accessorKey: 'mobileno' },
    {header: 'Salesman', accessorKey:'salesmen'},
    {header: 'BranchName', accessorKey:'branchname'},
    { header: 'Remarks', accessorKey: 'remarks' },
    // { header: 'Email', accessorKey: 'Email', },
    // { header: 'Company_Name', accessorKey: 'companyName', },
    // { header: 'Birth_Date', accessorKey: 'birthdate', },
    // { header: 'Marriage_Date', accessorKey: 'marriagedate', },
    // { header: 'Remarks', accessorKey: 'remarks', },
    // { header: 'Bank_Name', accessorKey: 'bankname', },
    // { header: 'IFS_Code', accessorKey: 'IFSCcode', },
    // { header: 'Branch_Name', accessorKey: 'branchname', },
    // { header: 'Adhar_Card', accessorKey: 'adharcard', },
    // { header: 'Pan_Card', accessorKey: 'pancard', columnVisibility: 'false' },
  ]
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ops.map((c) => c.header),
  };
  const csvExporter = new ExportToCsv(csvOptions);
  const handleExportData = () => {

    csvExporter.generateCsv(tabledata);
  };
  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };
  return (
    <div className={Styles.container}>
      <div className={Styles.table}>
        <div className={Styles.header}>
          <h3>All Architect</h3>

          <div className={Styles.buttonContainer}>
            <img className={Styles.addImg} src={Add} alt="add" />
            <p className={Styles.buttonText} onClick={modalHandler}>
              Add Architect
            </p>

          </div>
        </div>
        <div className={Styles.Yellow}>

          <div className={Styles.DateRangeContainer}>
            <label>Salesman Filter</label>
            <Select styles={customStyles} onChange={(e) => handlesalesman(e)} options={salesman} />
            <label>Branch Filter</label>
            <Select styles={customStyles} onChange={(e) => handlebranch(e)} options={branches} />
            <TextField
              className={Styles.InputDate}
              id="date"
              label="Start Date"
              type="date"

              onChange={(e) => startDateHandler(e)}
              sx={{ width: 180, margin: 1 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField

              className={Styles.InputDate}
              id="date"
              label="End Date"
              type="date"
              onChange={(e) => endDateHandler(e)}

              sx={{ width: 180, margin: 1 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <button className={Styles.SubmitButton} onClick={(e) => submitDateRangeHandler(e)} type="submit"> Submit </button>
          </div>
        </div>
        {(architects&& user.role === "admin") &&
          <MaterialReactTable
            displayColumnDefOptions={{
              'mrt-row-actions': {
                muiTableHeadCellProps: {
                  align: 'center',
                },

                size: 120,
              },
            }}

            muiTopToolbarProps={
              ({ }) => ({
                color: 'green',
                sx: { display: 'block' },
                zIndex: '0'
              })
            }
            columns={columns}
            data={tabledata}
            enableEditing
            enableRowNumbers
            rowNumberMode='original'
            enableTopToolbar={!editModal && !isOpen}

            muiTablePaginationProps={{
              rowsPerPageOptions: [5, 10],
              showFirstLastPageButtons: true,
            }}
            enableGlobalFilter={true}
            positionActionsColumn='last'
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip arrow placement="left" title="Edit">
                  <IconButton onClick={() => {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth"
                    });
                    getArchitectData(row.original.mobileno)
                    // setEditModalData(row.original)
                    setEditModal(true);
                  }}>
                    <Edit />

                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="Delete">
                  <IconButton color="error" onClick={() => {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth"
                    });
                    delteHandler(row.original.mobileno);
                    console.log(`delete `, row)
                  }}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
              >
                <Button
                  disabled={table.getPrePaginationRowModel().rows.length === 0}

                  onClick={() =>
                    handleExportRows(table.getPrePaginationRowModel().rows)
                  }
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >Export All Rows</Button>
                <Button
                  // className={Styles.bu}
                  color="primary"
                  onClick={handleExportData}
                  startIcon={<FileDownloadIcon />}
                  variant="contained"
                >
                  Export All Data
                </Button>
              </Box>)}

          />}


      </div>

      {
        editModal ? <Modal ><ArchitectEditForm className={Styles.zi} modalHandler={() => { setEditModal(false) }} data={editModalData} setIsOpen={setEditModal} parentCallback={handleCallbackCreate} /></Modal> : null}

      <div className={Styles.filter}>

      </div>
    </div>
  )
}

export default ArchitecTable
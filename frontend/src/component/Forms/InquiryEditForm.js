import React, { useState, useEffect } from 'react'
import Styles from './DealerCreateForm.module.css'
import { AiFillCloseCircle } from 'react-icons/ai'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify'
import Option from '../DropDown/Options'
import Select from 'react-select'
import { default as ReactSelect } from "react-select";

const InquiryEditForm = ({ modalHandler, data, setIsOpen, parentCallback }) => {
    const [Branches, setBranches] = useState([]);
    // console.log(data);
    const [selectedBranch, setselectedBranch] = useState(data.branches);
    const [Salesmen, setSalesmen] = useState([]);
    const [selectedSalesman, setselectedSalesman] = useState(data.salesmen);
    const arr2 = selectedSalesman.map(object => {
        // console.log(object);
        return { ...object, value: object.name, label: object.name };
    })
    const getAllsalesmen = async () => {
        const { data } = await axios.get("/api/v1/salesman/getall");
        const salesmen = data.salesmans.map((branch) => (
            {
                name: branch.name,
                value: branch.name,
                label: branch.name
            }
        ))
        setSalesmen(salesmen);
    }
    const Salesmenchangehandler = (selected) => {

        setselectedSalesman(selected);
        console.log(selected);
        setFormData({ ...formData, selectedSalesman })
    };
    const arr = selectedBranch.map(object => {
        return { ...object, value: object.branchname, label: object.branchname };
    })
    const getAllbranches = async () => {
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
    let initialState = {
        name: data.name,
        email: data.email,
        mobileno: data.mobileno,
        address: data.address,
        // companyName: data.companyName,
        // birthdate: data.birthdate ? data.birthdate.substr(0, 10) : null,
        // marriagedate: data.marriagedate ? data.marriagedate.substr(0, 10) : null,
        // remarks: data.remarks,
        architectTag: data.architectTag,
        architectName: data.architectName,
        architectNumber: data.architectNumber,
        pmcTag: data.pmcTag,
        pmcName: data.pmcName,
        pmcNumber: data.pmcNumber,
        date: data.date ? data.date.substr(0, 10) : null,
        followupdate: data.followupdate ? data.followupdate.substr(0, 10) : null,
        // followupdate: "",
        requirement: data.requirement,
        stage: data.stage,
        // bankname: data.bankname,
        // branchname: data.branchname,
        // IFSCcode: data.IFSCcode,
        // adharcard: data.adharcard,
        // pancard: data.pancard,
        // date: data.date ? data.date.substr(0, 10) : null,
        branches: data.branches,
        salesmen: data.salesmen,
        // name: "",
        // email: "",
        // mobileno: "",
        // address: "",
        // branches: [],
        // salesmen: []

    }
    // console.log(initialState);
    const requirement = [
        {
            value: "Plywood",
            label: "Plywood"
        },
        {
            value: "Laminate",
            label: "Laminate"
        },
        {
            value: "Veneer",
            label: "Veneer"
        },
        {
            value: "Other",
            label: "Other"
        },
        {
            value: "Hardware",
            label: "Hardware"
        },
    ]
    const stage = [
        {
            value: "Process",
            label: "Process"
        },
        {
            value: "Qualified",
            label: "Qualified"
        },
        {
            value: "Unqualified",
            label: "Unqualified"
        },

    ]
    let id = data._id;
    const [formData, setFormData] = useState(initialState)
    const [isDisabled, setIsDisabled] = useState(false);

    const formHandler = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        // getAllbranches();
        // getAllsalesmen();
        getAllArchitects();
        getAllDealer();
        getAllMistry();
        getAllPMC();
        getAllbranches();
        getAllsalesmen();
    }, []);
    const submitHandler = async (e) => {
        e.preventDefault();
        setIsDisabled(true);
        let data = {
            name: formData.name,
            email: formData.email,
            mobileno: formData.mobileno,
            address: formData.address,
            date: formData.date,
            followupdate: formData.fdate,
            architectTag: formData.architectTag,
            architectNumber: formData.architectNumber,
            architectName: formData.architectName,
            pmcTag: formData.pmcTag,
            pmcName: formData.pmcName,
            pmcNumber: formData.pmcNumber,
            requirement: formData.requirement,
            stage: formData.stage,
            branches: selectedBranch,
            salesmen: selectedSalesman

        }
        console.log(data)
        console.log(selectedSalesman)
        try {
            const response = await axios.put(`/api/v1/inquiry/update/${id}`, data, { headers: { "Content-Type": "application/json" } });
            console.log(response);
            // toast.success("dealer is Edited ");
            parentCallback();
            setIsOpen(false);

        }
        catch (e) {
            toast.error(e.response.data.message);
            console.log(e.response.data.message)
            setIsDisabled(false);
        }

    }
    const Branchchangehandler = (selected) => {

        setselectedBranch(selected);
        console.log(selected);
        setFormData({ ...formData, selectedBranch })
    };
    const ArchitectFormHandler = (e) => {
        setFormData({ ...formData, architectTag: e.value, architectName: e.label.split('-')[0], architectNumber: e.label.split('-')[1] })
    }
    const Requirehandler = (e) => {
        setFormData({ ...formData, requirement: e.value })
    }
    const Stagehandler = (e) => {
        setFormData({ ...formData, stage: e.value })
    }

    const MistryFormHandler = (e) => {
        console.log(e.value);
        setFormData({ ...formData, mistryTag: e.value, mistryName: e.label.split('-')[0], mistryNumber: e.label.split('-')[1] })
    }

    const DealerFormHandler = (e) => {
        console.log(e.value);
        setFormData({ ...formData, dealerTag: e.value, dealerName: e.label.split('-')[0], dealerNumber: e.label.split('-')[1] })
    }

    const PMCFormHandler = (e) => {
        console.log(e.value);
        setFormData({ ...formData, pmcTag: e.value, pmcName: e.label.split('-')[0], pmcNumber: e.label.split('-')[1] })
    }
    // const Salesmenchangehandler = (selecteds) => {

    //     setselectedSalesmen(selecteds);
    //     console.log(selecteds);
    //     setFormData({ ...formData, selectedSalesmen })
    // };
    // const getAllsalesmen = async () => {
    //     const { data } = await axios.get("/api/v1/salesman/getall");
    //     console.log(data.salesmans);
    //     const salesmen = data.salesmans.map((salesman) => (
    //       {
    //         name: salesman.name,
    //         value: salesman.name,
    //         label: salesman.name
    //       }
    //     ))
    //     setSalesmen(salesmen);
    //   }
    // const [Salesmen, setSalesmen] = useState([]);
    const [architects, setArchitects] = useState([]);
    const [Mistries, setMistries] = useState([]);
    const [Dealers, setDealers] = useState([]);
    const [PMCs, setPMCs] = useState([]);
    const [selectedSalesmen, setselectedSalesmen] = useState([]);
    const getAllArchitects = async () => {

        const { data } = await axios.get("/api/v1/architect/getall");

        const architects = data.architects.map((arch) => ({ value: arch._id, label: `${arch.name}-${arch.mobileno}` }))

        setArchitects(architects);

    }

    const getAllMistry = async () => {

        const { data } = await axios.get("/api/v1/mistry/getall");
        const mistries = data.mistries.map((mistry) => ({ value: mistry._id, label: `${mistry.name}-${mistry.mobileno}` }))
        setMistries(mistries);
    }

    const getAllDealer = async () => {
        const { data } = await axios.get("/api/v1/dealer/getall");

        const dealers = data.dealers.map((dealer) => ({ value: dealer._id, label: `${dealer.name}-${dealer.mobileno}` }))
        setDealers(dealers);
    }

    const getAllPMC = async () => {

        const { data } = await axios.get("/api/v1/pmc/getall");

        const pmcs = data.pmcs.map((pmc) => ({ value: pmc._id, label: `${pmc.name}-${pmc.mobileno}` }))
        setPMCs(pmcs);


    }

    return (
        <div className={Styles.container}>

            <div className={Styles.closebutton} onClick={modalHandler}>
                <AiFillCloseCircle />
            </div>

            <h1 className={Styles.heading}>Personal Details</h1>

            <div className={Styles.personalDetails}>

                <div className={Styles.personalDetails1}>

                    <label htmlFor='name'>Inquiry Name</label>
                    <input className={Styles.inputTag} name="name" value={formData.name} onChange={(e) => formHandler(e)} placeholder='Customer Name' />

                    <label htmlFor='number'>Mobile Number</label>
                    <input className={Styles.inputTag} name="mobileno" value={formData.mobileno} onChange={(e) => formHandler(e)} placeholder='Mobile Number' />

                    <label htmlFor='number'>Email</label>
                    <input className={Styles.inputTag} name="email" value={formData.email} onChange={(e) => formHandler(e)} placeholder='Email' />

                    {/* <label htmlFor='address'>Address</label>
            <input className={Styles.inputTag} name="address" value={formData.address} onChange={(e) => formHandler(e)} placeholder='Address' />
  
            <label htmlFor='ordervalue'>Order Value</label>
            <input className={Styles.inputTag} name="orderValue" value={formData.orderValue} onChange={(e) => formHandler(e)} placeholder='Order Value' />
  
            <label htmlFor='name'>Remarks</label>
            <input className={Styles.inputTag} name="remarks" value={formData.remarks} onChange={(e) => formHandler(e)} placeholder='Remarks' /> */}
                </div>

                <div className={Styles.personalDetails2}>

                    <label htmlFor='name'>Created At</label>
                    <input className={Styles.inputTag} type="date" name="date" value={formData.date} onChange={(e) => formHandler(e)} placeholder='Created At' />

                    <label htmlFor='name'>Follow up Date</label>
                    <input className={Styles.inputTag} type="date" name="followupdate" value={formData.followupdate} onChange={(e) => formHandler(e)} placeholder='Follow up Date' />

                    {/* <label htmlFor='name'>Annivarsary</label>
            <input className={Styles.inputTag} type="date" name="marriagedate" value={formData.marriagedate} onChange={(e) => formHandler(e)} placeholder='Annivarsary' /> */}

                    {/* <label htmlFor='name'>Sales Person</label>
            <input className={Styles.inputTag} name="salesPerson" value={formData.salesPerson} onChange={(e) => formHandler(e)} placeholder='Sales Person' /> */}
                    <label>Requirements</label>
                    <Select  defaultValue={{label:initialState.requirement}} onChange={(e) => Requirehandler(e)} options={requirement} />
                    {/* {console.log(initialState.requirement)} */}
                    <label>Stage</label>
                    <Select defaultValue={{label:initialState.stage}} onChange={(e) => Stagehandler(e)} options={stage} />
                    <label>Branches</label>
                    <ReactSelect className={Styles.inputTag}
                        options={Branches}
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                            Option
                        }}
                        onChange={Branchchangehandler}
                        allowSelectAll={true}
                        value={arr}
                    />
                    <label>Salesmen</label>
                    <ReactSelect className={Styles.inputTag}
                        options={Salesmen}
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                            Option
                        }}
                        onChange={Salesmenchangehandler}
                        allowSelectAll={true}
                        value={arr2}
                    />
                </div>
            </div>

            <div className={Styles.bankDetails}>
                <div className={Styles.bankDetails1}>

                    <label htmlFor='name'>Mistry Tag</label>
                    <Select selectedValue={formData.mistryTag} onChange={(e) => MistryFormHandler(e)} options={Mistries} />

                    <label htmlFor='name'>Architect Tag</label>
                    <Select selectedValue={formData.architectTag} onChange={(e) => ArchitectFormHandler(e)} options={architects} />
                </div>

                <div className={Styles.bankDetails2}>

                    <label htmlFor='name'>Dealer Tag</label>
                    <Select selectedValue={formData.dealerTag} onChange={(e) => DealerFormHandler(e)} options={Dealers} />

                    <label htmlFor='name'>PMC Tag</label>
                    <Select selectedValue={formData.pmcTag} onChange={(e) => PMCFormHandler(e)} options={PMCs} />
                </div>
            </div>
            <button disabled={isDisabled} className={isDisabled ? Styles.disable : Styles.submitButton} onClick={(e) => submitHandler(e)} type="Submit">Submit</button>
        </div>

    )
}

export default InquiryEditForm
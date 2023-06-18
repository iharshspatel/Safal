import React, { useState, useEffect } from 'react'
import CustomerCreateForm from '../../Forms/CustomerCreateForm'
import Modal from '../../Layout/Modal/Modal'
import Navigation from '../../Layout/Navigation'
import StatBox from '../../Layout/StatBox'
import CustomerTable from '../../Tables/Customer/CustomerTable'
import Styles from './Customer.module.css'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify'
const Customer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin')
    }

  }, [isAuthenticated]);

  const modalHandler = () => {
    setIsOpen(!isOpen);

  }
  const [refresh, doRefresh] = useState(true);

  const handleCallbackCreate = (childData) => {
    // console.log("Parent Invoked!!")
    toast.success("customer is Created");
    doRefresh(!refresh);

  }
  return (
    <>
      <div className={Styles.container}>
        {/* <Navigation /> */}
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className={Styles.rightcontainer}>
          <StatBox name="Customer" username={user.name} />
          <CustomerTable modalHandler={modalHandler} refresh={refresh} isOpen={isOpen} />
          {
            isOpen ? <Modal setIsOpen={setIsOpen}>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ scale: 0 }}>
                  <CustomerCreateForm modalHandler={modalHandler} setIsOpen={setIsOpen} parentCallback={handleCallbackCreate} />
                </motion.div>
              </AnimatePresence>
            </Modal>
              : null
          }
        </div>
      </div>
    </>
  )
}

export default Customer
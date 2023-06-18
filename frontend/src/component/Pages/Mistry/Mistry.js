import React, { useState, useEffect } from 'react'
import MistryCreateForm from '../../Forms/MistryCreateForm'
import Modal from '../../Layout/Modal/Modal'
import Navigation from '../../Layout/Navigation'
import StatBox from '../../Layout/StatBox'
import MistryTable from '../../Tables/Mistry/MistryTable'
import Styles from './Mistry.module.css'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify'
const Mistry = () => {
  const [isOpen, setIsOpen] = useState(false);

  const modalHandler = () => {
    setIsOpen(!isOpen);
  }
  const { user, isAuthenticated } = useSelector((state) => state.user);
  let navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin')
    }
  }, [isAuthenticated, navigate]);
  const [refresh, doRefresh] = useState(true);

  const handleCallbackCreate = (childData) => {
    // console.log("Parent Invoked!!")
    toast.success("Mistry is Created");
    doRefresh(!refresh);

  }
  return (
    <>
      <div className={Styles.container}>
        {/* <Navigation/> */}
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
          <StatBox name="Mistry" username={user.name} />
          <MistryTable modalHandler={modalHandler} refresh={refresh} isOpen={isOpen} />
          {
            isOpen ? <Modal setIsOpen={setIsOpen} >
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ scale: 0 }}>
                  <MistryCreateForm modalHandler={modalHandler} setIsOpen={setIsOpen} parentCallback={handleCallbackCreate} />
                </motion.div>
              </AnimatePresence>
            </Modal> : null
          }
        </div>
      </div>
    </>
  )
}

export default Mistry
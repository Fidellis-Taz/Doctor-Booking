import React, { useEffect, useRef, useState } from 'react'
import "./Schedule.css"

import { DatePicker, Space, Table, Tag, Button, Checkbox, Tooltip } from 'antd';
import { DeleteFilled, EditFilled, EyeFilled, PlusOutlined } from '@ant-design/icons';
import { createScheduleAllDoctors } from '../../../api/schedule';
import { useSelector } from 'react-redux';
import { showErrorMsg, showSuccessMsg } from "../../../helpers/message";
import { showLoading } from "../../../helpers/loading";
import isEmpty from "validator/lib/isEmpty";
import MainDashboardLayout from "../../MainDashboard/LayoutCompo"
import Time from '../../Doctor/components/Time';
import ContentHeader from '../../Header/ContentHeader';

const CreateSchedule = () => {
    const { authDoctor } = useSelector((state) => ({ ...state }));


    const [formData, setFormData] = useState({
        doc: authDoctor?.doctor?._id,
        successMsg: false,
        errorMsg: false,
        loading: false,
    });
    const {
        doc,
        successMsg,
        errorMsg,
        loading,
    } = formData;
    const [checkedTimePhrames, setCheckedTime] = useState([])
    const [checkedDatePhrames, setCheckedDate] = useState([])




    useEffect(() => {
        //get all appointments available for the doctor
        //later on they will have a status , whether they were done or pending /cancelled
    }, [])


    /* Time data */
    const [checkedKeys, setCheckedKeys] = useState([]);



    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log("values selected ", checkedKeys)

        if (

            checkedDatePhrames.length == 0 ||
            checkedKeys.length == 0


        ) {
            setFormData({
                ...formData,
                loading: false,
                errorMsg: "All fields are required",
            });
        } else {

            setFormData({
                ...formData,
                loading: true,
                successMsg: false,
                errorMsg: false
            });




            const data = { checkedDatePhrames, checkedKeys }

            const res = await createScheduleAllDoctors(data)
                .then((responce) => {

                    console.log(responce.data.newSchedule);
                    setCheckedDate()
                    setCheckedKeys([])
                    setFormData({
                        ...formData,
                        loading: false,
                        successMsg: responce.data.successMessage,
                    });
                }).catch((err) => {
                    console.log(err.res);
                    setFormData({
                        ...formData,
                        loading: false,
                        errorMsg: "Schedule with that date already there.Please selecte a different date or delete the one you created",
                    });
                })
        }



    }

    function onChangee(date, dateString) {

        setCheckedDate(dateString)
        setFormData({
            ...formData,
            loading: false,
            successMsg: false,
            errorMsg: false
        });
    }





    return (
        <>
            <MainDashboardLayout>
                <ContentHeader link={"/admin/schedule/create"} name={"Schedules"} />


            </MainDashboardLayout>

        </>
    )
}

export default CreateSchedule
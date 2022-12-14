import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import "../../User.css"
import { Modal } from 'antd';
import { Select } from 'antd';
import { SearchOutlined } from "@ant-design/icons"
import { getProvinces } from '../../../../api/province';
import { getSpecializations } from '../../../../api/specialization';
import { getHospitalByProvinceApi } from '../../../../api/hospital';
import { getDoctorsBySearch } from '../../../../api/doctor';
const { Option } = Select;

const HospitalSearch = ({ setVisibleHosp, visibleHosp }) => {

    const [provinces, setProvinces] = useState([])
    const [specialzations, setSpecializations] = useState([])
    const [optionValueProvince, setOptionValueProvince] = useState()
    const [optionValueHospital, setOptionValueHospital] = useState()
    const [optionValueSpecialization, setOptionValueSpecialization] = useState()
    const [hospitalsByProvince, setHospitalsByProvince] = useState()
    const [searchButtonDisable, setSearchButtonDisable] = useState(true)

    useEffect(() => {
        allProvinces()
        getAllSpecializations()
    }, [])

    const getAllSpecializations = async () => {
        const res = await getSpecializations()
        console.log(res.data.specializations);
        setSpecializations(res.data.specializations)
    }
    const allProvinces = async () => {
        const res = await getProvinces()
        console.log(res.data.provinces);
        setProvinces(res.data.provinces)
    }


    const handleClick = (e) => {
        console.log(e.target.value);
    }


    const getHospitals = async (value) => {
        const res = await getHospitalByProvinceApi(value)

        if (res.data.hospitals) {

            setHospitalsByProvince(res.data.hospitals)
        } else if (res.data.message) {
            console.log(res.data.message);
        }

    }
    const history = useNavigate()
    const handleSubmit = async (evt) => {

        evt.preventDefault();

        //validate data


        console.log("send data");
        const formData = { optionValueProvince, optionValueHospital, optionValueSpecialization /* later on add district and other options */ }
        /* search doctors and their respective hospitals*/
        const res = await getDoctorsBySearch(formData)
        console.log(res.data.doctors);
        history(

            '/user/hospital/search', { state: { doctors: res.data.doctors, } }


        );
    }

    /****************************
     * EVENT HANDLERS
     ***************************/

    const today = new Date()


    return (
        <>


            <Modal

                centered
                visible={visibleHosp}
                onOk={() => setVisibleHosp(false)}
                onCancel={() => setVisibleHosp(false)}
                width={750}
                footer={null}
                wrapClassName="vaccModal"
            >


                <div className="vaccinesHospSearch">
                    <h5>Search Hospital to book an apppointment </h5>

                    <div className="required">
                        <strong style={{ color: "red" }} >* Is required field</strong>
                    </div>
                    <form className='vaccSearchHosp' onSubmit={handleSubmit} >

                        <div className="vaccSearchHosp__div city">
                            <label htmlFor="city"><strong style={{ color: "red" }} >*</strong>City</label>
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                onChange={async (value) => {
                                    await setOptionValueProvince(value)

                                    getHospitals(value)
                                    setSearchButtonDisable(false)
                                }}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                            >

                                {
                                    provinces && provinces.map((province) => {
                                        return (
                                            <Option key={province._id} value={province._id} onSelect={(e) => handleClick(e)} >{province.name}</Option>

                                        )
                                    })
                                }

                            </Select>
                        </div>

                        {/* <div className="vaccSearchHosp__div district">
                            <label htmlFor="district"> District</label>
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                disabled={searchButtonDisable}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                            >
                                <Option value="1">Mbare</Option>
                                <Option value="2">Closed</Option>
                                <Option value="3">Communicated</Option>
                                <Option value="4">Identified</Option>
                                <Option value="5">Resolved</Option>
                                <Option value="6">Cancelled</Option>
                            </Select>
                        </div> */}

                        <div className="vaccSearchHosp__div vacc__Type">
                            <label htmlFor="vacctype"><strong style={{ color: "red" }} >*</strong>Specialization</label>
                            <Select
                                showSearch
                                disabled={searchButtonDisable}
                                style={{ width: "100%" }}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                onChange={async (value) => {
                                    await setOptionValueSpecialization(value)


                                }}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                            >
                                {
                                    specialzations && specialzations.map((specialzation) => {
                                        return (
                                            <Option key={specialzation._id} value={specialzation._id} onSelect={(e) => handleClick(e)} >{specialzation.name}</Option>

                                        )
                                    })
                                }
                            </Select>
                        </div>


                        <div className="vaccSearchHosp__div Hospital">
                            <label htmlFor="city"><strong style={{ color: "red" }} >*</strong>Hospital</label>
                            <Select
                                showSearch

                                disabled={searchButtonDisable}
                                style={{ width: "100%" }}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                onChange={(value) => {
                                    setOptionValueHospital(value)
                                }}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            /*   filterSort={(optionA, optionB) =>
                                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                              } */
                            >
                                {
                                    hospitalsByProvince && hospitalsByProvince.map((hospital) => {
                                        return (
                                            <>
                                                <Option key={hospital._id} value={hospital._id} > {hospital.hospitalName} </Option>

                                            </>
                                        )
                                    })


                                }

                            </Select>
                        </div>

                        <div className="vaccSearchHosp__div Hospital">
                            <label htmlFor="city">Examination Location</label>
                            <Select
                                disabled
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Does not matter"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                            >
                                <Option value="1">Not Identified</Option>
                                <Option value="2">Closed</Option>
                                <Option value="3">Communicated</Option>
                                <Option value="4">Identified</Option>
                                <Option value="5">Resolved</Option>
                                <Option value="6">Cancelled</Option>
                            </Select>
                        </div>

                    </form>

                    <div className="submit__btn">
                        <button type='submit' onClick={handleSubmit} disabled={searchButtonDisable} >
                            <SearchOutlined className='search__icon' />
                            Search Appointment
                        </button>
                    </div>


                </div>

            </Modal>
        </>
    );
};

export default HospitalSearch
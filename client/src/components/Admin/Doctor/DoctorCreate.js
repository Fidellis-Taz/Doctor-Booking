import React, { useEffect, useState } from "react";
import { Link, useHistory, useNavigate } from "react-router-dom";
import isEmpty from "validator/lib/isEmpty";
import isEmail from "validator/lib/isEmail";
import equals from "validator/lib/equals";
import "../../Signup/Signup.css";
import { showErrorMsg, showSuccessMsg } from "../../../helpers/message";
import { showLoading } from "../../../helpers/loading";
import { signup } from "../../../api/doctor";
import { useSelector } from "react-redux";
import MainDashboardLayout from "../../MainDashboard/LayoutCompo"
import { getHospitalsApi } from "../../../api/hospital";
import { getSpecializations } from "../../../api/specialization";

/****************************
 * When Doctors SignUp their request will be pending so that they get verified if they are truly a doctor or not
 ***************************/





const DoctorCreate = () => {




    const [hospitals, setHospitals] = useState()
    const [specializations, setSpecializations] = useState()
    useEffect(() => {


        loadHospitals()
        loadSpecializations()
    }, [])
    /*  useEffect(async () => {
       const res2 = await getSpecializations()
       setSpecializations(res2.data)
     }, [specializations])
    */
    const loadHospitals = async () => {
        const res = await getHospitalsApi()
        setHospitals(res.data.hospitals)

    }
    const loadSpecializations = async () => {
        const res = await getSpecializations()
        setSpecializations(res.data.specializations)

    }

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        specialization: "",
        password: "",
        password2: "",
        phoneNumber: "",
        address: "",
        hospital: "",
        description: "",
        successMsg: false,
        errorMsg: false,
        loading: false,
    });
    const {
        name,
        email,
        specialization,
        password,
        password2,
        phoneNumber,
        address,
        hospital,
        description,
        successMsg,
        errorMsg,
        loading,
    } = formData;
    /****************************
     * EVENT HANDLERS
     ***************************/


    const { auth, authDoctor, customerservice } = useSelector((state) => ({ ...state }));


    let history = useNavigate();

    /*  useEffect(() => {
         if (auth && auth.user.role == 0) {
             history("/user/dashboard");
         } else if (authDoctor && authDoctor.doctor.role == 1) {
             history("/doctor/dashboard");
         }
         else if (customerservice && customerservice.customerservice.role == 2) {
             history("/customerservice/dashboard");
         }
         else if (auth && auth.user.role == 3) {
             history("/admin/dashboard");
         }
     }, [history]); */





    const handleChange = (evt) => {
        //console.log(evt);
        setFormData({
            ...formData,
            [evt.target.name]: evt.target.value,
            /* so that the error messages disappear as the user starts typing */
            successMsg: "",
            errorMsg: "",
        });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();

        // client-side validation
        if (
            isEmpty(name) ||
            isEmpty(email) ||
            isEmpty(password) ||
            isEmpty(password2) ||
            isEmpty(phoneNumber) ||
            isEmpty(address) ||
            isEmpty(hospital) ||
            isEmpty(description) ||

            isEmpty(specialization)
        ) {
            setFormData({
                ...formData,
                errorMsg: "All fields are required",
            });
        } else if (!isEmail(email)) {
            setFormData({
                ...formData,
                errorMsg: "Invalid email",
            });
        } else if (!equals(password, password2)) {
            setFormData({
                ...formData,
                errorMsg: "Passwords do not match",
            });
        } else {
            const { name, email, specialization, password, phoneNumber, address, hospital, description } = formData;
            const data = { name, email, specialization, password, phoneNumber, address, hospital, description };

            setFormData({ ...formData, loading: true });
            //send data to server
            signup(data)
                .then((response) => {
                    console.log("Axios signup success: ", response);
                    setFormData({
                        name: "",
                        email: "",
                        specialization: "",
                        password: "",
                        password2: "",
                        phoneNumber: "",
                        address: "",
                        hospital: "",
                        description: "",
                        loading: false,
                        successMsg: response.data.successMessage,
                    });
                    setHospitals()
                    setSpecializations()
                })
                .catch((err) => {
                    console.log("Axios signup error: ", err);
                    setFormData({
                        ...formData,
                        loading: false,
                        errorMsg: err.response.data.errorMessage,
                    });
                });
        }
    };

    /****************************
     * VIEWS
     ***************************/
    const showSignupForm = () => (
        <div class="row">
            <div class="col-10 mx-auto">
                <form id="formCreateNewDoctor" onSubmit={handleSubmit}>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="name">Full name</label>
                            <input type="text" class="form-control" id="name" name="name" value={name} onChange={handleChange} placeholder="Full name" />
                        </div>
                        <div class="form-group col-md-6">
                            <label for="phone">Phone number</label>
                            <input type="text" class="form-control" id="phone" name="phoneNumber" value={phoneNumber} onChange={handleChange} placeholder="Phone number" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" name="email" value={email} onChange={handleChange} placeholder="Email" />
                        </div>
                        <div class="form-group col-md-6">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" name="password" value={password} onChange={handleChange} placeholder="Password" />
                        </div>
                        <div class="form-group col-md-6">
                            <label for="password">Password2</label>
                            <input type="password" class="form-control" id="password" name="password2" value={password2} onChange={handleChange} placeholder="Password" />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="clinic">Belong to a Hospital</label>
                            <select id="clinic" class="form-control" name="hospital" onChange={handleChange}>
                                <option selected >Select the Hospital</option>
                                {/*  <option key="1">Para1</option>
                <option key="2">para2</option>
                <option key="3">para3</option> */}
                                {hospitals &&
                                    hospitals.map(c => {
                                        return (
                                            <option
                                                key={c._id}
                                                value={c._id}
                                            >
                                                {c.hospitalName}
                                            </option>
                                        )
                                    }

                                    )}
                            </select>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="specialization">Specialist</label>
                            <select id="specialization" class="form-control" name="specialization" onChange={handleChange}>
                                <option selected>Choose a specialist</option>
                                {/*  <option key="4">cerahi</option>
                <option key="5">kulak</option>
                <option key="6">boğaz</option> */}
                                {specializations &&
                                    specializations.map(c => {
                                        return (
                                            <option
                                                key={c._id}
                                                value={c._id}
                                            >
                                                {c.name}
                                            </option>
                                        )
                                    })}
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="address">Address</label>
                        <input type="text" class="form-control" id="address" name="address" value={address} onChange={handleChange} placeholder="Address" />
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" class="form-control" name="description" value={description} onChange={handleChange}></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" id="createNewDoctor">Create</button>
                    {/* already have account */}
                    <p className="text-center text-white">
                        Have an account? <Link to="/doctor/login">Log In</Link>
                    </p>
                </form>
            </div>
        </div>


    );

    /****************************
     * RENDERER
     ***************************/
    return (
        <MainDashboardLayout>
            <div className="">
                <div className="">
                    <div className="">
                        {successMsg && showSuccessMsg(successMsg)}
                        {errorMsg && showErrorMsg(errorMsg)}
                        {loading && <div className="">{showLoading()}</div>}
                        {showSignupForm()}
                    </div>
                </div>
            </div>
        </MainDashboardLayout>
    );
};

export default DoctorCreate;
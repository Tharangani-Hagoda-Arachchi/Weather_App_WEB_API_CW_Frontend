import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';




function Signup() {
    const [selectedOption, setSelectedOption] = useState('Guest');
    const initialValues = { name: "", email: "", password: "", Cpassword: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    


    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        const allowedTypes = ["Guest", "Admin"];

        if (selectedValue && allowedTypes.includes(selectedValue)) {
            setSelectedOption(selectedValue);
        } else {
           const typeError = "Invalid option selected!";
            // Optionally, you can display an error message or take other actions
        }

    };
    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        console.log(formValues);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        //setIsSubmit(true)

        if (Object.keys(formErrors).length === 0) {
            setIsSubmit(true)

            try {
                const response = await axios.post('http://localhost:3001/auths/signup', {

                    name: formValues.name,
                    email: formValues.email,
                    password: formValues.password,
                    type: selectedOption,


                    headers: {
                        'Content-Type': 'application/json'
                    },

                });


                if (response.status === 201) {
                    // Handle success response from backend
                    alert('Signup successful!');
                    console.log('Signup successful!');
                    setFormValues(initialValues);
                    window.location.href = '/Login';
                   
                   
                }
               
                else {
                    // Handle error response from backend
                    alert('Signup fail!');
                    console.error('Signup failed.');
                    setFormValues(initialValues);
                   
                   
                }
            } catch (error) {
                console.error('Error occurred while signing up:', error);
            }
        }
       
    };

    useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formValues);
        }

    }, [formErrors]);

    const validate = (values) => {
        const errors = {};
        const regexP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-+])[A-Za-z\d!@#$%^&*()-+]{6,}$/;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!values.name) {
            errors.name = "Username is Required"
        }
        if (!values.email) {
            errors.email = "Email is Required"
        }
        else if (!regex.test(values.email)) {
            errors.email = "This is not valid email format"
        }
        if (!values.password) {
            errors.password = "password is Required"
        }
        else if (!regexP.test(values.password)) {
            errors.password = "password must contain atleast one uppercase, lowercase, digit,speciall character and grater than 5 characters"
        }
        if (!values.Cpassword) {
            errors.Cpassword = " Confirm password is Required"
        }
        else if (values.password !== values.Cpassword) {
            errors.Cpassword = "password is not matched"
        }
        return errors;
    }
    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>SIGNUP</h1>
                <div className="ui-divider">
                    <div className="flied">
                        <lable>Enter User Name</lable>
                        <input type='text' name='name' placeholder='User Name' values={formValues.name} onChange={handleChange} />
                    </div>
                    <p>{formErrors.username}</p>
                    <div className="flied">
                        <lable>Enter Email</lable>
                        <input type='email' name='email' placeholder='Email' values={formValues.email} onChange={handleChange} />
                    </div>
                    <p>{formErrors.email}</p>
                    <div className="flied">
                        <lable>Enter Password</lable>
                        <input type='password' name='password' placeholder='Password' values={formValues.password} onChange={handleChange} />
                    </div>
                    <p>{formErrors.password}</p>
                    <div className="flied">
                        <lable>Enter Confirm Password</lable>
                        <input type='password' name='Cpassword' placeholder='CPassword' values={formValues.Cpassword} onChange={handleChange} />
                    </div>
                    <p>{formErrors.Cpassword}</p>
                    <div className="flied">
                        <label>
                            <input
                                type="radio"
                                value="Guest"
                                name='guest'
                                checked={selectedOption === "Guest"}
                                onChange={handleOptionChange}


                            />
                            Guest
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Admin"
                                name='admin'
                                checked={selectedOption === "Admin"}
                                onChange={handleOptionChange}


                            />
                            Admin
                        </label>


                    </div>
                    <button className='fluid-ui-button-blue'>Sign Up</button>
                </div>
            </form>
        </div>
    )
}

export default Signup
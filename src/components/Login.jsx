import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';


function Login() {
   
    const initialValues = {  email: "", password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    


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
                const response = await axios.post('http://localhost:3001/auths/signin', {

                    
                    email: formValues.email,
                    password: formValues.password,
                    


                    headers: {
                        'Content-Type': 'application/json'
                    },

                });


                if (response.status === 201) {
                    // Handle success response from backend
                    alert('login successful!');
                    console.log('login successful!');
                    setFormValues(initialValues);
                    window.location.href = '/map';
                   
                   
                }
               
                else {
                    // Handle error response from backend
                    alert('login fail!');
                    console.error('login failed.');
                    setFormValues(initialValues);
                   
                   
                }
            } catch (error) {
                console.error('Error occurred while login:', error);
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
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
       
        if (!values.email) {
            errors.email = "Email is Required"
        }
        else if (!regex.test(values.email)) {
            errors.email = "This is not valid email format"
        }
        if (!values.password) {
            errors.password = "password is Required"
        }
        
       
        return errors;
    }
    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>LOGIN</h1>
                <div className="ui-divider">
                    
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
                   

                   
                    <button className='fluid-ui-button-blue'>Login</button>
                    
                </div>
            </form>
        </div>
    )
}

export default Login
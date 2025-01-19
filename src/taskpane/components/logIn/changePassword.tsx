import React, { useState } from 'react';
import { Button, makeStyles } from '@fluentui/react-components';
import { Field, Formik, FormikHelpers, FormikValues } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserService } from '../../../common/services/user/user.service';
import { values } from '@fluentui/react';

// Style classes
const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        rowGap: "5px",
        marginBottom: "20px",
    },
    h2Login: {
        fontFamily: "Poppins",
        textAlign: "center",
        fontWeight: "700",
        opacity: 1,
    },
    formDiv: {
        width: "90%",
        alignItems: "center",
    },
    error: {
        color: "red",
        fontSize: "0.8rem",
        marginTop: "0.2rem",
    },
    inputcss: {
        height: "30px",
        padding: '5px',
        width: "100%", // Ensures OTP input takes full width
    }
});

const ChangePassword = () => {
    const styles = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const [otpSent, setOtpSent] = useState(false); // State to track if OTP is sent

    // Handle OTP submission
    const handleSubmit = async (values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
        setSubmitting(true);

        // Simulate OTP validation
        try {
            let request = {
                code:values.otp,
                email:location.state,
                isGuestAccount:false
            }
            await UserService.validateOtp(request).then((response) =>{
                if(response) {
                    navigate('/createPwd',{state:response.token}); // Navigate to reset password page on success
                }
            })
          
        } catch (err) {
            console.error("Error during OTP validation", err);
        } finally {
            setSubmitting(false);
        }

    };

    

    // Handle Resend OTP
    const handleResendOtp = async () => {
        setOtpSent(true);
        // Call your API to resend the OTP
        await UserService.requestOtp(location.state);
    };

    // Handle Back to Email
    const handleBackToEmail = () => {
        navigate('/signin'); // Redirect back to email screen
    };

    const initialValues = {
        otp: "", // OTP field only
    };

    const validationSchema = Yup.object().shape({
        otp: Yup.string()
            .length(5, "OTP must be exactly 5 characters.")
            .required("OTP is required."),
    });

    return (
        <>
            <div style={{ minHeight: "85vh", alignItems: "center", width: "100%", backgroundColor: "#f0f0f0", padding: "20px" }}>
                <div style={{ minHeight: "85vh", display: "flex", textAlign: "center", justifyContent: "center", height: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "center", textAlign: "left", alignItems: "center", marginBottom: "2.5rem", marginTop: "2.5rem" }}>
                        <div style={{ backgroundColor: "white", width: "400px", height: "auto", zIndex: "10", padding: '1rem' }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <h2 className={styles.h2Login}>Change Password</h2>
                                <div className={styles.formDiv}>
                                    <p>We’ve sent an email to <strong>{location.state}</strong> to confirm it’s yours. Please enter the OTP below.</p>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ handleSubmit, isValid }) => (
                                            <form noValidate id="otpForm" onSubmit={handleSubmit}>
                                                <div className={styles.root}>
                                                    <Field
                                                        type="text"
                                                        placeholder="Enter OTP"
                                                        name="otp"
                                                        className={styles.inputcss}
                                                    />
                                                    <div className={styles.error}>
                                                        {/* If OTP is invalid, error message will appear here */}
                                                    </div>
                                                </div>

                                                <Button
                                                    style={{ width: '100%', height: '40px' }}
                                                    appearance="primary"
                                                    type="submit"
                                                    disabled={!isValid} // Button is enabled only when OTP is exactly 6 characters
                                                >
                                                    Continue
                                                </Button>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                    <span>Didn't receive the OTP? </span>
                                                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleResendOtp}>
                                                        Resend
                                                    </span>
                                                </div>
                                                <div style={{ marginTop: '1rem' }}>
                                                    <span style={{ cursor: 'pointer', color: 'blue' }} onClick={handleBackToEmail}>
                                                        Back to email
                                                    </span>
                                                </div>
                                            </form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;

import React from 'react';
import { Button, makeStyles } from '@fluentui/react-components';
import { Field, Formik, FormikHelpers, FormikValues } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

// Style classes
const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        rowGap: "5px",
        marginBottom: "20px",
    },
    h2CreatePassword: {
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
        width: "100%", // Ensures input takes full width
    }
});

const CreatePassword = () => {
    const styles = useStyles();
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
        setSubmitting(true);
        console.log("New Password Submitted", values);

        // Simulate account activation with the new password
        try {
            // Simulate account activation logic
            // await UserService.activateAccount(values.password);
            console.log("Account Activated with password: ", values.password);
            navigate('/signin'); // Navigate to home or login screen on success
        } catch (err) {
            console.error("Error during account activation", err);
        } finally {
            setSubmitting(false);
        }
    };

    const initialValues = {
        password: "", // New password field
        confirmPassword: "", // Confirm password field
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, "Password must be at least 8 characters.")
            .required("Password is required."),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], "Passwords must match.")
            .required("Confirm password is required."),
    });

    return (
        <>
            <div style={{ minHeight: "85vh", alignItems: "center", width: "100%", backgroundColor: "#f0f0f0", padding: "20px" }}>
                <div style={{ minHeight: "85vh", display: "flex", textAlign: "center", justifyContent: "center", height: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "center", textAlign: "left", alignItems: "center", marginBottom: "2.5rem", marginTop: "2.5rem" }}>
                        <div style={{ backgroundColor: "white", width: "400px", height: "auto", zIndex: "10", padding: '1rem' }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <h2 className={styles.h2CreatePassword}>Create Password</h2>
                                <div className={styles.formDiv}>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ handleSubmit, isValid }) => (
                                            <form noValidate id="createPasswordForm" onSubmit={handleSubmit}>
                                                <div className={styles.root}>
                                                    <Field
                                                        type="password"
                                                        placeholder="New Password"
                                                        name="password"
                                                        className={styles.inputcss}
                                                    />
                                                    {/* {errors.password && touched.password && (
                                                        //<div className={styles.error}>{errors.password}</div>
                                                    )} */}
                                                </div>
                                                <div className={styles.root}>
                                                    <Field
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        name="confirmPassword"
                                                        className={styles.inputcss}
                                                    />
                                                    {/* {errors.confirmPassword && touched.confirmPassword && (
                                                        //<div className={styles.error}>{errors.confirmPassword}</div>
                                                    )} */}
                                                </div>

                                                <Button
                                                    style={{ width: '100%', height: '40px' }}
                                                    appearance="primary"
                                                    type="submit"
                                                    disabled={!isValid} // Button is disabled if form is invalid
                                                >
                                                    Activate Account
                                                </Button>
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

export default CreatePassword;

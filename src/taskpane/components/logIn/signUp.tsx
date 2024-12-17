import React from 'react';
import backgroundIng from "../../../../assets/login-background.png";
import { Button, makeStyles } from '@fluentui/react-components';
import * as Yup from 'yup';
import { ErrorMessage, Field, Formik, FormikHelpers, FormikValues } from 'formik';
import componyLogo from "../../../../assets/login-logo.png"
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../../common/services/user/user.service';
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
        width: "100%", // Ensures email input takes full width
    }
});

function SignUp() {
    const styles = useStyles();
    const navigate = useNavigate();

    function navigateToHome() {
        navigate('/home');
    };

    const handleSubmit = async (values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
        setSubmitting(false);
        console.log("Form submitted");
        console.log(values);
        // Call API here to handle submission

        const user:any = {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            invitationCode: values.invitationCode || "", // If invitationCode is empty, send empty string
            organizationId: "660d57f0a8040b199db16ab1", // Example organization ID, update as necessary
            role: "User", // Role can be dynamic depending on your application's requirements
            roleId: "64eb108ca7c91604f5bfebfb", // Example role ID, update as necessary
            claims: [{domainId: "DefaultDomain"}]
        };
        
        try {
            await UserService.registerUser(user);
            await UserService.requestOtp({email:values.email});
            navigate('/changePassword', {state:values.email}); // Navigate to home page after successful registration
        } catch (err) {
            console.error("Error during registration", err);
        } finally {
            setSubmitting(false); // Always stop the submitting state after the API call
        }
    };

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "", // New email field
        haveAndInvitationCode: false,
        invitationCode: "", // New field
        haveReadLiencence: false,
    };

    const navigateToSignIn = () => {
        navigate('/signin')
    }

    const userFormValidationSchema = Yup.object().shape({
        firstName: Yup.string().required("First Name is required."),
        lastName: Yup.string().required("Last Name is required."),
        email: Yup.string()
            .email("Please enter a valid email address.")
            .required("Email is required."), // Email validation
        haveAndInvitationCode: Yup.boolean(),
        invitationCode: Yup.string().when('haveAndInvitationCode', (haveAndInvitationCode, schema) => {
            return !haveAndInvitationCode
                ? schema.required("Invitation Code is required.")
                : schema.notRequired();
        }),
        haveReadLiencence: Yup.boolean().oneOf([true], "You must agree to the License Agreement."),
    });

    return (
        <>
            <div style={{ minHeight: "85vh", alignItems: "center", width: "100%", backgroundImage: "url(" + backgroundIng + ")" }}>
                <div style={{ minHeight: "85vh", display: "flex", textAlign: "center", justifyContent: "center", height: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "center", textAlign: "left", alignItems: "center", marginBottom: "2.5rem", marginTop: "2.5rem" }}>
                        <div style={{ backgroundColor: "white", width: "400px", height: "auto", zIndex: "10", padding: '1rem' }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <img style={{ width: "180px", height: "50px", marginTop: "10px" }} src={componyLogo} />
                                <h2 className={styles.h2Login}>Create an account</h2>
                                <div className={styles.formDiv}>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={userFormValidationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ handleSubmit, isValid, values }) => (
                                            <form noValidate id="aiSignInForm" onSubmit={handleSubmit}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div className={styles.root}>
                                                        <Field
                                                            type="text"
                                                            placeholder="First name"
                                                            name="firstName"
                                                            className={styles.inputcss}
                                                        />
                                                        <ErrorMessage component="div" name="firstName" className={styles.error} />
                                                    </div>

                                                    <div className={styles.root}>
                                                        <Field
                                                            type="text"
                                                            placeholder="Last name"
                                                            name="lastName"
                                                            className={styles.inputcss}
                                                        />
                                                        <ErrorMessage component="div" name="lastName" className={styles.error} />
                                                    </div>
                                                </div>

                                                <div className={styles.root}>
                                                    <Field
                                                        type="email"
                                                        placeholder="Email"
                                                        name="email"
                                                        className={styles.inputcss}
                                                    />
                                                    <ErrorMessage component="div" name="email" className={styles.error} />
                                                </div>

                                                <div className={styles.root}>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <Field type="checkbox" name="haveAndInvitationCode" />
                                                        <span style={{ marginLeft: "5px" }}>Have an invitation code?</span>
                                                    </div>
                                                    {values.haveAndInvitationCode && (
                                                        <div className={styles.root}>
                                                            <Field
                                                                type="text"
                                                                placeholder="Invitation Code"
                                                                name="invitationCode"
                                                                className={styles.inputcss}
                                                            />
                                                            <ErrorMessage component="div" name="invitationCode" className={styles.error} />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={styles.root}>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <Field type="checkbox" name="haveReadLiencence" />
                                                        <span style={{ marginLeft: "5px" }}>I have read and agree to the License Agreement*</span>
                                                    </div>
                                                    <ErrorMessage component="div" name="haveReadLiencence" className={styles.error} />
                                                </div>

                                                <Button
                                                    style={{ width: '100%', height: '40px' }}
                                                    appearance="primary"
                                                    type="submit"
                                                    name="signIn"
                                                    disabled={!isValid}
                                                >
                                                    Continue
                                                </Button>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                    <span>Already have an account ? </span>
                                                    <span style={{ color: 'blue' }} onClick={navigateToSignIn}> Sign in</span>
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
}

export default SignUp;
import React, { ReactNode } from 'react'
import backgroundIng from "../../../../assets/login-background.png"; 
import { Button, makeStyles, useId } from '@fluentui/react-components';
import * as Yup from 'yup';
import { ErrorMessage, Field, Formik, FormikHelpers, FormikValues } from 'formik';
import componyLogo from "../../../../assets/login-logo.png"

// Style classes
const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        rowGap: "5px",
        marginBottom:"25px"
      },
    h2Login:{
        fontFamily:"Poppins",
        textAlign:"center",
        fontWeight:"700",
        opacity:1,
    },
    formDiv:{
        width:"90%",
        alignItems:"center"
    },
    error:{
        color:"red",
        fontSize:"0.8rem",
        marginTop:"0.2rem"
    },
    inputcss :{
        height:"30px"
  }
});


function SignIn() {
    const styles = useStyles();

    // Handle submit button
    const handleSubmit = (values:FormikValues, {setSubmitting}:FormikHelpers<FormikValues>) => {
        setSubmitting(false);
        console.log("Form submitted");
        console.log(values);
    };

    // field Ids
    const userId = useId("input-email-login");
    const userpwd = useId("input-pwd");

    // initial values of sign in Page
    const initialValues = {
        userName:"",
        password:"",
        rememberMe:false
    };

    // set form
    const userFormValidationSchema = Yup.object().shape({
        userName:Yup.string().required("Email Address is required.").email("Invalid email"),
        password:Yup.string().required("Password is required.")
    });
  return (
   <>
          <div style={{ minHeight: "85vh", alignItems: "center",width:"100%", backgroundImage: "url(" + backgroundIng + ")" }}>
              <div style={{ minHeight: "85vh", display: "flex", textAlign: "center", justifyContent: "center", height: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "center",textAlign:"left", alignItems:"center",marginBottom:"2.5rem",marginTop:"2.5rem" }}>
                     <div style={{backgroundColor:"white", width:"400px", height:"400px",zIndex:"10"}}> 
                            <div style={{display:"flex", flexDirection:"column", alignItems:"center",justifyContent:"center"}}>
                            <img style={{width:"180px", height:"50px",marginTop:"10px"}} src={componyLogo}/>
                                <h2 className={styles.h2Login}>Sign in</h2>
                              <div className={styles.formDiv}>
                                <Formik initialValues={initialValues} validationSchema={userFormValidationSchema} onSubmit={handleSubmit}>
                                {({ handleSubmit}) => (
                                    <form noValidate id="aiSignInForm" onSubmit={handleSubmit} >
                                      <div className={styles.root}>
                                          <Field type="email" placeholder="Email Address" name='userName' id={userId}  className={styles.inputcss} />
                                          <ErrorMessage component="div" name='userName' className={styles.error}/>
                                          {/* {
                                            errors.userName && touched.userName ? (
                                                <div className={errors.userName ? styles.error:""}>{errors.userName as ReactNode}</div>
                                            ):null
                                          } */}
                                          
                                      </div>

                                      <div className={styles.root}>
                                          <Field name='password' type="password" placeholder="Password" id={userpwd} className={styles.inputcss} />
                                          <ErrorMessage component="div" name='password' className={styles.error}/>
                                      </div>

                                      <div className={styles.root}>
                                        <div style={{display:"flex"}}><Field type="checkbox" name="rememberMe"/><span style={{marginLeft:"5px"}}>Remember Me</span></div>
                                         
                                      </div>
                                        <Button style={{width:'100%'}} appearance="primary" type="submit" name="signIn"> Sign In </Button>
                                  </form>
                                )}
                                </Formik>
                                  
                              </div>
                            </div>
                            <div>
                           
                            </div>

                     </div>

                  </div>
              </div>
          </div>

   </>
  )
}

export default SignIn
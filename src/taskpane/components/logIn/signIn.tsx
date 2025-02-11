import React, { useContext, useEffect } from 'react'
import backgroundIng from "../../../../assets/login-background.png"; 
import { Button, makeStyles, useId } from '@fluentui/react-components';
import * as Yup from 'yup';
import { ErrorMessage, Field, FormikProvider, useFormik} from 'formik';
import componyLogo from "../../../../assets/guardrail-ai.png"
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../../../common/services/user/models/userLogin';
import { UserService } from '../../../common/services/user/user.service';
import { useToaster } from '../../../hooks/useToast';
import { AuthContext } from '../../../context/authContext';

// Style classes
const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        rowGap: "5px",
        marginBottom:"25px"
      },
    h2Login:{
        fontFamily:"sans-serif",
        textAlign:"center",
        fontWeight:"700",
        opacity:1,
        marginTop:"3rem"
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
      const toaster = useToaster();
      const navigate = useNavigate();
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      // set form
      const userFormValidationSchema = Yup.object().shape({
        userName: Yup.string().required("Email Address is mandatory.").email("Please enter a valid email address.").matches(regex,"Email Address must be in the format: test@example.com"),
        password: Yup.string().required("Password is mandatory.")
      });

      // initial values of sign in Page
      const initialValues = {
        userName: "",
        password: "",
        rememberMe: false
      };

        const handleSubmit = (values:any) => {
          // call API here to get token and store in session.
          const login = new userLogin();
          login.username = values.userName;
          login.password = values.password;

          UserService.logIn(login).then(res => {
            if (res.accessToken) {
              window.localStorage.setItem("userId", res.userId);
              userContext.setAuthenticated(res.accessToken);
              userContext.setSubscriptionPlan();
              toaster.success("logged in successfully.");
              navigateToHome();
            }
          }, (error => {
            toaster.error(error.message ? error.message : "Unable to login application.");
          }));
        }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userFormValidationSchema,
    onSubmit: (values) => handleSubmit(values)});

  function navigateToHome() {
    navigate('/home');
  };

  const userContext = useContext(AuthContext);

  useEffect(() => {
    const isUserAuthenticated = window.localStorage.getItem("LoggedIn");
    if (isUserAuthenticated != undefined
      && isUserAuthenticated != ''
      && isUserAuthenticated != null
      && isUserAuthenticated === 'true') {
      navigate('/home');
    }
  }, []);

  // field Ids
  const userId = useId("input-email-login");
  const userpwd = useId("input-pwd");

  return (
    <FormikProvider value={formik}>
      <div style={{ minHeight: "100vh", alignItems: "center", width: "100%", backgroundImage: "url(" + backgroundIng + ")" }}>
        <div style={{ minHeight: "85vh",textAlign: "center", justifyContent: "center", height: "auto" }}>
          <div style={{ display: "flex", justifyContent: "center", textAlign: "left", alignItems: "center", }}>
            <div style={{ backgroundColor: "white", width: "400px", height: "400px", zIndex: "10", marginBottom: "2.5rem", marginTop: "2.8rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <img style={{ width: "180px", height: "50px", marginTop: "30px" }} src={componyLogo} />
                <h2 className={styles.h2Login}>Sign in</h2>
                <div className={styles.formDiv}>
                  <form noValidate id="aiSignInForm" onSubmit={formik.handleSubmit} >
                    <div className={styles.root}>
                      <Field type="email" placeholder="Email Address" name='userName' id={userId} value={formik.values.userName} className={styles.inputcss} />
                      <ErrorMessage component="div" name='userName' className={styles.error} />
                    </div>

                    <div className={styles.root}>
                      <Field name='password' type="password" placeholder="Password" id={userpwd} value={formik.values.password} className={styles.inputcss} />
                      <ErrorMessage component="div" name='password' className={styles.error} />
                    </div>

                    <Button style={{ width: '100%' }} appearance="primary" type="submit" name="signIn"> Sign In </Button>
                  </form>
                </div>
              </div>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </FormikProvider>
  )
}

export default SignIn
import * as React from "react";
import HomePage from "./InitialPage/HomePage";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import InformationPage from "./InitialPage/Info";
import Header from "./Header";

// Dynamically import all components with React.lazy


const OptimizedPromts = React.lazy(() => import("./Prompt-optimizer/OptimizedPrompt"));
const ProtectedRoute = React.lazy(() => import("../../route/ProtectedRoute"));
const SignIn = React.lazy(() => import("./logIn/signIn"));
const LogIn = React.lazy(() => import("./logIn/logIn"));
const PageNotFound = React.lazy(() => import("./notFound/PageNotFound"));
const SignUp = React.lazy(() => import("./logIn/signUp"));
const ChangePassword = React.lazy(() => import("./logIn/changePassword"));
const CreatePassword = React.lazy(() => import("./logIn/createPassword"));


interface AppProps {
  title: string;
}

const App = (props: AppProps) => {

  const router = createHashRouter([
    {
      path: '/',
      element: (
        <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
          <LogIn />
        </React.Suspense>
      ),
    },
    {
      path: '/login',
      element: (
        <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
          <LogIn />
        </React.Suspense>
      ),
    },
    {
      path: "/signin",
      element: (
        <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
          <SignIn />
        </React.Suspense>
      ),
    },
    {
      path: '/signup',
      element: (
        <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
          <SignUp />
        </React.Suspense>
      ),
    },
    {
      path:'/changePassword',
      element:<ChangePassword/>
    },
    {
      path:'/createPwd',
      element:<CreatePassword/>
    },
    {
      path: '/',
      element: (
        <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
          <ProtectedRoute />
        </React.Suspense>),
      children: [
        {
          path: '/home',
          element: (
            <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
              <HomePage />
            </React.Suspense>
          ),
        },
        {
          path: '/optimized-prompt',
          element: (
            <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
              <OptimizedPromts />
            </React.Suspense>
          ),
        },
        {
          path: "/information",
          element: (
            <>
             {/* <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}> */}
              <Header logo="assets/logo-filled.png" title={props.title} message="Guardrail-Better AI" />
              <InformationPage />
             {/* </React.Suspense> */}
            </>
          ),
        }
      ]
    },
    {
      path: '*',
      element: <PageNotFound />
    }
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default App;

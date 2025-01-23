import * as React from "react";
import HomePage from "./InitialPage/HomePage";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import InformationPage from "./InitialPage/Info";
import Header from "./Header";
import PromptProtect from "./InitialPage/PromptProtect";
import PatternMgmt from "./PatternManagement/PatternMgmt";
import EditPattern from "./PatternManagement/EditPattern";

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
      path: '/changePassword',
      element: <ChangePassword />
    },
    {
      path: '/createPwd',
      element: <CreatePassword />
    },
    {
      path: '/',
      element: (
        <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
          <ProtectedRoute />
        </React.Suspense>),
      children: [
        {
          path: '/patterns-management',
          element: (
            <> <Header logo="assets/logo-filled.png" title={props.title} message="Guardrail-Better AI" ShowMenu={["NewPrompt"]} />
              <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
                <PatternMgmt />
              </React.Suspense>
            </>
          )
        },
        {
          path: '/patterns-management/edit-pattern/:id',
          element: (
            <> <Header logo="assets/logo-filled.png" title={props.title} message="Guardrail-Better AI" ShowMenu={["NewPrompt"]} />
              <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
                <EditPattern />
              </React.Suspense>
            </>
          )
        },
        {
          path: '/patterns-management/add-pattern',
          element: (
            <> <Header logo="assets/logo-filled.png" title={props.title} message="Guardrail-Better AI" ShowMenu={["NewPrompt"]} />
              <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
                <EditPattern />
              </React.Suspense>
            </>
          )
        },
        {
          path: '/home',
          element: (
            <>
              <Header logo="assets/logo-filled.png" title={props.title} message="Guardrail-Better AI" ShowMenu={["PattenMgmt"]} />
              <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
                <HomePage />
              </React.Suspense>
            </>
          ),
        },
        {
          path: '/optimized-prompt',
          element: (
            <>
              <Header logo="assets/logo-filled.png" title={props.title} message="Guardrail-Better AI" ShowMenu={["PattenMgmt"]} />
              <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
                <OptimizedPromts />
              </React.Suspense>
            </>
          ),
        },
        {
          path: "/information",
          element: (
            <>
              {/* <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}> */}
              <Header logo="assets/logo-filled.png" title={props.title} message="Guardrail-Better AI" ShowMenu={["PattenMgmt", , "NewPrompt", "ReGenerate"]} />
              <InformationPage />
              {/* </React.Suspense> */}
            </>
          ),
        },
        {
          path: '/prompt-protect',
          element: (
            <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
              <PromptProtect />
            </React.Suspense>
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
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;

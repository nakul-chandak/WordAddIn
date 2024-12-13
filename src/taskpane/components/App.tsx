import * as React from "react";
import HomePage from "./InitialPage/HomePage";
import { createHashRouter, RouterProvider } from "react-router-dom";
const InformationPage = React.lazy(() => import("./InitialPage/Info"));
const Header = React.lazy(() => import("./Header"));
const OptimizedPromts = React.lazy(() => import("./Prompt-optimizer/OptimizedPrompt"));
const ProtectedRoute = React.lazy(() => import("../../route/ProtectedRoute"));
const SignIn = React.lazy(() => import("./login/signIn"));
const LogIn = React.lazy(() => import("./login/logIn"));
const PageNotFound = React.lazy(() => import("./notFound/PageNotFound"));
const SignUp = React.lazy(() => import("./login/signUp"));
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

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
            <React.Suspense fallback={<div><Spinner style={{ position: "fixed", top: "50%", left: "50%" }} size={SpinnerSize.large} /></div>}>
              <Header logo="assets/logo-filled.png" title={props.title} message="Guardrail-Better AI" />
              <InformationPage />
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
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default App;

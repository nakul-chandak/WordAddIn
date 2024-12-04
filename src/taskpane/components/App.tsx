import * as React from "react";
import HomePage from "./InitialPage/HomePage";
import { createHashRouter, RouterProvider } from "react-router-dom";
import InformationPage from "./InitialPage/Info";
import Header from "./Header";
import OptimizedPromts from "./Prompt-optimizer/OptimizedPrompt";
import ProtectedRoute from "../../route/ProtectedRoute";
import LogIn from "./login/logIn";
import SignIn from "./login/signIn";
import PageNotFound from "./notFound/PageNotFound";

interface AppProps {
  title: string;
}

const App = (props: AppProps) => {
  
  const router = createHashRouter([
    {
      path: '/',
      element: <LogIn />
    },
    {
      path: '/login',
      element: <LogIn />
    },
    {
      path: "/signin",
      element: <SignIn />
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/home',
          element: <HomePage />,
        },
        {
          path: '/optimized-prompt',
          element: <OptimizedPromts />
        },
        {
          path: "/information",
          element: (
            <React.Suspense fallback={<div>Loading...</div>}>
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

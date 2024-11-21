import * as React from "react";
import HeroList, { HeroListItem } from "./HeroList";
import { makeStyles } from "@fluentui/react-components";
import {
  DocumentBulletList20Regular,
  Document10020Regular,
  DocumentContract16Regular,
  DocumentLightning20Regular,
} from "@fluentui/react-icons";


import HomePage from "./InitialPage/HomePage";
import { createHashRouter, RouterProvider, useNavigate } from "react-router-dom";
import InformationPage from "./InitialPage/Info";
import Header from "./Header";
const ChatUI = React.lazy(() => import('./Chat'));
const OnboardingForm = React.lazy(() => import('./OnboardingForm'));
const FlyoutMenu = React.lazy(() => import('./FlyoutMenu'));

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    overflowY: 'auto',
  },
  backButton: {
    top: "10px",
    right: "40px",
    position: "absolute",
  },
  headerBar: {
    height: "50px",
    background: "white",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#8647D6",
    color: "white",
    fontSize: "16px",
    marginRight: "10px",
  },
  bottomPortion: {
    height: '365px',
    background: 'rgb(247,247,247)'
  },
  checkboxContainer: {
    display: "flex",
    justifyContent: "center",
    flexGrow: '1',
    height: "100px",
    padding: "10px",
    position: 'relative',
    bottom: '2rem',
  },
  checkboxWrapper: {
    display: "flex",
    alignItems: "center",
  },
  checkboxLabel: {
    marginLeft: "5px",
    fontSize: "14px",
  },
  textareaWrapper: {
    marginTop: "10px",
  },
  navBar: {
    backgroundColor: "#f3f3f3",
    padding: "10px",
    display: "flex",
    justifyContent: "space-around",
  },
  navLink: {
    textDecoration: "none",
    color: "#000",
    fontSize: "18px",
    fontWeight: "bold",
  },
});

const logoArray = [
  { label: "Guardrail", id: "guardrail" },
  { label: "OpenAI", id: "openai" },
  { label: "Copilot", id: "copilot" },
  { label: "Gemini", id: "copilot" },
];

const App = (props: AppProps) => {
  const styles = useStyles();
  console.log(props.title);
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>("FactCheck");
  const [previousComponents, setPreviousComponents] = React.useState<string[]>([]);
  const [newContentAdded, setNewContentAdded] = React.useState(false);

  const handleContentChange = () => {
    // Set the flag to true to trigger auto-scrolling in the parent window
    setNewContentAdded(true);
  };

  const listItems: HeroListItem[] = [
    {
      icon: <Document10020Regular />,
      primaryText: "What is the original source ?",
    },
    {
      icon: <DocumentBulletList20Regular />,
      primaryText: "Is it a source you trust ?",
    },
    {
      icon: <DocumentContract16Regular />,
      primaryText: "Is There harmful or risky content ?",
    },
    {
      icon: <DocumentLightning20Regular />,
      primaryText: "Can you assume responsibility for the content ?",
    }
  ];

  const handleMenuItemClick = (menuItem: string) => {
    console.log(`menuItem:${menuItem},selectedComponent ${selectedComponent}`);
    if (selectedComponent == undefined || menuItem == selectedComponent) return;
    setPreviousComponents((prev) => [...prev, selectedComponent || ""]);
    setSelectedComponent(menuItem);
  };

  const handleBackButtonClick = () => {
    const previousComponent = previousComponents.pop();
    setSelectedComponent(previousComponent || null);
    setPreviousComponents([...previousComponents]);
  };

  const GetChatWindow = () => {
    return (
      <div >
        <HeroList message="Would you like to take control of AI Generated Content!" items={listItems} />
        <React.Suspense fallback={<div>Loading...</div>}>
          <ChatUI onContentChange={handleContentChange} />
        </React.Suspense>
        {/* <ChatUI onContentChange={handleContentChange}/> */}
      </div>
    );
  };
  // const handleSaveSecrets = (secret: Secret) => {
  //   console.log("Secrets:", secret);
  // };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "FactCheck":
        return GetChatWindow();
      case "Onboarding":
        return (<React.Suspense fallback={<div>Loading...</div>}>
          <OnboardingForm />
        </React.Suspense>)
      default:
        return GetChatWindow();
    }
  };
  
  const router = createHashRouter([
    {
      path: "/",
      element: <HomePage />,
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
  ]);

  return (
    // <div className={styles.root}>
    //   <HomePage />
    // </div>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>

  );

};

export default App;

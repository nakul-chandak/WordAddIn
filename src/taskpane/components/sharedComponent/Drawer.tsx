import {Button, Divider, Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle,makeStyles,useRestoreFocusSource } from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons';
import React, { useContext } from 'react'
import { AppContext } from '../../../context/appContext';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
      border: "2px solid #ccc",
      overflow: "hidden",
      display: "flex",
      backgroundColor: "#F6F6F6",
    },
      icon: {
        marginRight: "5px",
        marginLeft: "5px",
        marginTop: "5px",
      },
    });
    
const AppDrawer:React.FC<any>=(props:any) => {
    const styles = useStyles();
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
     
     function handlePatternMgmtClick() {
        navigate('/patterns-management');
        appContext.drawerAction(false);
      }
          
      function handleClick() {
        navigate('/');
        appContext.drawerAction(false);
      }

      function logoff() {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("LoggedIn");
        appContext.drawerAction(false);
        navigate('/login')
      }
      

  const restoreFocusSourceAttributes = useRestoreFocusSource();
  return (
      <div>
          <Drawer
              className={styles.root}
              {...restoreFocusSourceAttributes}
              type="overlay"
              separator
              open={appContext.isDrawerOpen}
              position="end"
              onOpenChange={(_, { open }) => appContext.drawerAction(open)}
          >
              <DrawerHeader>
                  <DrawerHeaderTitle
                      action={
                          <Button
                              appearance="subtle"
                              aria-label="Close"
                              icon={<Dismiss24Regular />}
                              onClick={() => appContext.drawerAction(false)}
                          />
                      }
                  >
                      Menus
                  </DrawerHeaderTitle>
              </DrawerHeader>

              <DrawerBody>
                  <ul style={{ color: 'black', listStyleType: 'none', display: "inline-block" }}>
                      <li style={{ color: 'black', cursor: 'pointer' }} className={styles.icon} onClick={handlePatternMgmtClick}>
                          <span style={{ fontSize: "20px" }}>Pattern Management</span>
                      </li>
                      <Divider />
                      {props.ShowMenu.indexOf("NewPrompt") > -1 ? (<><li style={{ color: 'black', cursor: 'pointer' }} className={styles.icon} onClick={handleClick}>
                          <span style={{ fontSize: "20px" }}>New Prompt</span>
                      </li> <Divider />  </>) : null}
                      {props.ShowMenu.indexOf("LogOut") > -1 ? (<><li style={{ color: 'black', cursor: 'pointer' }} className={styles.icon} onClick={logoff}>
                          <span style={{ fontSize: "20px" }}>Log Off</span>
                      </li>  </>) : null}
                  </ul>
              </DrawerBody>
          </Drawer>
      </div>
  )
}

export default AppDrawer
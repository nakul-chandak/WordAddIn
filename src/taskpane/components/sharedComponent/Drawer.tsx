import {Divider, Drawer, DrawerBody,makeStyles,useRestoreFocusSource } from '@fluentui/react-components'
import { ArrowCircleRight24Regular, SignOut24Regular, TextExpand24Regular } from '@fluentui/react-icons';
import React, { useContext } from 'react'
import { AppContext } from '../../../context/appContext';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
      border: "2px solid #ccc",
      overflow: "hidden",
      display: "flex",
      maxWidth:"60vw"
    },
      icon: {
        marginRight: "5px",
        marginLeft: "5px"
      },

      ulStyle : {
        width:"100%",
        paddingLeft:"0px",
        fontWeight:"normal"
      },
      liStyle:{
        padding:".5rem .5rem .5rem 0",
        "&:hover": {backgroundColor:"#E7EDF8"}
      },
      liAStyle:{
        display:"flex",
        alignItems:"center",
        color: 'black',
        cursor: 'pointer'
      },
      drawerBodyStyle:{
        paddingLeft:"5px",
        paddingRight:"5px"
      },
      logoStyle:{
        marginTop:"5px"
      },
      logoSingOut:{
        width:"28px",
        height:"28px",
        margin:"5px -5px 0px 2px"
      }
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
              <DrawerBody className={styles.drawerBodyStyle}>
                  <ul className={styles.ulStyle} style={{ color: 'black', listStyleType: 'none', display: "inline-block" }}>
                      <li className={`${styles.icon} ${styles.liStyle}`} onClick={handlePatternMgmtClick}>
                          <a className={styles.liAStyle}>
                              <TextExpand24Regular className={styles.logoStyle} />
                              <span style={{ fontSize: "15px", marginLeft:"10px" }}>Pattern Management</span>
                          </a>
                      </li>
                      {props.ShowMenu.indexOf("NewPrompt") > -1 ? (<><li className={`${styles.icon} ${styles.liStyle}`} onClick={handleClick}>
                          <a className={styles.liAStyle}>
                              <ArrowCircleRight24Regular className={styles.logoStyle} />
                              <span style={{ fontSize: "15px" , marginLeft:"10px" }}>New Prompt</span>
                          </a>
                      </li></>) : null}
                      {props.ShowMenu.indexOf("LogOut") > -1 ? (<><li className={`${styles.icon} ${styles.liStyle}`} onClick={logoff}>
                          <a className={styles.liAStyle}>
                              <SignOut24Regular className={styles.logoSingOut} />
                              <span style={{ fontSize: "15px" , marginLeft:"10px" }}>Log Off</span>
                          </a>
                      </li>  </>) : null
                      }
                      <Divider /> 
                  </ul>
              </DrawerBody>
          </Drawer>
      </div>
  )
}

export default AppDrawer
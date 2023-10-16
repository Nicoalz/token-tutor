import React, { useState, useEffect, useContext } from "react";

import { Client, useClient } from "@xmtp/react-sdk";
import { ConversationContainer } from "./ConversationContainer";
import { Signer } from "ethers";
import { getEnv, storeKeys, loadKeys, wipeKeys } from "@/lib/xmtp";
import { Web3Context } from "./web3-provider";
import { Button } from "./ui/button";
export default function XMTPDemo({ isPWA = false }: { isPWA?: boolean }) {
  const { signer: wallet } = useContext(Web3Context);
  const isBrowser = typeof window !== "undefined";

  const initialIsOpen = isBrowser
    ? localStorage.getItem("isWidgetOpen") === "true" || false
    : false;
  const initialIsOnNetwork = isBrowser
    ? localStorage.getItem("isOnNetwork") === "true" || false
    : false;
  const initialIsConnected = isBrowser
    ? (localStorage.getItem("isConnected") && wallet) || false
    : false;

  const { client, error, isLoading, initialize } = useClient();
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [isOnNetwork, setIsOnNetwork] = useState(initialIsOnNetwork);
  const [isConnected, setIsConnected] = useState(initialIsConnected);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [signer, setSigner] = useState(undefined as Signer | any);

  const styles = {
    floatingLogo: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      border: "1px solid #ccc",
      justifyContent: "center",
      boxShadow: "0 2px 10px #ccc",
      cursor: "pointer",
      transition: "transform 0.3s ease",
      padding: "5px",
    },
    uContainer: {
      position: isPWA == true ? "relative" : "fixed",
      bottom: isPWA == true ? "0px" : "70px",
      right: isPWA == true ? "0px" : "20px",
      width: isPWA == true ? "100%" : "300px",
      height: isPWA == true ? "100vh" : "400px",
      backgroundColor: "#181C2A",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      zIndex: "1000",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    logoutBtn: {
      position: "absolute",
      top: "10px",
      left: "15px",
      background: "transparent",
      border: "none",
      fontSize: isPWA == true ? "20px" : "10px",
      cursor: "pointer",
    },
    widgetHeader: {
      padding: "5px",
    },
    conversationHeader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "none",
      border: "none",
      width: "auto",
      margin: "0px",
    },
    conversationHeaderH4: {
      margin: "0px",
      padding: "4px",
      fontSize: isPWA == true ? "20px" : "14px", // Increased font size
    },
    backButton: {
      border: "0px",
      background: "transparent",
      cursor: "pointer",
      fontSize: isPWA == true ? "20px" : "14px", // Increased font size
    },
    widgetContent: {
      flexGrow: 1,
      overflowY: "auto",
    },
    xmtpContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    btnXmtp: {
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      color: "#000",
      justifyContent: "center",
      border: "1px solid grey",
      padding: isPWA == true ? "20px" : "10px",
      borderRadius: "5px",
    },
    widgetFooter: {
      padding: "5px",
      fontSize: isPWA == true ? "20px" : "12px",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    powered: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  useEffect(() => {
    localStorage.setItem("isOnNetwork", isOnNetwork.toString());
    localStorage.setItem("isWidgetOpen", isOpen.toString());
    localStorage.setItem("isConnected", isConnected.toString());
  }, [isOpen, isConnected, isOnNetwork]);

  useEffect(() => {
    if (wallet) {
      setSigner(wallet);
      setIsConnected(true);
    }
    if (client && !isOnNetwork) {
      setIsOnNetwork(true);
    }
    if (signer && isOnNetwork) {
      initXmtpWithKeys();
    }
  }, [wallet, signer, client]);

  const getAddress = async (signer: Signer | undefined) => {
    try {
      return await signer?.getAddress();
    } catch (e) {
      console.log(e);
      console.log("entra3");
    }
  };

  //Initialize XMTP
  const initXmtpWithKeys = async () => {
    console.log("entra2");
    if (!signer) return;
    console.log("entra");
    const address = await getAddress(signer);
    console.log({ address });
    let keys = loadKeys(address);
    if (!keys) {
      keys = (await Client.getKeys(signer, {
        env: "production",
        skipContactPublishing: true,
        persistConversations: false,
      })) as any;
      storeKeys(address, keys);
    }
    console.log({ keys });
    if (!keys) return;
    setLoading(true);
    try {
      await initialize({
        keys,
        options: {
          env: "production",
        },
        signer,
      });
    } catch (e) {
      console.log(e);
    }
    console.log("entra4");
  };

  const openWidget = () => {
    setIsOpen(true);
  };

  const closeWidget = () => {
    setIsOpen(false);
  };
  if (typeof window !== "undefined") {
    (window as any).FloatingInbox = {
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  }
  const handleLogout = async () => {
    setIsConnected(false);
    const address = await getAddress(signer);
    wipeKeys(address);
    setIsOnNetwork(false);
    setSigner(undefined);
    setSelectedConversation(null);
    localStorage.removeItem("isOnNetwork");
    localStorage.removeItem("isConnected");
  };

  return (
    <>
      {!isPWA && (
        <div
          style={styles.floatingLogo as React.CSSProperties}
          onClick={isOpen ? closeWidget : openWidget}
          className={
            "FloatingInbox " +
            (isOpen ? "spin-clockwise" : "spin-counter-clockwise")
          }
        >
          <SVGLogo
            parentClass={"FloatingInbox"}
            size={undefined}
            theme={undefined}
          />
        </div>
      )}
      {isOpen && (
        <div
          style={styles.uContainer as React.CSSProperties}
          className={"FloatingInbox" + (isOnNetwork ? "expanded" : "")}
        >
          {isConnected && (
            <button
              style={styles.logoutBtn as React.CSSProperties}
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          {isConnected && isOnNetwork && (
            <div style={styles.widgetHeader}>
              <div style={styles.conversationHeader}>
                {isOnNetwork && selectedConversation && (
                  <button
                    style={styles.backButton}
                    onClick={() => {
                      setSelectedConversation(null);
                    }}
                  >
                    ←
                  </button>
                )}
                <h4 style={styles.conversationHeaderH4}>Conversations</h4>
              </div>
            </div>
          )}
          <div style={styles.widgetContent as React.CSSProperties}>
            {!isConnected && (
              <div style={styles.xmtpContainer}>
                {/* <button style={styles.btnXmtp} onClick={connectWallet}>
                  Connect Wallet
                </button> */}
                <p>Connect Wallet first</p>
              </div>
            )}
            {isConnected && !isOnNetwork && (
              <div style={styles.xmtpContainer}>
                <Button variant={"secondary"} onClick={initXmtpWithKeys}>
                  Connect to XMTP
                </Button>
              </div>
            )}
            {isConnected && isOnNetwork && client && (
              <ConversationContainer
                isPWA={isPWA}
                client={client}
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
              />
            )}
          </div>
          <div style={styles.widgetFooter as React.CSSProperties}>
            <span className="powered" style={styles.powered}>
              Powered by{" "}
              <SVGLogo
                parentClass="powered"
                size={undefined}
                theme={undefined}
              />{" "}
              XMTP
            </span>
          </div>
        </div>
      )}
    </>
  );
}

function SVGLogo({
  parentClass,
  size,
  theme,
}: {
  parentClass: string;
  size: any;
  theme: any;
}) {
  const color =
    theme === "dark" ? "#fc4f37" : theme === "light" ? "#fc4f37" : "#fc4f37";

  const hoverColor =
    theme === "dark" ? "#fff" : theme === "light" ? "#000" : "#000";

  const uniqueClassLogo = `logo-${Math.random().toString(36).substr(2, 9)}`;

  const logoStyles = {
    container: {
      width: "100%",
    },
    logo: `
        .${uniqueClassLogo} {
          transition: transform 0.5s ease;
        }
        .powered .logo{
          width:12px !important;
          margin-left:2px;
          margin-right:2px;
        }
        .${parentClass}:hover .${uniqueClassLogo} {
          transform: rotate(360deg);
        }
  
        .${parentClass}:hover .${uniqueClassLogo} path {
          fill: ${hoverColor};
        }
      `,
  };

  return (
    <>
      <style>{logoStyles.logo}</style>
      <svg
        className={"logo " + uniqueClassLogo}
        style={logoStyles.container}
        viewBox="0 0 462 462"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={color}
          d="M1 231C1 103.422 104.422 0 232 0C359.495 0 458 101.5 461 230C461 271 447 305.5 412 338C382.424 365.464 332 369.5 295.003 349C268.597 333.767 248.246 301.326 231 277.5L199 326.5H130L195 229.997L132 135H203L231.5 184L259.5 135H331L266 230C266 230 297 277.5 314 296C331 314.5 362 315 382 295C403.989 273.011 408.912 255.502 409 230C409.343 131.294 330.941 52 232 52C133.141 52 53 132.141 53 231C53 329.859 133.141 410 232 410C245.674 410 258.781 408.851 271.5 406L283.5 456.5C265.401 460.558 249.778 462 232 462C104.422 462 1 358.578 1 231Z"
        />
      </svg>
    </>
  );
}

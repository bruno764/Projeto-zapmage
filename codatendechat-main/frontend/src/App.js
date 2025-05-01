// src/App.js
import React, { useState, useEffect, useMemo } from "react";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { enUS, ptBR, esES } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

import ColorModeContext from "./layout/themeContext";
import { SocketManager } from "./context/Socket/SocketContext";

import Routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
  const [locale, setLocale] = useState();

  // detecta preferência de tema do sistema ou salva em localStorage
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const preferredTheme = window.localStorage.getItem("preferredTheme");
  const [mode, setMode] = useState(
    preferredTheme
      ? preferredTheme
      : prefersDarkMode
      ? "dark"
      : "light"
  );

  // contexto para alternar manualmente o tema
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      }
    }),
    []
  );

  // cria o tema Material-UI com suas cores e estilos de scrollbar
  const theme = createTheme(
    {
      scrollbarStyles: {
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px"
        },
        "&::-webkit-scrollbar-thumb": {
          boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
          backgroundColor: "#682EE3"
        }
      },
      scrollbarStylesSoft: {
        "&::-webkit-scrollbar": {
          width: "8px"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: mode === "light" ? "#F3F3F3" : "#333333"
        }
      },
      palette: {
        type: mode,
        primary: { main: mode === "light" ? "#682EE3" : "#FFFFFF" },
        textPrimary: mode === "light" ? "#682EE3" : "#FFFFFF",
        borderPrimary: mode === "light" ? "#682EE3" : "#FFFFFF",
        dark: { main: mode === "light" ? "#333333" : "#F3F3F3" },
        light: { main: mode === "light" ? "#F3F3F3" : "#333333" },
        tabHeaderBackground: mode === "light" ? "#EEE" : "#666",
        optionsBackground: mode === "light" ? "#fafafa" : "#333",
        options: mode === "light" ? "#fafafa" : "#666",
        fontecor: mode === "light" ? "#128c7e" : "#fff",
        fancyBackground: mode === "light" ? "#fafafa" : "#333",
        bordabox: mode === "light" ? "#eee" : "#333",
        newmessagebox: mode === "light" ? "#eee" : "#333",
        inputdigita: mode === "light" ? "#fff" : "#666",
        contactdrawer: mode === "light" ? "#fff" : "#666",
        announcements: mode === "light" ? "#ededed" : "#333",
        login: mode === "light" ? "#fff" : "#1C1C1C",
        announcementspopover: mode === "light" ? "#fff" : "#666",
        chatlist: mode === "light" ? "#eee" : "#666",
        boxlist: mode === "light" ? "#ededed" : "#666",
        boxchatlist: mode === "light" ? "#ededed" : "#333",
        total: mode === "light" ? "#fff" : "#222",
        messageIcons: mode === "light" ? "grey" : "#F3F3F3",
        inputBackground: mode === "light" ? "#FFFFFF" : "#333",
        barraSuperior:
          mode === "light"
            ? "linear-gradient(to right, #682EE3, #682EE3 , #682EE3)"
            : "#666",
        boxticket: mode === "light" ? "#EEE" : "#666",
        campaigntab: mode === "light" ? "#ededed" : "#666",
        mediainput: mode === "light" ? "#ededed" : "#1c1c1c"
      },
      mode
    },
    locale
  );

  // configura locale de datas e textos
  useEffect(() => {
    const lng = localStorage.getItem("i18nextLng")?.substring(0, 2) ?? "pt";
    if (lng === "pt") setLocale(ptBR);
    else if (lng === "en") setLocale(enUS);
    else if (lng === "es") setLocale(esES);
  }, []);

  // persiste escolha de tema
  useEffect(() => {
    window.localStorage.setItem("preferredTheme", mode);
  }, [mode]);

  return (
    <ColorModeContext.Provider value={{ colorMode }}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <SocketManager>
            <Routes />
          </SocketManager>
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;

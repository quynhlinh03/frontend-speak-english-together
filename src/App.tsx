import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useEffect } from "react";
import { useState } from "react";

export default function App() {
  // Create a client
  const queryClient = new QueryClient();
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
            colors: {
              flashWhite: ["#F0F0F0"],
              brightGray: ["#EBF2F2"],
              munsellBlue: ["#0093AF"],
              cobaltBlue: ["#00439C"],
              grayWhite: ["#F6F6F6"],
              pinkWhite: ["#FDF0F0"],
              pinkPastel: ["#F1B4BB"],
              navyBlur: ["#1F4172"],
              navyBlurLight: ["rgba(31, 65, 114, 0.1)"],
              orange: ["#fc6736"],
              orangeLight: ["rgba(252, 103, 54, 0.1)"],
              milkWhite: ["#FEFAF6"],
              pinkDark: ["#F582A7"],
              pinkDarkLight: ["rgba(245, 130, 167, 0.1)"],
              grey: ["#AAAAAA"],
              yellowBrown: ["rgb(255, 196, 112)"],
            },
            fontFamily: "Be Vietnam Pro, sans-serif",
          }}
        >
          <ModalsProvider>
            <Notifications position="top-right" zIndex={2077} />
            <RouterProvider router={router} />
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </ColorSchemeProvider>
  );
}

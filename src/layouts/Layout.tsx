import { AppShell, useMantineTheme } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar/Navbar";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { LOGIN } from "../constants/routes";
import Aside from "./Aside.tsx/Aside";
import useUserProfile from "../hooks/useUserProfile";

const Layout: React.FC = () => {
  const theme = useMantineTheme();

  const { isAuthenticated, logout, getTokenDuration } = useAuth();
  const { fetchUserProfile } = useUserProfile();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
      navigate("/live");
    } else {
      const tokenDuration = getTokenDuration();
      const logoutTimeout = setTimeout(() => {
        logout();
        navigate(LOGIN);
      }, tokenDuration);
      return () => {
        clearTimeout(logoutTimeout);
      };
    }
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated && (
        <AppShell
          styles={{
            main: {
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          }}
          navbarOffsetBreakpoint="xl"
          asideOffsetBreakpoint="xl"
          aside={<Aside />}
          navbar={<Navbar />}
          header={<Header />}
          padding="xl"
          className="body"
        >
          <div style={{height: "100%"}} className="content">
            <Outlet></Outlet>
          </div>
        </AppShell>
      )}
    </>
  );
};
export default Layout;

import { AppShell, useMantineTheme } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { LOGIN } from "../constants/routes";

const Layout: React.FC = () => {
  const theme = useMantineTheme();

  const { isAuthenticated, logout, getTokenDuration } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
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
          // header={<Header />}
          padding="xl"
          className="body"
        >
          <div className="content">
            <Outlet></Outlet>
          </div>
        </AppShell>
      )}
    </>
  );
};
export default Layout;

import { Tabs, TabsProps, rem } from "@mantine/core";

export function StyledTabs(props: TabsProps) {
  return (
    <Tabs
      unstyled
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[0]
              : theme.colors.gray[9],
          border: `${rem(0)} solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4]
          }`,
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          margin: "0.2rem",
          cursor: "pointer",
          fontSize: theme.fontSizes.sm,
          fontFamily: theme.fontFamily,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",

          "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },

          "&:not(:first-of-type)": {
            borderLeft: 0,
          },

          "&:first-of-type": {
            borderRadius: "1.5rem",
          },

          "&:last-of-type": {
            borderRadius: "1.5rem",
          },

          "&[data-active]": {
            backgroundColor: theme.colors.blue[7],
            borderColor: theme.colors.blue[7],
            color: theme.white,
          },
        },

        tabIcon: {
          marginRight: theme.spacing.xs,
          display: "flex",
          alignItems: "center",
        },

        tabsList: {
          display: "flex",
        },
      })}
      {...props}
    />
  );
}

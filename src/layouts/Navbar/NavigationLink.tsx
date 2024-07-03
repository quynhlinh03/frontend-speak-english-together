import { NavLink as RouterNavLink } from "react-router-dom";
import { Collapse, NavLink } from "@mantine/core";
import { Option } from "./Options";
import { isEmpty } from "lodash";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";

export default function NavigationLink({ icon, label, url, links }: Option) {
  const [opened, setOpened] = useState(true);
  const items = links.map((link) => (
    <RouterNavLink to={link.url} key={link.label} style={{ textDecoration: 'none' }}  >
      {({ isActive }) => <NavLink label={link.label} active={isActive} pl="15%" />}
    </RouterNavLink>
  ));
  return (
    <>
      {isEmpty(links) ? (
        <RouterNavLink to={url} style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <NavLink className="navlinkCustom" p="0.8rem" label={label} active={isActive} icon={icon} />
          )}
        </RouterNavLink>
      ) : (
        <NavLink
          onClick={() => setOpened((o) => !o)}
          label={label}
          icon={icon}
          rightSection={
            !isEmpty(links) ? (
              <IconChevronRight size="0.8rem" stroke={1.5} />
            ) : null
          }
        />
      )}
      {!isEmpty(links) ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

import { ActionIcon, Indicator, Menu } from "@mantine/core";
import { IconBrandMessenger } from "@tabler/icons-react";
import { useState } from "react";

export default function MessList() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Menu opened={opened} onChange={setOpened} shadow="md">
        <Menu.Target>
          <Indicator className="colorCustom" inline label="1" color="red" size={20}>
            <ActionIcon
              onClick={() => {
                // handleSuccessRead();
              }}
              variant="light"
              radius="xl"
              size="lg"
            >
              <IconBrandMessenger size="1.25rem" />
            </ActionIcon>
          </Indicator>
        </Menu.Target>

        <Menu.Dropdown
          miw={420}
          mah={640}
          style={{ overflow: "auto" }}
          className="menu-dropdown-cart"
        ></Menu.Dropdown>
      </Menu>
    </>
  );
}

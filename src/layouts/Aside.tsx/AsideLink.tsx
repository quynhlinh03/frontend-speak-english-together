import { NavLink } from "@mantine/core";
import { Option } from "./Options";
import { useNavigate } from "react-router-dom";

export interface OptionProps extends Option {
  uid?: number;
}

export default function NavigationLink({ icon, label, uid }: OptionProps) {
  const navigate = useNavigate();

  return (
    <>
      <NavLink
        className="navlinkCustom"
        p="0.8rem"
        label={label}
        icon={icon}
        onClick={() => {
          navigate(`/chat/${uid}`);
        }}
      />
    </>
  );
}

import { forwardRef, ReactElement } from "react";
import PropTypes from "prop-types";
import { Group, Avatar, Text, Select } from "@mantine/core";

interface AccountData {
  image: string;
  label: string;
  value: any;
}

interface PropData {
  label?: string;
  placeholder?: string;
  onChange?: (selectedValue: any) => void;
  icon?: ReactElement;
  data: AccountData[];
  error?: string | false | undefined;
  className?: string;
  value?: string;
  style?: object;
  clearable?: boolean;
}

interface AccountItemProps {
  props: PropData;
}

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar radius="100%" src={image} />
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);

function SelectCustom({ props }: AccountItemProps) {
  return (
    <Select
      clearable={props.clearable}
      withAsterisk
      className={`customTextInput ${props.className}`}
      label={props.label}
      placeholder={props.placeholder}
      icon={props.icon}
      itemComponent={SelectItem}
      data={props.data}
      searchable
      // maxDropdownHeight={400}
      onChange={props.onChange}
      nothingFound="Nobody here"
      filter={(value, item) =>
        (item.label &&
          item.label.toLowerCase().includes(value.toLowerCase().trim())) ||
        false
      }
      value={props.value}
      error={props.error}
      style={props.style}
    />
  );
}

SelectCustom.propTypes = {
  props: PropTypes.shape({
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        image: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default SelectCustom;

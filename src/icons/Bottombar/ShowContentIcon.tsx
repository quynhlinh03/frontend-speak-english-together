interface ShowContentIcon {
  fillcolor: string;
}

const ShowContentIcon: React.FC<ShowContentIcon> = (props) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 1H2.5C1.67 1 1 1.67 1 2.5v15c0 .83.67 1.5 1.5 1.5H4c.28 0 .5-.22.5-.5V1.5c0-.28-.22-.5-.5-.5Zm12 0h-10c-.28 0-.5.22-.5.5v18c0 .28.22.5.5.5h10c.28 0 .5-.22.5-.5v-18c0-.28-.22-.5-.5-.5Zm-1 1.5v16h-8v-16h8Zm2 0h1.5c.28 0 .5.22.5.5v15c0 .28-.22.5-.5.5H17V2.5c0-.28.22-.5.5-.5Z"
      fill={props.fillcolor}
    />
    <path
      d="M6 4h6v1H6V4Zm0 2h6v1H6V6Zm0 2h6v1H6V8Z"
      fill={props.fillcolor}
    />
  </svg>
);

export default ShowContentIcon;

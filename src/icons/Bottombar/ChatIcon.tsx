interface ChatIcon {
  fillcolor: string;
}

const ChatIcon: React.FC<ChatIcon>  = (props) => (
  <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2.25c-2.66 0-5.276.195-7.833.57C2 3.139.5 5.038.5 7.17v6.59c0 2.132 1.5 4.031 3.667 4.349.96.141 1.929.256 2.904.346v4.332a.821.821 0 0 0 1.402.58l4.583-4.581a.428.428 0 0 1 .291-.123 53.608 53.608 0 0 0 6.486-.554C22 17.79 23.5 15.892 23.5 13.76V7.169c0-2.133-1.5-4.03-3.667-4.348A53.825 53.825 0 0 0 12 2.25ZM7.893 9.232a1.232 1.232 0 1 0 0 2.464 1.232 1.232 0 0 0 0-2.464Zm2.875 1.232a1.232 1.232 0 1 1 2.465 0 1.232 1.232 0 0 1-2.465 0Zm5.34-1.232a1.232 1.232 0 1 0 0 2.465 1.232 1.232 0 0 0 0-2.465Z"
      fill={props.fillcolor}
    />
  </svg>
);

export default ChatIcon;

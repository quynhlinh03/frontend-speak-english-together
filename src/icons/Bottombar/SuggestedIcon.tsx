interface SuggestedSentencesIconProps {
  fillcolor: string;
}

const SuggestedIcon: React.FC<SuggestedSentencesIconProps> = (props) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 2C7.24 2 5 4.24 5 7c0 2.21 1.2 4.13 3 5.17V14a1 1 0 001 1h2a1 1 0 001-1v-1.83c1.8-1.04 3-2.96 3-5.17 0-2.76-2.24-5-5-5zm1 14h-2v-1h2v1zm1-2H8v-1h4v1zm0-2H8v-1h4v1z"
      fill={props.fillcolor}
    />
  </svg>
);

export default SuggestedIcon;

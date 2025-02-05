
interface ParticipantsIcon {
  fillcolor: string;
}
const ParticipantsIcon: React.FC<ParticipantsIcon>  = (props) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0Zm9.75 2.25a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 1 1 14.25 0v.003l-.001.119a.749.749 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122Zm15.75.003-.001.144a2.25 2.25 0 0 1-.233.96c1.746.108 3.49-.24 5.06-1.01a.75.75 0 0 0 .42-.643 4.874 4.874 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003h.001Z"
      fill={props.fillcolor}
    />
  </svg>
);

export default ParticipantsIcon;

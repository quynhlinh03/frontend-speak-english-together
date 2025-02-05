import React from "react";

const SpeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M8.8 4.19c0-.63-.537-1.142-1.2-1.142-.663 0-1.2.511-1.2 1.142v6.858c0 .63.537 1.143 1.2 1.143.663 0 1.2-.512 1.2-1.143V4.19ZM4.8 1.905c0-.631-.537-1.143-1.2-1.143-.663 0-1.2.512-1.2 1.143v11.428c0 .631.537 1.143 1.2 1.143.663 0 1.2-.512 1.2-1.143V1.905ZM12.8 1.905c0-.631-.537-1.143-1.2-1.143-.663 0-1.2.512-1.2 1.143v11.428c0 .631.537 1.143 1.2 1.143.663 0 1.2-.512 1.2-1.143V1.905Z"
    />
  </svg>
);

export default SpeakerIcon;

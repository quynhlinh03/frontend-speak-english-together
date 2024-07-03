import { useMediaQuery } from "react-responsive";

const useIsMobile = (maxWidth?: number) => {
  const isMobile = useMediaQuery({ maxWidth: maxWidth || 767 });
  return isMobile;
};

export default useIsMobile;

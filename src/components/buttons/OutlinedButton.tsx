import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";
import { createPopper } from "@popperjs/core";

interface OutlinedButtonProps {
  bgColor?: string;
  onClick: () => void;
  Icon?: React.ElementType;
  isFocused?: boolean;
  tooltip?: string;
  badge?: string;
  lottieOption?: {
    loop: boolean;
    autoPlay: boolean;
    animationData: any;
    rendererSettings: {
      preserveAspectRatio: string;
    };
  };
  disabledOpacity?: number;
  renderRightComponent?: () => React.ReactNode;
  disabled?: boolean;
  large?: boolean;
  btnID?: string;
  color?: string;
  focusIconColor?: string;
  isRequestProcessing?: boolean;
  borderColor?: string;
  buttonText?: string;
}

export const OutlinedButton: React.FC<OutlinedButtonProps> = ({
  bgColor,
  onClick,
  Icon,
  isFocused,
  tooltip,
  badge,
  lottieOption,
  disabledOpacity,
  renderRightComponent,
  disabled,
  large,
  btnID,
  color,
  focusIconColor,
  isRequestProcessing,
  borderColor,
  buttonText,
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [blinkingState, setBlinkingState] = useState(1);

  const [tooltipShow, setTooltipShow] = useState(false);
  const btnRef = useRef();
  const tooltipRef = useRef();

  const openTooltip = () => {
    createPopper(btnRef.current, tooltipRef.current, {
      placement: "top",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [-50, 0],
          },
        },
      ],
    });
    setTooltipShow(true);
  };
  const closeTooltip = () => {
    setTooltipShow(false);
  };

  const intervalRef = useRef();

  const iconSize = 24 * (large ? 1.7 : 1);

  const startBlinking = () => {
    intervalRef.current = setInterval(() => {
      setBlinkingState((s) => (s === 1 ? 0.4 : 1));
    }, 600);
  };

  const stopBlinking = () => {
    clearInterval(intervalRef.current);

    setBlinkingState(1);
  };

  useEffect(() => {
    if (isRequestProcessing) {
      startBlinking();
    } else {
      stopBlinking();
    }
  }, [isRequestProcessing]);

  useEffect(() => {
    return () => {
      stopBlinking();
    };
  }, []);

  return (
    <>
      <div
        ref={btnRef}
        onMouseEnter={() => {
          setMouseOver(true);
          openTooltip();
        }}
        onMouseLeave={() => {
          setMouseOver(false);
          closeTooltip();
        }}
        onMouseDown={() => {
          setMouseDown(true);
        }}
        onMouseUp={() => {
          setMouseDown(false);
        }}
      >
        <div
          className={`flex items-center justify-center ${
            mouseOver
              ? "0.0625rem border-transparent border-solid"
              : borderColor
              ? `0.0625rem border-[${borderColor}] border-solid`
              : bgColor
              ? "0.0625rem border-transparent border-solid"
              : "0.0625rem border-solid border-[#ffffff33]"
          } md:m-2 m-1`}
          style={{
            borderRadius: "1.75rem",
            transition: "all 200ms",
            transitionTimingFunction: "ease-in-out",
            opacity: blinkingState,
            backgroundColor: `${
              bgColor
                ? `${bgColor}`
                : isFocused
                ? "#132043"
                : "rgba(31, 65, 114, 0.2)"
            }`,
          }}
        >
          <button
            className={`${
              disabled ? "cursor-default" : "cursor-pointer"
            } flex items-center justify-center`}
            id={btnID}
            onMouseEnter={() => {
              setMouseOver(true);
            }}
            onMouseLeave={() => {
              setMouseOver(false);
            }}
            onMouseDown={() => {
              setMouseDown(true);
            }}
            onMouseUp={() => {
              setMouseDown(false);
            }}
            disabled={disabled}
            onClick={onClick}
          >
            <div
              className="flex items-center justify-center p-1 m-1 rounded-lg"
              style={{
                opacity: disabled ? disabledOpacity || 0.7 : 1,
                transform: `scale(${mouseOver ? (mouseDown ? 0.95 : 1.1) : 1})`,
                transition: `all ${200 * 1}ms`,
                transitionTimingFunction: "linear",
              }}
            >
              {Icon &&
                (lottieOption ? (
                  <div className={`flex items-center justify-center`}>
                    <div
                      style={{
                        height: iconSize,
                        width:
                          (iconSize * lottieOption?.width) /
                          lottieOption?.height,
                      }}
                    >
                      <Lottie
                        loop={lottieOption.loop}
                        autoPlay={lottieOption.autoPlay}
                        animationData={lottieOption.animationData}
                        rendererSettings={{
                          preserveAspectRatio:
                            lottieOption.rendererSettings.preserveAspectRatio,
                        }}
                        isClickToPauseDisabled
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Icon
                      style={{
                        color: isFocused
                          ? focusIconColor || "#fff"
                          : color
                          ? color
                          : "#132043",
                        height: iconSize,
                        width: iconSize,
                      }}
                      fillcolor={
                        isFocused
                          ? focusIconColor || "#fff"
                          : color
                          ? color
                          : "#132043"
                      }
                    />
                    {badge && (
                      <p
                      style = {{color: isFocused ? "#fff" : "#132043"}}
                        className={`text-base font-semibold ml-2`}
                      >
                        ({badge})
                      </p>
                    )}
                  </>
                ))}
            </div>
            {buttonText ? (
              <p className="text-sm text-black font-semibold mr-2 text-center">
                {buttonText}
              </p>
            ) : null}
          </button>
          {typeof renderRightComponent === "function" && renderRightComponent()}
        </div>
      </div>
      <div
        style={{ zIndex: 999 }}
        className={`${
          tooltipShow && (mouseOver || mouseDown) ? "" : "hidden"
        } overflow-hidden flex flex-col items-center justify-center whitespace-pre-line`}
        ref={tooltipRef}
      >
        <div className={"rounded-md p-1.5 bg-black "}>
          <p className="text-sm text-white ">{tooltip || ""}</p>
        </div>
      </div>
    </>
  );
};

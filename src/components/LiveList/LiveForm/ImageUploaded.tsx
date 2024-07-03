import { Image, CloseButton } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
const ImageUploaded: React.FC<{
  imageField: string;
  removeImage: () => void;
}> = ({ imageField, removeImage }) => {
  const handleImage = (url: string) =>
    modals.open({
      title: "Preview Thumbnail",
      centered: true,
      children: <Image w={500} src={url} alt="preview Image" />,
      className: "modal_preview_image",
    });
  const [isImageShown, setIsImageShown] = useState(true);
  const handleRemoveImage = () => {
    removeImage();
    setIsImageShown(false);
  };
  useEffect(() => {
    if (imageField) {
      setIsImageShown(true);
    } else {
      setIsImageShown(false);
    }
  }, [imageField]);

  return (
    <>
      {isImageShown && (
        <div
          style={{
            position: "relative",
            width: 192,
            height: 108,
            overflow: "hidden",
            borderRadius: "0.5rem",
          }}
        >
          <Image
            src={imageField}
            width={192}
            height={108}
            style={{ objectFit: "cover", cursor: "pointer", margin: "auto" }}
            onClick={() => handleImage(imageField)}
          />
          <CloseButton
            size="xs"
            radius="xl"
            variant="hover"
            title="Delete"
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              zIndex: 1,
              padding: 0,
              width: 10,
              height: 10,
              backgroundColor: "rgba(255, 255, 255)",
              margin: "5px",
            }}
            onClick={() => handleRemoveImage()}
          />
        </div>
      )}
    </>
  );
};
export default ImageUploaded;

/* eslint-disable no-unused-vars */
import Dialog from '@mui/material/Dialog';
import { IconButton } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useRef, useEffect } from 'react';
import ImageCropper from './imageCropper';

const UploadImage = ({
  setImgAfterCrop,
  aspectRatio,
  previewResult,
  setPreviewResult,
  previewNFT,
  nftArtifact,
  setNftArtifact,
}: {
  setImgAfterCrop: any;
  aspectRatio: any;
  previewResult: any;
  setPreviewResult: any;
  previewNFT?: boolean;
  nftArtifact?: any;
  setNftArtifact?: any;
}) => {
  const inputRef = useRef<any>();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<any>('');

  // Generating Cropped Image When Done Button Clicked
  const onCropDone = (imgCroppedArea: any) => {
    const canvasEle = document.createElement('canvas');
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext('2d');

    const imageObj1 = new Image();
    imageObj1.src = image;
    imageObj1.onload = function () {
      context?.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataURL = canvasEle.toDataURL('image/jpeg');
      setPreviewResult(dataURL);
      if (previewNFT) setNftArtifact(image);
      canvasEle.toBlob((blob) => {
        setImgAfterCrop(blob);
        setOpen(false);
      }, 'image/jpeg');
    };
  };

  // Handle Cancel Button Click
  const onCropCancel = () => {
    setOpen(false);
    setImage('');
    setPreviewResult('');
  };

  const discardUpload = () => {
    setImage('');
    setPreviewResult('');
    setNftArtifact();
  };

  const handleClose = () => {
    setPreviewResult('');
    setOpen(false);
  };

  const handleFileOnChange = (event: any) => {
    console.log(event.target.files, 'files');
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function () {
        setImage(reader.result);
        setOpen(true);
      };
    }
  };

  const onChooseImg = () => {
    inputRef?.current?.click();
  };

  return (
    <div className="container">
      {!previewResult && (
        <div className="image-upload-button-container">
          <input
            type="file"
            accept="image/*"
            name="dp"
            ref={inputRef}
            onChange={handleFileOnChange}
            onClick={(event) => {
              // eslint-disable-next-line no-param-reassign
              (event.target as HTMLInputElement).value = '';
            }}
            style={{ display: 'none' }}
          />
          <IconButton onClick={onChooseImg} name="dp" className="image-upload-button" aria-label="file upload">
            <FileUploadIcon />
          </IconButton>
        </div>
      )}
      <Dialog fullWidth maxWidth="xl" open={open} onClose={handleClose}>
        <div className="cropper-wrapper">
          <div className="header">Heading</div>
          <div className="cropper-wrap">
            <ImageCropper
              image={image}
              showPreviewNFTMessage={previewNFT}
              onCropDone={onCropDone}
              onCropCancel={onCropCancel}
              aspectRatio={aspectRatio}
            />
          </div>
        </div>
      </Dialog>
      {previewResult && (
        <div className="image-uploaded-container">
          <img className="cropped-img" src={previewResult} alt="previewResult" />
          <div className="action-after-imageupload">
            {/* <IconButton onClick={onChooseImg} name="dp" className="image-reupload-button" aria-label="file upload">
              <FileUploadIcon />
            </IconButton> */}
            <IconButton onClick={discardUpload} name="dp" className="image-reupload-button" aria-label="file upload">
              <ClearIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadImage;

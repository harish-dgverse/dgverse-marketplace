import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Cropper from 'react-easy-crop';
import './fileUpload.scss';

const ImageCropper = ({
  image,
  onCropDone,
  onCropCancel,
  aspectRatio,
  showPreviewNFTMessage,
}: {
  image: any;
  onCropDone: any;
  onCropCancel: any;
  aspectRatio: any;
  showPreviewNFTMessage?: boolean;
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any | null>(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = (croppedAreaPercentage: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  };

  return (
    <div className="cropper">
      <div className="cropContainer">
        <Cropper
          image={image}
          aspect={aspectRatio}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="action-btns">
        {showPreviewNFTMessage && (
          <p className="info-nft">
            The image you upload will be uploaded as Non fungible token. Cropped area will be considered as display picture.
          </p>
        )}
        <div className="slider-container">
          <span className="slider-label">Zoom</span>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            className="slider"
            onChange={(e, sliderZoom) => setZoom(sliderZoom)}
          />
        </div>
        <div className="button-wrapper">
          <button type="button" className="btn btn-outline discard-button" onClick={onCropCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn create-button"
            onClick={() => {
              onCropDone(croppedArea);
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;

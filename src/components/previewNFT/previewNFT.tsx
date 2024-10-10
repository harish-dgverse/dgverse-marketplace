import Dialog from '@mui/material/Dialog';
import { IconButton } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useRef } from 'react';
import './previewNFT.scss';

const PreviewNFT = ({ nftArtifact, setNftArtifact }: { nftArtifact: any; setNftArtifact: any }) => {
  const inputRef = useRef<any>();
  const [open, setOpen] = useState(false);
  const [nftCandidate, setNftCandidate] = useState<any>('');

  // Handle Cancel Button Click
  const onCancel = () => {
    setOpen(false);
    setNftArtifact('');
    setNftCandidate('');
  };

  const handleClose = () => {
    setOpen(false);
    setNftCandidate('');
  };

  const handleUpload = () => {
    setOpen(false);
    setNftArtifact(nftCandidate);
    setNftCandidate('');
  };

  const handleFileOnChange = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function () {
        setNftCandidate(reader.result);
        setOpen(true);
      };
    }
  };

  const onChooseImg = () => {
    inputRef?.current?.click();
  };

  return (
    <div className="preview-nft-container">
      {!nftArtifact && (
        <div className="image-upload-button-container">
          <input
            type="file"
            accept="image/*"
            name="dp"
            ref={inputRef}
            onChange={handleFileOnChange}
            style={{ display: 'none' }}
          />
          <IconButton onClick={onChooseImg} name="dp" className="image-upload-button" aria-label="file upload">
            <FileUploadIcon />
          </IconButton>
        </div>
      )}
      <Dialog fullWidth maxWidth="xl" open={open} onClose={handleClose}>
        <div className="nft-artifact-wrapper">
          <div className="header">Preview NFT</div>
          <p className="info-nft">
            The image you upload will be uploaded as Non fungible token. Also a prompt will come for cropping for profile
            picture.
          </p>
          <div className="nft-artifact-inner-wrapper">
            <img src={nftCandidate} alt="nft" />
          </div>
          <div className="button-wrapper">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="done-button" onClick={handleUpload}>
              Done
            </button>
          </div>
        </div>
      </Dialog>
      {nftArtifact && (
        <div className="image-uploaded-container">
          <img className="uploaded-nft" src={nftArtifact} alt="imgAfterCrop" />
          <div className="action-after-imageupload">
            <IconButton onClick={onChooseImg} name="dp" className="image-reupload-button" aria-label="file upload">
              <FileUploadIcon />
            </IconButton>
            <IconButton
              onClick={() => setNftArtifact('')}
              name="dp"
              className="image-reupload-button"
              aria-label="file upload"
            >
              <ClearIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewNFT;

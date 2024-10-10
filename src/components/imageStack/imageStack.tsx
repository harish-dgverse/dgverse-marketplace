import React, { FC } from 'react';
import './imageStack.module.scss';
// import ModeEditIcon from '@mui/icons-material/ModeEdit';
// import cover from '../../assets/placeholder/cover.jpeg';
// import dp from '../../assets/collection1.jpg';

interface ImageStackProps {
  dp: any;
  cover: any;
}

const ImageStack: FC<ImageStackProps> = ({ dp, cover }) => {
  return (
    <div className="image-stack">
      <div className="image-stack__item--top">
        {/* <span className="editicon">
          <ModeEditIcon />
        </span> */}
        <img className="cover-photo" src={cover} alt="cover" />
      </div>
      <div className="image-stack__item--bottom">
        {/* <span className="editicon">
          <ModeEditIcon />
        </span> */}
        <img className="display-picture" src={dp} alt="dp" />
      </div>
    </div>
  );
};

export default ImageStack;

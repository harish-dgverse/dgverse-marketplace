import { FC, useEffect, useState } from 'react';
import { Grid, Button } from '@mui/material';

interface DescriptionProps {
  description: string;
}

const Description: FC<DescriptionProps> = ({ description }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const handleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
    if (showFullDescription) setDescriptionLength(description?.length as number);
    else setDescriptionLength(100);
  }, [showFullDescription]);

  return (
    <Grid className="description-nft" item xs={12} sm={4}>
      <div className="content-headers">Description</div>
      {description && (
        <p className="content-para">
          {description?.slice(0, descriptionLength || 100)}
          {description.length > 100 && !showFullDescription && (
            <Button className="more-desc-button" variant="outlined" onClick={handleDescription}>
              ...show more
            </Button>
          )}
          {description?.length > 100 && showFullDescription && (
            <Button className="more-desc-button" variant="outlined" onClick={handleDescription}>
              ...show less
            </Button>
          )}
        </p>
      )}
    </Grid>
  );
};

export default Description;

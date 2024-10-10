import { FC } from 'react';
import { Grid, Chip } from '@mui/material';

interface TagsListProps {
  tags: any;
}

const TagsList: FC<TagsListProps> = ({ tags }) => {
  return (
    <Grid container columnSpacing={2}>
      <Grid className="tags-grid" item xs={12}>
        <div className="content-headers">Tags</div>
        <div className="chip-container">
          {tags?.length > 0 && tags.map((item: any) => <Chip key={item.tag} label={`#${item.tag}`} />)}
        </div>
      </Grid>
    </Grid>
  );
};

export default TagsList;

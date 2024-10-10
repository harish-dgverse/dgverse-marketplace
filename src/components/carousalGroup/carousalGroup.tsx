/* eslint-disable no-unused-vars */
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import TrendingCollectionCard from '../trendingCollections/trendingCollectionCard';
import './carousalGroup.module.scss';

const CarousalGroup = ({
  trendingData,
  trendingType,
  carousal,
  maxItems,
}: {
  trendingData: any;
  trendingType: string;
  carousal: boolean;
  maxItems?: any;
}) => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 8,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: maxItems ? maxItems.desktop : 5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const trendingCardData = trendingData.map((element: any) => {
    const card = {
      minterName: element.user.user_name,
      minterId: element.user.user_id,
      displayPic: element.image?.display_pic,
      minterIcon: element.user?.image?.icon,
    };
    if (trendingType === 'collection' || trendingType === 'sbt' || trendingType === 'nftc' || trendingType === 'ft') {
      return {
        ...element,
        ...card,
        identifier: element.token_id,
        tokenType: element.token_type,
        symbol: element.symbol,
      };
      // trendingCardData.push(trendingCardData);
    }
    return {
      ...element,
      ...card,
      identifier: element.nft_id,
      name: element.nft_name,
      tokenType: element.nft_type,
    };
    // trendingCardData.push(trendingCardData);
  });
  console.log(carousal, 'carousal');

  return (
    <Box sx={{ width: '100%' }}>
      <section className="carousal-container">
        {/* <Grid container justifyContent="start" alignItems="start" spacing={2}> */}
        {carousal && (
          <Carousel
            swipeable
            draggable={false}
            showDots={false}
            responsive={responsive}
            // ssr // means to render carousel on server-side.
            infinite={false}
            keyBoardControl
            slidesToSlide={1}
            customTransition="transform 100ms ease-in-out"
            transitionDuration={100}
            containerClass="carousel-container"
            removeArrowOnDeviceType={['tablet', 'mobile']}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
          >
            {trendingCardData.map((element: any) => {
              return (
                <TrendingCollectionCard key={element.identifier} trendingDetails={element} trendingType={trendingType} />
              );
            })}
          </Carousel>
        )}
        {!carousal && (
          <div className="collectionpart">
            {trendingCardData.map((element: any) => {
              return (
                <TrendingCollectionCard key={element.identifier} trendingDetails={element} trendingType={trendingType} />
              );
            })}
          </div>
        )}
      </section>
    </Box>
  );
};
export default CarousalGroup;

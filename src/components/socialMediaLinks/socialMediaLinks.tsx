import { FC } from 'react';
import youtube from '../../assets/social-media-icon/youtube-jaded.svg';
import message from '../../assets/social-media-icon/discord-jaded.svg';
import insta from '../../assets/social-media-icon/insta-jaded.svg';
import twitter from '../../assets/social-media-icon/twitter-x.png';
import fb from '../../assets/social-media-icon/fb.svg';
import linkedin from '../../assets/social-media-icon/linkedin.png';
import './socialMediaLinks.module.scss';

interface SocialMediaLinksProps {
  mediaLinks?: any;
}

const SocialMediaLinks: FC<SocialMediaLinksProps> = ({ mediaLinks }) => {
  const mediaLinkObj = mediaLinks.reduce(
    (accumalator: any, currentValue: any) => ({ ...accumalator, [currentValue.media]: currentValue.url }),
    {}
  );
  return (
    <div className="social-media-links">
      {mediaLinkObj.twitter && (
        <a href={mediaLinkObj.twitter} target="_blank" rel="noreferrer">
          <span className="social-icon">
            <img src={twitter} alt="twitter" />
          </span>
        </a>
      )}
      {mediaLinkObj.fb && (
        <a href={mediaLinkObj.fb} target="_blank" rel="noreferrer">
          <span className="social-icon">
            <img src={fb} alt="fb" />
          </span>
        </a>
      )}
      {mediaLinkObj.insta && (
        <a href={mediaLinkObj.insta} target="_blank" rel="noreferrer">
          <span className="social-icon">
            <img src={insta} alt="insta" />
          </span>
        </a>
      )}
      {mediaLinkObj.discord && (
        <a href={mediaLinkObj.discord} target="_blank" rel="noreferrer">
          <span className="social-icon">
            <img src={message} alt="discord" />
          </span>
        </a>
      )}
      {mediaLinkObj.yt && (
        <a href={mediaLinkObj.yt} target="_blank" rel="noreferrer">
          <span className="social-icon">
            <img src={youtube} alt="youtube" />
          </span>
        </a>
      )}
      {mediaLinkObj.linkedin && (
        <a href={mediaLinkObj.linkedin} target="_blank" rel="noreferrer">
          <span className="social-icon">
            <img src={linkedin} alt="linkedin" />
          </span>
        </a>
      )}
    </div>
  );
};
export default SocialMediaLinks;

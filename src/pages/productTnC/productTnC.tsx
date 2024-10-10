import { FC } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import '../aboutProduct/aboutProduct.scss';

interface ProductTnCPageProps {}

const ProductTnCPage: FC<ProductTnCPageProps> = () => {
  return (
    <div className="tutorial-page-outer-container faq-page-outer-container">
      <section className="aboutpageouter faq-section">
        <Grid container>
          <Grid sm={12}>
            <h1 className="abouttxt">Terms and Conditions</h1>
          </Grid>
          {/* <div className="contentsec"> */}
          <Grid xs={12} sm={12}>
            <p className="paragraph-list">
              Before using the Site and/or App, you agree to these Terms of Use and any terms and conditions incorporated
              herein by reference (collectively, these &#34;Terms&#34;).
            </p>
            <p className="paragraph-list">
              PLEASE READ THESE TERMS CAREFULLY BEFORE CREATING, MINTING, SELLING OR PURCHASING A TOKEN AND/OR USING THE
              WEBSITE. THESE TERMS GOVERN YOUR USAGE OF THE APPLICATION UNLESS WE HAVE EXECUTED A SEPARATE WRITTEN AGREEMENT
              WITH YOU FOR THAT PURPOSE IN WHICH CASE THAT AGREEMENT WILL TAKE PRECEDENCE.
            </p>
            <p>
              These terms and conditions outline the rules and regulations for your use of our platform. By accessing or
              using dgVerse NFT Launchpad, you accept and agree to be bound by these terms and conditions. If you disagree
              with any part of these terms, please do not use our platform.
            </p>
            <ol className="terms-list">
              <li>
                The DgVerse is a tokenization and marketplace application built on the Hedera Hashgraph network. Digital
                assets, including but not limited to art, photographs, music and video content, AR/VR images, in-game items,
                trading cards, event tickets and club memberships, in the form of single items or limited-edition items
                (&#34;Digital Assets&#34;) can be hashed and represented by cryptographic tokens (&#34;Tokens&#34;) on the
                Hedera Hashgraph network and offered for sale via the DgVerse or other NFT marketplace. By special
                arrangement, physical assets, including artworks, motor vehicles, sports cards and memorabilia (&#34;Physical
                Assets&#34;) may also be represented by Tokens and are subject to enhanced proof of seller identification and
                ownership.
              </li>
              <li>
                Intellectual Property: All content, logos, trademarks, and intellectual property displayed on DgVerse NFT
                Launchpad are the property of DgVerse or its respective owners. You may not use or reproduce any of our
                intellectual property without prior written consent.
              </li>
              <li>
                NFT Creation and Ownership: When creating and minting NFTs on DgVerse NFT Launchpad, you affirm that you have
                the necessary rights and permissions to the content used in the NFTs. You retain ownership of your created
                NFTs, and DgVerse does not claim any ownership rights.
              </li>
              <li>
                Compliance with Laws: Users of DgVerse NFT Launchpad are responsible for ensuring their activities comply
                with all applicable laws, regulations, and guidelines. Any illegal or unauthorized use of the platform is
                strictly prohibited.
              </li>
              <li>
                Platform Usage: DgVerse NFT Launchpad is provided on an &#34;as-is&#34; and &#34;as-available&#34; basis. We
                do not guarantee uninterrupted access to the platform or warrant that the platform will be error-free or
                secure. We reserve the right to modify, suspend, or terminate the platform at any time.
              </li>
              <li>
                User Conduct: Users are expected to conduct themselves in a respectful and lawful manner while using DgVerse
                NFT Launchpad. Any abusive, harmful, or fraudulent behaviour will result in immediate termination of access.
              </li>
              <li>
                Privacy: DgVerse respects your privacy and handles your personal information in accordance with our Privacy
                Policy. By using our platform, you consent to the collection, use, and storage of your personal information
                as outlined in the Privacy Policy.
              </li>
              <li>
                Limitation of Liability: DgVerse and its affiliates shall not be liable for any direct, indirect, incidental,
                consequential, or special damages arising out of or in connection with your use of DgVerse NFT Launchpad.
              </li>
              <li>
                Changes to Terms: DgVerse reserves the right to modify or revise these terms and conditions at any time. Any
                changes will be effective immediately upon posting on the platform. It is your responsibility to review the
                terms periodically.
              </li>
              <li>
                Users may promote Tokens/NFT that are minted on DgVerse on third-party websites, social media channels or
                other resources. We have no control over any External Sites and are not monitoring their content. You
                acknowledge and agree that we do not endorse any advertising, descriptions or other content or materials on
                or made available by any External Sites.
              </li>
            </ol>
          </Grid>
        </Grid>
      </section>
    </div>
  );
};

export default ProductTnCPage;

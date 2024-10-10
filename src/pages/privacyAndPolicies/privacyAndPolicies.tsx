import { FC } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Link } from 'react-router-dom';

interface PrivacyAndPoliciesPageProps {}

const PrivacyAndPoliciesPage: FC<PrivacyAndPoliciesPageProps> = () => {
  return (
    <div className="tutorial-page-outer-container faq-page-outer-container">
      <section className="aboutpageouter faq-section">
        <Grid container>
          <Grid sm={12}>
            <h1 className="abouttxt">Privacy and Policies</h1>
          </Grid>
          {/* <div className="contentsec"> */}
          <Grid xs={12} sm={12}>
            <p className="paragraph-list">
              At dgVerse, we take your privacy seriously and are committed to protecting your personal information. This
              Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you access and use dgVerse
              services. By using dgVerse, you agree to the terms and practices described in this policy.
            </p>
            <ol className="terms-list">
              <li>
                Information Collection: We may collect personal information such as your name, email address, and contact
                details when you create an account or engage in transactions on dgVerse. We also collect non-personal
                information through cookies and similar technologies to enhance your user experience.
              </li>
              <li>
                Use of Information: We use the collected information to provide and improve our services, personalize your
                experience, process transactions, communicate with you, and enforce our terms and policies. We may also use
                aggregated data for analytics and market research purposes.
              </li>
              <li>
                Data Sharing: We may share your personal information with trusted third-party service providers who assist us
                in operating our platform and delivering services to you. These providers are contractually bound to maintain
                the confidentiality and security of your information.
              </li>
              <li>
                Data Security: We implement industry-standard security measures to protect your personal information from
                unauthorized access, disclosure, or alteration. However, please note that no method of data transmission over
                the internet or electronic storage is 100% secure.
              </li>
              <li>
                Third-Party Links: dgVerse may contain links to third-party websites or services. We are not responsible for
                the privacy practices or content of these third parties. We encourage you to review the privacy policies of
                any external sites you visit.
              </li>
              <li>
                Legal Compliance: We may disclose your information if required by law or to comply with a legal obligation,
                protect our rights or the rights of others, or investigate fraud or security issues.
              </li>
              <li>
                Children&#39;s Privacy: dgVerse is not intended for use by individuals under the age of 18. We do not
                knowingly collect personal information from children. If we become aware that we have collected personal
                information from a child, we will take steps to delete it.
              </li>
              <li>
                Updates to Privacy Policy: We may update this Privacy Policy from time to time. We will notify you of any
                material changes by posting the updated policy on dgVerse. Your continued use of the platform after the
                changes are made will signify your acceptance of the revised Privacy Policy.
              </li>
            </ol>
            <p className="paragraph-list note">
              <span className="note-txt">Note:</span> If you have any questions or concerns regarding our Privacy Policy or
              the handling of your personal information, please <Link to="/contact-us">contact us</Link>. We are committed to
              addressing and resolving privacy-related matters promptly and responsibly.
            </p>
            <p className="note">
              <span className="note-txt">Note:</span> This Privacy Policy is effective as of 4th August 2023
            </p>
          </Grid>
        </Grid>
      </section>
    </div>
  );
};

export default PrivacyAndPoliciesPage;

import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/privacyPolicy.jpg"
            alt="policy"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <ul>
            <li>We prioritize your privacy and handle your personal information with utmost care.</li>
            <li>The data we collect is used to improve your app experience, process orders efficiently, and deliver excellent customer support.</li>
            <li>Your personal information is kept secure and is not shared with third parties for marketing purposes without your explicit consent.</li>
            <li>We comply with relevant privacy laws and regulations to ensure the protection of your data.</li>
            <li>If you have any privacy-related questions or concerns, please don't hesitate to contact us.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;

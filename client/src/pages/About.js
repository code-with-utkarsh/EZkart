import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Ecommer app"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <ul>
          <li><strong>Our Story:</strong> Learn about our journey, challenges, and growth as an EZkart app driven by our passion for providing exceptional products and services.</li>
          <li><strong>Mission:</strong> Our mission is to curate a diverse selection of high-quality products while delivering outstanding customer experiences.</li>
          <li><strong>Customer-Centric Approach:</strong> We prioritize our customers by offering responsive support, easy returns, and efficient order processing.</li>
          <li><strong>Team and Values:</strong> Meet our dedicated team and discover the values that underpin our commitment to transparency and integrity.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default About;

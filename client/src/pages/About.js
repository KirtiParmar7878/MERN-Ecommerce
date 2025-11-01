import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
            Welcome to ShopEase — your one-stop destination for all your shopping needs!
            Our goal is to make online shopping simple, secure, and enjoyable for everyone.

           At ShopEase, we bring together a wide variety of high-quality products — from fashion and electronics to home essentials — all in one place. 
           We believe in delivering not just products, but a smooth shopping experience with quick delivery, safe payments, and reliable customer service.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;

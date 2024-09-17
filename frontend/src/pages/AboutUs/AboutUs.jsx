import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800 px-6 py-16 lg:px-24 lg:py-32">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-[#57325F]">
          About Us
        </h1>
        <p className="text-lg lg:text-xl text-gray-700 mb-12">
          Welcome to{" "}
          <span className="text-[#FF5722] font-semibold">EsalerBd</span>, your
          ultimate destination for fashion, electronics, home goods, and more.
          Since our inception, our mission has been simple: to offer the best
          products, exceptional customer service, and an unparalleled shopping
          experience for our valued customers.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="text-left">
            <h2 className="text-2xl font-semibold text-[#0B1835] mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 leading-relaxed">
              EsalerBd was born out of a desire to make shopping more
              convenient, accessible, and enjoyable. What started as a small,
              passionate project has grown into a thriving online platform with
              thousands of products across various categories. We began our
              journey with a simple vision: to connect people with the products
              they love, at prices they can afford, without sacrificing quality.
            </p>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-semibold text-[#0B1835] mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We aim to become a leading e-commerce destination that not only
              provides top-quality products but also builds a community of
              satisfied customers. We believe in pushing the boundaries of
              online shopping, creating a space where innovation meets
              simplicity. Our goal is to offer a seamless and personalized
              experience, where shopping feels effortless and enjoyable.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mt-12">
          <div className="text-left">
            <h2 className="text-2xl font-semibold text-[#0B1835] mb-4">
              What We Offer
            </h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>
                Curated Collections: Every product on our platform is carefully
                selected to meet the highest standards of quality, style, and
                functionality.
              </li>
              <li>
                Exceptional Value: We work tirelessly to ensure that we offer
                the most competitive prices without compromising on quality.
              </li>
              <li>
                Customer-Centric Approach: Our customers are at the heart of
                everything we do. From responsive support to user-friendly
                interfaces, we are committed to making your shopping experience
                smooth and satisfying.
              </li>
              <li>
                Sustainability & Responsibility: At EsalerBd, we are dedicated
                to supporting eco-friendly practices and sourcing products from
                ethical suppliers. We believe in creating a positive impact on
                both our customers and the world.
              </li>
            </ul>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-semibold text-[#0B1835] mb-4">
              Why Choose Us?
            </h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>
                A Wide Range of Products: With thousands of items across
                multiple categories, we cater to all your needs.
              </li>
              <li>
                Fast & Secure Shipping: We know how important it is to get your
                items on time, which is why we offer fast, reliable, and secure
                shipping options.
              </li>
              <li>
                Customer Satisfaction Guaranteed: Our easy return and refund
                policies are designed to give you peace of mind while shopping.
              </li>
              <li>
                Unbeatable Customer Support: Our support team is always
                available to help you with any queries, from product details to
                order tracking.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-[#0B1835] mb-6">
            Join Us on Our Journey
          </h2>
          <p className="text-gray-600 leading-relaxed mb-12">
            Thank you for choosing EsalerBd as your go-to online store. We’re
            excited to have you with us on this journey and look forward to
            exceeding your expectations with every order.
          </p>
          <Link
            to="/"
            className="bg-[#FF5722] text-white py-3 px-8 rounded-full text-lg hover:bg-[#e24a1d] transition"
          >
            Start Shopping Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

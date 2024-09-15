import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-gray-100 text-gray-800 px-6 py-16 lg:px-24 lg:py-32">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-[#57325F]">
          Contact Us
        </h1>
        <p className="text-lg lg:text-xl text-gray-700 mb-12">
          We’re here to assist you! Whether you have questions about our
          products, need help with your order, or just want to say hello, we’d
          love to hear from you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="text-left">
            <h2 className="text-2xl font-semibold text-[#0B1835] mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-4">
              Feel free to reach out to us through the following contact
              details:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li className="mb-2">
                <span className="font-semibold text-[#0B1835]">Email:</span>
                <a
                  href="mailto:topten3610@gmail.com"
                  className="text-[#FF5722] hover:underline"
                >
                  topten3610@gmail.com
                </a>
              </li>
              <li>
                <span className="font-semibold text-[#0B1835]">Phone:</span>
                <a
                  href="tel:01620520142"
                  className="text-[#FF5722] hover:underline"
                >
                  01620520142
                </a>
              </li>
            </ul>
            <p className="text-gray-600 mb-6">
              Our customer support team is available Monday through Friday from
              9 AM to 6 PM. We aim to respond to all inquiries within 24 hours.
            </p>
          </div>

          <div className="text-left">
            <h2 className="text-2xl font-semibold text-[#0B1835] mb-4">
              Visit Us
            </h2>
            <p className="text-gray-600 mb-4">
              If you prefer to visit us in person, you can find us at our
              office:
            </p>
            <address className="text-gray-600 mb-6">
              <p>EsalerBd HQ</p>
              <p>123 Commerce Street</p>
              <p>Dhaka, Bangladesh</p>
            </address>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-[#0B1835] mb-6">
            Send Us a Message
          </h2>
          <form className="max-w-lg mx-auto space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-[#FF5722] text-white py-3 px-8 rounded-full text-lg hover:bg-[#e24a1d] transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

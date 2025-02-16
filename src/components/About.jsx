import React from "react";

const About = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8  mx-72 my-8 flex flex-col rounded-2xl md:flex-row items-center justify-between gap-8" href="#about">
      {/* Text Content - Left Side*/}
      <div className="md:w-3/5 p-4">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          About Our Plant Watering System
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Our automated plant watering system continuously monitors soil
          moisture, humidity, temperature, and plant height. Whenever your plant
          needs water, the system activates a pump to keep it optimally
          hydrated. No more guesswork—just healthy, thriving plants!
        </p>
        <p className="text-gray-700 leading-relazed">
          Built using an Arduino, OpenCV, Flask, and React, our system provides
          a simple dashboard to view real-time sensor data and trigger manual
          watering if desired. Whether you’re a gardening enthusiast or just
          looking for an easy way to care for your plants, this system has you
          covered.
        </p>
      </div>

      {/* Image - Right Side*/}
      <div className="md:w-2/5 flex justify-center items-center">
        {/* <img
          src="https://via.placeholder.com/300x300.png?text=Plant+Illustration"
          alt="Plant Image"
          className="w-full h-auto object-cover"
        /> */}
      </div>
    </div>
  );
};

export default About;

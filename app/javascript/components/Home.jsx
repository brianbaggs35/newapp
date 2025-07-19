import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div className="w-screen h-screen bg-primary flex items-center justify-center">
    <div className="bg-transparent">
      <div className="container text-secondary">
        <h1 className="text-5xl font-bold mb-4">Test App</h1>
        <p className="text-xl mb-4">
          Test application for using React on Rails.
        </p>
        <hr className="my-4 border-t border-gray-300" />
        <Link
          to="/newlink"
          className="btn btn-lg bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
          role="button"
        >
          Link Test
        </Link>
      </div>
    </div>
  </div>
);
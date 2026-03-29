"use client";

import { ChangeEvent, useState } from "react";

type FormData = {
  gender: string;
  race_ethnicity: string;
  parental_level_of_education: string;
  lunch: string;
  test_preparation_course: string;
  reading_score: string;
  writing_score: string;
};

export default function Home() {
  const [form, setForm] = useState<FormData>({
    gender: "",
    race_ethnicity: "",
    parental_level_of_education: "",
    lunch: "",
    test_preparation_course: "",
    reading_score: "",
    writing_score: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear error when user edits field
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.race_ethnicity)
      newErrors.race_ethnicity = "Race / Ethnicity is required";
    if (!form.parental_level_of_education)
      newErrors.parental_level_of_education = "Parental education is required";
    if (!form.lunch) newErrors.lunch = "Lunch type is required";
    if (!form.test_preparation_course)
      newErrors.test_preparation_course = "Test preparation is required";

    if (!form.reading_score) {
      newErrors.reading_score = "Reading score is required";
    } else if (isNaN(Number(form.reading_score))) {
      newErrors.reading_score = "Must be a number";
    }

    if (!form.writing_score) {
      newErrors.writing_score = "Writing score is required";
    } else if (isNaN(Number(form.writing_score))) {
      newErrors.writing_score = "Must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setForm({
      gender: "",
      race_ethnicity: "",
      parental_level_of_education: "",
      lunch: "",
      test_preparation_course: "",
      reading_score: "",
      writing_score: "",
    });
    setErrors({});
    setPrediction(null);
  };

  const handlePredict = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          reading_score: Number(form.reading_score),
          writing_score: Number(form.writing_score),
        }),
      });

      const data: { prediction?: number; error?: string } = await res.json();

      if (data.prediction !== undefined) {
        setPrediction(data.prediction);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const inputStyle =
    "p-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 " +
    "focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none " +
    "hover:shadow-md transition";

  const errorStyle = "text-red-500 text-sm mt-1";

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-3xl border border-white/30">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Student Performance Predictor
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Enter student information to predict performance
        </p>

        <div className="grid grid-cols-2 gap-5">
          {/* Gender */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <span className={errorStyle}>{errors.gender}</span>
            )}
          </div>

          {/* Race */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Race / Ethnicity
            </label>
            <select
              name="race_ethnicity"
              value={form.race_ethnicity}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select group</option>
              <option value="group A">Group A</option>
              <option value="group B">Group B</option>
              <option value="group C">Group C</option>
              <option value="group D">Group D</option>
              <option value="group E">Group E</option>
            </select>
            {errors.race_ethnicity && (
              <span className={errorStyle}>{errors.race_ethnicity}</span>
            )}
          </div>

          {/* Parent Education */}
          <div className="flex flex-col col-span-2">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Parental Level of Education
            </label>
            <select
              name="parental_level_of_education"
              value={form.parental_level_of_education}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select level</option>
              <option value="some high school">Some High School</option>
              <option value="high school">High School</option>
              <option value="some college">Some College</option>
              <option value="associate's degree">Associate's Degree</option>
              <option value="bachelor's degree">Bachelor's Degree</option>
              <option value="master's degree">Master's Degree</option>
            </select>
            {errors.parental_level_of_education && (
              <span className={errorStyle}>
                {errors.parental_level_of_education}
              </span>
            )}
          </div>

          {/* Lunch */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Lunch Type
            </label>
            <select
              name="lunch"
              value={form.lunch}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select type</option>
              <option value="standard">Standard</option>
              <option value="free/reduced">Free / Reduced</option>
            </select>
            {errors.lunch && <span className={errorStyle}>{errors.lunch}</span>}
          </div>

          {/* Test Prep */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Test Preparation
            </label>
            <select
              name="test_preparation_course"
              value={form.test_preparation_course}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select option</option>
              <option value="none">None</option>
              <option value="completed">Completed</option>
            </select>
            {errors.test_preparation_course && (
              <span className={errorStyle}>
                {errors.test_preparation_course}
              </span>
            )}
          </div>

          {/* Reading */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Reading Score
            </label>
            <input
              type="number"
              name="reading_score"
              value={form.reading_score}
              min={0}
              max={100}
              onChange={handleChange}
              className={inputStyle}
            />
            {errors.reading_score && (
              <span className={errorStyle}>{errors.reading_score}</span>
            )}
          </div>

          {/* Writing */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">
              Writing Score
            </label>
            <input
              type="number"
              name="writing_score"
              value={form.writing_score}
              min={0}
              max={100}
              onChange={handleChange}
              className={inputStyle}
            />
            {errors.writing_score && (
              <span className={errorStyle}>{errors.writing_score}</span>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handlePredict}
            className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>

          <button
            onClick={handleReset}
            className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
          >
            Reset
          </button>
        </div>

        {prediction !== null && (
          <div className="mt-6 text-center bg-green-50 border border-green-200 p-4 rounded-xl">
            <p className="text-gray-700">
              Prediction Result: <strong>(Math Score)</strong>
            </p>
            <p className="text-3xl font-bold text-green-600">{prediction}</p>
          </div>
        )}
      </div>
    </main>
  );
}

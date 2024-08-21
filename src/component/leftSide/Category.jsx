import React, { useState, useEffect } from "react";

const categories = [
  // "All",
  "Laptop",
  "Tablet",
  "Accessories",
  "Smartphone",
  "Headphones",
  "Smartwatch",
  "Camera",
];

const Category = ({ onCategoryChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (event) => {
    event.preventDefault();
    const category = event.target.value;
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((item) => item !== category)
        : [...prevSelected, category]
    );
  };

  useEffect(() => {
    onCategoryChange(selectedCategories);
  }, [selectedCategories, onCategoryChange]);

  return (
    <div className="mt-4  pb-4">
      <h2 className="font-bold md:text-lg text-sm">Select Category(s)</h2>
      {categories.map((category) => (
        <div
          key={category}
          className="flex items-center justify-end gap-2 my-2"
        >
          <label className="md:text-base text-sm">{category}</label>
          <input
            type="checkbox"
            className="md:w-6 md:h-6 w-4 h-4 accent-blue-500"
            value={category}
            checked={selectedCategories.includes(category)}
            onChange={handleCheckboxChange}
          />
        </div>
      ))}
    </div>
  );
};

export default Category;

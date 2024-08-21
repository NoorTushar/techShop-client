import React, { useState, useEffect } from "react";

const brands = ["Apple", "Samsung", "Dell", "Sony", "Bose"];

const Brand = ({ onBrandChange }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleCheckboxChange = (event) => {
    event.preventDefault();
    const brand = event.target.value;
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brand)
        ? prevSelected.filter((item) => item !== brand)
        : [...prevSelected, brand]
    );
  };

  useEffect(() => {
    onBrandChange(selectedBrands);
  }, [selectedBrands, onBrandChange]);

  return (
    <div className=" pb-4 mt-4  pt-4">
      <h2 className="font-bold md:text-lg text-sm">Select Brand(s)</h2>
      {brands.map((brand) => (
        <div key={brand} className="flex items-center justify-end gap-2 my-2">
          <label className="md:text-base text-sm">{brand}</label>
          <input
            type="checkbox"
            className="md:w-6 md:h-6 w-4 h-4 accent-blue-500"
            value={brand}
            checked={selectedBrands.includes(brand)}
            onChange={handleCheckboxChange}
          />
        </div>
      ))}
    </div>
  );
};

export default Brand;

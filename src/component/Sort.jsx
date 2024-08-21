const Sort = ({ onSortChange }) => {
  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div className="md:mb-0 mb-6">
      <select onChange={handleSortChange}>
        <option value="">Sort By</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
        <option value="newToOld">New to Old</option>
        <option value="oldToNew">Old to New</option>
      </select>
    </div>
  );
};

export default Sort;

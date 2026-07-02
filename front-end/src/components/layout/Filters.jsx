import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "../../constants/constants";
import StarRatings from "react-star-ratings";

const Filters = () => {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setMin(searchParams.get("price[gte]") || "");
    setMax(searchParams.get("price[lte]") || "");
  }, [searchParams]);

  const updateParams = (newParams) => {
    navigate(`${window.location.pathname}?${newParams.toString()}`);
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (min) params.set("price[gte]", min);
    else params.delete("price[gte]");

    if (max) params.set("price[lte]", max);
    else params.delete("price[lte]");

    updateParams(params);
  };

  const handleFilterClick = (name, value) => {
    const params = new URLSearchParams(searchParams);

    if (params.get(name) === value.toString()) {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    updateParams(params);
  };

  const clearFilters = () => {
    const keyword = searchParams.get("keyword");
    navigate(keyword ? `/?keyword=${keyword}` : "/");
  };

  return (
    <aside className="filters-card">
      <div className="filters-header">
        <h3>Filters</h3>
        <button type="button" onClick={clearFilters}>
          Clear
        </button>
      </div>

      <div className="filter-block">
        <h5>Price Range</h5>

        <form onSubmit={handlePriceFilter}>
          <div className="price-filter-row">
            <input
              type="text"
              placeholder="Min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />

            <input
              type="text"
              placeholder="Max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />

            <button type="submit">Go</button>
          </div>
        </form>
      </div>

      <div className="filter-block">
        <h5>Category</h5>

        <div className="filter-options">
          {PRODUCT_CATEGORIES?.map((category) => (
            <label key={category} className="filter-option">
              <input
                type="checkbox"
                checked={searchParams.get("category") === category}
                onChange={() => handleFilterClick("category", category)}
              />

              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <h5>Ratings</h5>

        <div className="filter-options">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="filter-option rating-option">
              <input
  type="checkbox"
  name="ratings[gte]"
  value={rating}
  checked={searchParams.get("ratings[gte]") === rating.toString()}
  onChange={() => handleFilterClick("ratings[gte]", rating)}
/>

              <StarRatings
                rating={rating}
                starRatedColor="#ffb829"
                starEmptyColor="#d8dee9"
                numberOfStars={5}
                name={`rating-${rating}`}
                starDimension="20px"
                starSpacing="1px"
              />
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Filters;
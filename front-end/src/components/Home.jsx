import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import MetaData from "./layout/MetaData";
import Loader from "./layout/Loader";
import Filters from "./layout/Filters";
import CustomPagination from "./layout/CustomPagination";
import HomeBanner from "./layout/HomeBanner";

import { useGetProductsQuery } from "../redux/api/productApi";
import ProductSlider from "./product/ProductSlider";

const POPULAR_CATEGORIES = [
  {
    name: "Romance",
    icon: "📚",
  },
  {
    name: "Fantasy",
    icon: "🧙",
  },
  {
    name: "Mystery",
    icon: "🔍",
  },
  {
    name: "Thriller",
    icon: "🕵️",
  },
  {
    name: "Classics",
    icon: "🏛️",
  },
  {
    name: "History",
    icon: "📜",
  },
  {
    name: "Crime",
    icon: "🚓",
  },
  {
    name: "Poetry",
    icon: "✍️",
  },
  {
    name: "Drama",
    icon: "🎭",
  },
];

const Home = () => {
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category");

  const min = searchParams.get("price[gte]");
  const max = searchParams.get("price[lte]");
  const ratings = searchParams.get("ratings[gte]");

  const params = {
    page,
    resPerPage: 100,
  };

  if (keyword) params.keyword = keyword;
  if (category) params.category = category;
  if (min) params["price[gte]"] = min;
  if (max) params["price[lte]"] = max;
  if (ratings) params["ratings[gte]"] = ratings;

  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [isError, error]);

  if (isLoading) return <Loader />;

  const products = data?.products || [];
  const isFiltered = Boolean(keyword || category || min || max || ratings);

  const now = new Date();

  const topDealBooks = [...products]
    .filter((product) => Number(product?.discount || 0) > 0)
    .sort((a, b) => Number(b?.discount || 0) - Number(a?.discount || 0))
    .slice(0, 12);

  const flashSaleBooks = [...products]
    .filter((product) => {
      if (!product?.isFlashSale) return false;

      if (!product?.flashSaleStartTime || !product?.flashSaleEndTime) {
        return false;
      }

      const start = new Date(product.flashSaleStartTime);
      const end = new Date(product.flashSaleEndTime);

      return now >= start && now <= end;
    })
    .slice(0, 12);

  const bestSellerBooks = [...products]
    .filter((product) => Number(product?.sold || 0) > 0)
    .sort((a, b) => Number(b?.sold || 0) - Number(a?.sold || 0))
    .slice(0, 12);

  return (
    <>
      <MetaData title="ShopBook" />

      {!isFiltered && <HomeBanner />}

      <div className="home-main-layout">
        <aside className="home-sidebar">
          {isFiltered ? (
            <Filters />
          ) : (
            <>
              <h3>Popular Categories</h3>

              {POPULAR_CATEGORIES.map((item) => (
                <Link key={item.name} to={`/?category=${item.name}`}>
                  {item.icon} {item.name}
                </Link>
              ))}
            </>
          )}
        </aside>

        <main className="home-products-area" id="products">
          {isFiltered ? (
            <>
             <h1 id="products_heading">
  {keyword
    ? `${products.length} Books Found for "${keyword}"`
    : category
      ? `${category} Books (${products.length})`
      : `Books (${products.length})`}
</h1>

              <ProductSlider
                title="Search Results"
                products={products}
                viewAllLink="/"
              />

              <div className="pagination-wrapper">
                <CustomPagination
                  resPerPage={data?.resPerPage}
                  filteredProductsCount={data?.filteredProductsCount}
                />
              </div>
            </>
          ) : (
            <>
              <ProductSlider
                title="🔥 TOP DEAL"
                products={topDealBooks}
                viewAllLink="/top-deals"
              />

              <ProductSlider
                title="⚡ FLASH SALE"
                products={flashSaleBooks}
                viewAllLink="/flash-sale"
              />

              <ProductSlider
                title="🏆 BEST SELLER"
                products={bestSellerBooks}
                viewAllLink="/best-seller"
              />
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
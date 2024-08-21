import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosCommon from "../provider/useAxiosCommon";
import Product from "../component/productUi/Product";
import Brand from "../component/leftSide/Brand";
import Category from "../component/leftSide/Category";
import Sort from "../component/Sort";
import Search from "../component/Search";
import Pagination from "../component/Pagination";
import PriceRange from "../component/leftSide/PriceRange";
import Footer from "../component/Footer";
import Loader from "../component/Loader";

const Home = () => {
   const axiosCommon = useAxiosCommon();
   const [products, setProducts] = useState([]);
   const [filteredProducts, setFilteredProducts] = useState([]);
   const [selectedBrands, setSelectedBrands] = useState([]);
   const [selectedCategories, setSelectedCategories] = useState([]);
   const [sortOption, setSortOption] = useState("");
   const [searchQuery, setSearchQuery] = useState("");
   const [priceRange, setPriceRange] = useState({ min: "", max: "" });
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(0);

   // fetch products
   const { data, isLoading, error } = useQuery({
      queryKey: ["products", page],
      queryFn: async () => {
         const response = await axiosCommon.get(
            `/products?page=${page}&limit=10`
         );
         return response.data;
      },
   });

   useEffect(() => {
      if (data) {
         console.log("API response data:", data);

         setProducts(data);
         setTotalPages(Math.ceil(data.length / 10));
      } else {
         console.error("Data format is incorrect or empty.");
      }
   }, [data]);

   useEffect(() => {
      let filtered = products;

      // filter by  brands
      if (selectedBrands.length > 0) {
         filtered = filtered.filter((product) =>
            selectedBrands.includes(product.brand)
         );
      }

      // filter by categories
      if (selectedCategories.length > 0) {
         filtered = filtered.filter((product) =>
            selectedCategories.includes(product.category)
         );
      }

      // filter by search query
      if (searchQuery) {
         filtered = filtered.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
         );
      }

      // filter by price range
      if (priceRange.min || priceRange.max) {
         filtered = filtered.filter((product) => {
            const price = parseFloat(product.price);
            return (
               (!priceRange.min || price >= parseFloat(priceRange.min)) &&
               (!priceRange.max || price <= parseFloat(priceRange.max))
            );
         });
      }

      // sort filtered products
      // if (sortOption === "priceLowToHigh") {
      //   filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      // } else if (sortOption === "priceHighToLow") {
      //   filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      // } else if (sortOption === "newToOld") {
      //   filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // } else if (sortOption === "oldToNew") {
      //   filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      // }
      if (sortOption === "priceLowToHigh") {
         filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortOption === "priceHighToLow") {
         filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (sortOption === "newToOld") {
         filtered.sort((a, b) => {
            const dateA = new Date(`${a.createdDate}T${a.createdTime}`);
            const dateB = new Date(`${b.createdDate}T${b.createdTime}`);
            return dateB - dateA;
         });
      } else if (sortOption === "oldToNew") {
         filtered.sort((a, b) => {
            const dateA = new Date(`${a.createdDate}T${a.createdTime}`);
            const dateB = new Date(`${b.createdDate}T${b.createdTime}`);
            return dateA - dateB;
         });
      }

      // paginate
      const productsPerPage = 10;
      const startIndex = (page - 1) * productsPerPage;
      const paginated = filtered.slice(
         startIndex,
         startIndex + productsPerPage
      );

      setFilteredProducts(paginated);
      setTotalPages(Math.ceil(filtered.length / productsPerPage));
   }, [
      products,
      selectedBrands,
      selectedCategories,
      searchQuery,
      priceRange,
      sortOption,
      page,
   ]);

   const handleSortChange = (option) => setSortOption(option);
   const handleSearchChange = (query) => setSearchQuery(query);
   const handlePriceChange = (min, max) => setPriceRange({ min, max });
   const handlePageChange = (newPage) => setPage(newPage);

   if (isLoading) return <Loader />;
   if (error) return <>Error loading products.</>;

   return (
      <div className="md:mx-0 mx-2">
         <div className="flex md:p-8">
            <div className="md:basis-4/5 basis-2/4 md:p-4">
               <div className="flex md:flex-row flex-col justify-between items-center mt-6">
                  <Search onSearch={handleSearchChange} />
                  <Sort onSortChange={handleSortChange} />
               </div>
               <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 my-10">
                  {filteredProducts.length === 0 ? (
                     <p className="text-center lg:col-span-3 md:col-span-2 col-span-1 bg-blue-50 h-52 flex justify-center items-center text-lg font-semibold">
                        No Product is available.
                     </p>
                  ) : (
                     filteredProducts.map((product) => (
                        <Product product={product} key={product._id} />
                     ))
                  )}
               </div>
               {/* <div className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div> */}
               <br />
            </div>
            <div className="md:basis-1/5 basis-2/4 md:p-4 flex flex-col items-end">
               <Brand onBrandChange={setSelectedBrands} />
               <Category onCategoryChange={setSelectedCategories} />
               <PriceRange onPriceChange={handlePriceChange} />
            </div>
         </div>
         <div className="flex justify-center mb-8">
            <Pagination
               currentPage={page}
               totalPages={totalPages}
               onPageChange={handlePageChange}
            />
         </div>
         <div className="absolute left-0 bg-blue-500 w-full p-6 text-center">
            <Footer />
         </div>
      </div>
   );
};

export default Home;

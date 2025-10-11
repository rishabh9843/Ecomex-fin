import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="w-full">
      {/* Branding - Always at top */}
      <div className="text-center py-12 px-4 bg-gradient-to-b from-gray-900 via-black to-black">
        <h1 className="text-6xl font-black tracking-wider drop-shadow-lg">
          <span className="text-pink-500">Eco</span>
          <span className="text-purple-500">mex</span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Premium Shopping Experience</p>
      </div>

      {/* Header - Only on home page */}
      {!keyword && <Header />}
      
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center px-8 mt-8">
            <h2 className="text-4xl font-bold text-white">
              Special Products
            </h2>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 hover:bg-pink-700 transition-colors shadow-lg shadow-pink-500/50"
            >
              Shop
            </Link>
          </div>

          <div className="mt-8 px-8 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-12">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
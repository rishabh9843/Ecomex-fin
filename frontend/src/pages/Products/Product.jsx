import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="flex flex-col gap-4 group cursor-pointer">
      <div className="relative w-full aspect-square overflow-hidden rounded-3xl bg-gray-200 shadow-lg shadow-pink-500/0 group-hover:shadow-2xl group-hover:shadow-pink-500 transition-all duration-300">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-3xl hover:scale-105 transition-transform duration-300"
        />
        <HeartIcon product={product} />
      </div>

      <div className="px-2">
        <Link to={`/product/${product._id}`}>
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-white hover:text-gray-300 transition-colors line-clamp-2">
              {product.name}
            </h2>
            <span className="bg-pink-500 text-white text-sm font-medium px-3 py-1 rounded-full w-fit">
              ${product.price}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Product;
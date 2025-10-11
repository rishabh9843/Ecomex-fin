import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div
        className="hidden lg:flex fixed left-0 top-0 z-40 flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] h-screen transition-all duration-300"
        id="navigation-container"
      >
        <div className="flex flex-col justify-center space-y-4">
          <Link
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineHome className="mr-2 mt-12" size={26} />
            <span className="hidden nav-item-name mt-12 whitespace-nowrap">HOME</span>
          </Link>

          <Link
            to="/shop"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineShopping className="mr-2 mt-12" size={26} />
            <span className="hidden nav-item-name mt-12 whitespace-nowrap">SHOP</span>
          </Link>

          <Link to="/cart" className="flex relative">
            <div className="flex items-center transition-transform transform hover:translate-x-2">
              <AiOutlineShoppingCart className="mt-12 mr-2" size={26} />
              <span className="hidden nav-item-name mt-12 whitespace-nowrap">Cart</span>
            </div>

            <div className="absolute top-9">
              {cartItems.length > 0 && (
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </div>
          </Link>

          <Link to="/favorite" className="flex relative">
            <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
              <FaHeart className="mt-12 mr-2" size={20} />
              <span className="hidden nav-item-name mt-12 whitespace-nowrap">
                Favorites
              </span>
              <FavoritesCount />
            </div>
          </Link>
        </div>

        {/* Desktop Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-800 focus:outline-none"
          >
            {userInfo ? (
              <span className="text-white whitespace-nowrap overflow-hidden text-ellipsis">
                {userInfo.username}
              </span>
            ) : null}
            {userInfo && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 flex-shrink-0 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            )}
          </button>

          {dropdownOpen && userInfo && (
            <ul
              className={`absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-600 rounded shadow-lg ${
                !userInfo.isAdmin ? "-top-20" : "-top-80"
              }`}
            >
              {userInfo.isAdmin && (
                <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/productlist"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/categorylist"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orderlist"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/userlist"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logoutHandler}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
          {!userInfo && (
            <ul>
              <li>
                <Link
                  to="/login"
                  className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                >
                  <AiOutlineLogin className="mr-2" size={26} />
                  <span className="hidden nav-item-name whitespace-nowrap">LOGIN</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                >
                  <AiOutlineUserAdd size={26} />
                  <span className="hidden nav-item-name whitespace-nowrap">REGISTER</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Mobile Navigation - Hamburger Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black text-white p-4 flex justify-between items-center">
        <button
          onClick={toggleSidebar}
          className="text-2xl focus:outline-none"
        >
          ☰
        </button>
        <span className="text-lg font-semibold">Shop</span>
        <div className="relative">
          <Link to="/cart" className="flex items-center">
            <AiOutlineShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 px-1 py-0 text-xs text-white bg-pink-500 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed left-0 top-0 w-64 h-screen bg-black text-white p-4 overflow-y-auto">
            <button
              onClick={toggleSidebar}
              className="text-2xl mb-4"
            >
              ✕
            </button>

            <div className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setShowSidebar(false)}>
                <div className="flex items-center transition-transform transform hover:translate-x-2">
                  <AiOutlineHome className="mr-2" size={26} />
                  <span>HOME</span>
                </div>
              </Link>

              <Link to="/shop" onClick={() => setShowSidebar(false)}>
                <div className="flex items-center transition-transform transform hover:translate-x-2">
                  <AiOutlineShopping className="mr-2" size={26} />
                  <span>SHOP</span>
                </div>
              </Link>

              <Link to="/favorite" onClick={() => setShowSidebar(false)}>
                <div className="flex items-center transition-transform transform hover:translate-x-2">
                  <FaHeart className="mr-2" size={20} />
                  <span>FAVORITES</span>
                  <FavoritesCount />
                </div>
              </Link>

              <hr className="my-4 border-gray-600" />

              {userInfo ? (
                <>
                  <Link to="/profile" onClick={() => setShowSidebar(false)}>
                    <span className="block px-4 py-2 hover:bg-gray-800 rounded">
                      Profile
                    </span>
                  </Link>

                  {userInfo.isAdmin && (
                    <>
                      <Link to="/admin/dashboard" onClick={() => setShowSidebar(false)}>
                        <span className="block px-4 py-2 hover:bg-gray-800 rounded">
                          Dashboard
                        </span>
                      </Link>
                      <Link to="/admin/productlist" onClick={() => setShowSidebar(false)}>
                        <span className="block px-4 py-2 hover:bg-gray-800 rounded">
                          Products
                        </span>
                      </Link>
                      <Link to="/admin/categorylist" onClick={() => setShowSidebar(false)}>
                        <span className="block px-4 py-2 hover:bg-gray-800 rounded">
                          Category
                        </span>
                      </Link>
                      <Link to="/admin/orderlist" onClick={() => setShowSidebar(false)}>
                        <span className="block px-4 py-2 hover:bg-gray-800 rounded">
                          Orders
                        </span>
                      </Link>
                      <Link to="/admin/userlist" onClick={() => setShowSidebar(false)}>
                        <span className="block px-4 py-2 hover:bg-gray-800 rounded">
                          Users
                        </span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      logoutHandler();
                      setShowSidebar(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-800 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setShowSidebar(false)}>
                    <div className="flex items-center transition-transform transform hover:translate-x-2">
                      <AiOutlineLogin className="mr-2" size={26} />
                      <span>LOGIN</span>
                    </div>
                  </Link>
                  <Link to="/register" onClick={() => setShowSidebar(false)}>
                    <div className="flex items-center transition-transform transform hover:translate-x-2">
                      <AiOutlineUserAdd className="mr-2" size={26} />
                      <span>REGISTER</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
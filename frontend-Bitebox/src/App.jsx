import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SearchBar from "./components/Searchbar.jsx";
import EditProfile from "./pages/account/editProfile.jsx";
import ForgotPassword from "./pages/account/forgetPassword.jsx";
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";
import ResetPassword from "./pages/account/resetPassword.jsx";
import AboutUs from "./pages/homepage/AboutUs.jsx";
import ContactUs from "./pages/homepage/ContactUs.jsx";
import Dashboard from "./pages/homepage/Dashboard.jsx";
import RecipeDetails from "./pages/homepage/RecipeDetails.jsx";

import Failure from "./pages/payment/Failure.jsx";
import Success from "./pages/payment/Success.jsx";
import AddRecipes from "./pages/private/AddRecipes.jsx";
import AdminDashboard from "./pages/private/AdminDashboard.jsx";
import EditUser from "./pages/private/EditUser.jsx";
import Profile from "./pages/private/Profile.jsx";
import UserProfile from "./pages/private/UserProfile.jsx";

import Recipes from "./pages/homepage/Recipes.jsx";
import Cart from "./pages/homepage/Cart.jsx";
import Checkout from "./pages/homepage/Checkout.jsx";
import EditRecipe from "./pages/private/EditRecipe.jsx";
import SavedRecipesPage from "./pages/homepage/SavedRecipesPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/searchbar" element={<SearchBar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit-profile/:id" element={<EditProfile />} />
            <Route path="/adminDash" element={<AdminDashboard />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/recipe-details/:id" element={<RecipeDetails />} />
            <Route path="/saved-recipes" element={<SavedRecipesPage />} />
            <Route path="/addRecipes" element={<AddRecipes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/editRecipe/:id" element={<EditRecipe />} />
            <Route path="/edit-user/:id" element={<EditUser />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failure" element={<Failure />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;

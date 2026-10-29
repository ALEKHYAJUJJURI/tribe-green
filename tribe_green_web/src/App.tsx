
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ThankYouPage from "./pages/ThankYouPage";
import NotFoundPage from "./pages/NotFoundPage";
import EnquiryPage from "./pages/EnquiryPage";
import ScrollToTop from "./components/layout/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:slug" element={<ProductDetailsPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/enquiry" element={<EnquiryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

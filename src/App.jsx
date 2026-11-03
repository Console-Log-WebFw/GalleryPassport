/* App.jsx: 주소(URL)에 따라 어떤 페이지를 보여줄지 정하는 곳 - 모든 페이지는 Layout(헤더 포함) 안에 들어감 */

import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/Home/HomePage";
import GalleryPage from "./pages/Gallery/GalleryPage";
import PassportPage from "./pages/Passport/PassportPage";
import AboutPage from "./pages/About/AboutPage";

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/gallery/:museumId" element={<GalleryPage />} />
      <Route path="/passport" element={<PassportPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Route>
  </Routes>
);

export default App;

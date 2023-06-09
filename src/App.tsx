import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import LottieConfigure from "./pages/LottieConfigure";
import LottieEditor from "./pages/LottieEditor";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <BrowserRouter basename="toing-lottie-editor">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<LottieEditor />} /> */}
          <Route index element={<Navigate to="/editor" />} />
          <Route path="editor" element={<LottieEditor />} />
          <Route path="config" element={<LottieConfigure />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

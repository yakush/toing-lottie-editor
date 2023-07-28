import {
  HashRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import Layout from "./Layout";
import LottieConfigurePage from "./pages/LottieConfigurePage";
import LottieEditorPage from "./pages/LottieEditorPage";
import NoPage from "./pages/NoPage";

function App() {
  return (
    /*<BrowserRouter basename="toing-lottie-editor" >*/
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<LottieEditor />} /> */}
          <Route index element={<Navigate to="/config" />} />
          <Route path="editor" element={<LottieEditorPage />} />
          <Route path="config" element={<LottieConfigurePage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </HashRouter>
    /*</BrowserRouter>*/
  );
}

export default App;

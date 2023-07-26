import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import FileDropTarget from "../components/FileDropTarget";
import { useLottieStore } from "../lib/lottie/app";

const Layout = () => {
  const loadLottieFile = useLottieStore((state) => state.loadFile);
  return (
    <div className={styles.Layout}>
      <header>
        <div>TOING</div>
        <nav className={styles.AppNav}>
          <ul>
            <li>
              <Link to="config">configure</Link>
            </li>
            <li>
              <Link to="editor">editor</Link>
            </li>
          </ul>
        </nav>
        <FileDropTarget onDrop={(fileList) => loadLottieFile(fileList[0])}>
          drop file here
        </FileDropTarget>
      </header>

      <main>
        <div className={styles.outletWrapper}>
          <Outlet />
        </div>
      </main>

      <footer>Made by Y@K</footer>
    </div>
  );
};

export default Layout;

import { Link, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import FilesLoader from "./components/FilesLoader";

const Layout = () => {
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
      </header>

      <main>
        <FilesLoader />
        <div className={styles.outletWrapper}>
          <Outlet />
        </div>
      </main>

      <footer>Made by Y@K</footer>
    </div>
  );
};

export default Layout;

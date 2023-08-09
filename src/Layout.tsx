import { Link, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import FilesLoader from "./components/FilesLoader";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

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
            <li>
              <Link to="test">test</Link>
            </li>
            <li>
              <Link to="demo">DEMO</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {location.pathname !== "/demo" && <FilesLoader />}
        <div className={styles.outletWrapper}>
          <Outlet />
        </div>
      </main>

      <footer>Made by Y@K</footer>
    </div>
  );
};

export default Layout;

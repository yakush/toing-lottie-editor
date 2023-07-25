import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import FileDropTarget from "../components/FileDropTarget";

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
        <FileDropTarget onDrop={console.log} />
        <div className={styles.outletWrapper}>
          <Outlet />
        </div>
      </main>

      <footer>Made by Y@K</footer>
    </div>
  );
};

export default Layout;

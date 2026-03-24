import routes from "../lib/routes";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const location = useLocation();

  const isInPath = (path) => {
    if (path === "/") {
      return location.pathname === path;
    } else {
      return location.pathname.startsWith(path);
    }
  };

  return (
    <nav className="fixed min-w-full max-h-13 p-1 flex justify-center space-x-6 bg-blue-100">
      {routes.map(({ name, path, icon }) => (
        <div
          key={path}
          className={`m-1 p-1 px-3 rounded-xl duration-300 ${
            isInPath(path) ? "bg-blue-400/50" : ""
          }`}
        >
          <Link
            to={path}
            className="flex text-xl font-medium items-center space-x-1"
          >
            {icon}
            <p>{name}</p>
          </Link>
        </div>
      ))}
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </nav>
  );
}

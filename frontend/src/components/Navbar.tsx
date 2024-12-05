import { Link } from "react-router-dom";
import { Home, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Surge Social
          </Link>
          <div className="flex space-x-4">
            <Link to="/timeline" className="text-gray-600 hover:text-gray-800">
              <Home className="w-6 h-6" />
            </Link>
            <Link
              to="/profile/me"
              className="text-gray-600 hover:text-gray-800"
            >
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

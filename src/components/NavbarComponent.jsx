import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <span className="text-xl font-bold">EMIS</span>
        <div>
          {user && (
            <>
              <span className="mr-4">Welcome, {user.role}</span>
              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => navigate('/clients')}
                    className="mr-4 hover:underline"
                  >
                    Clients
                  </button>
                  <button
                    onClick={() => navigate('/workers')}
                    className="mr-4 hover:underline"
                  >
                    Workers
                  </button>
                </>
              )}
              {user.role === 'worker' && (
                <button
                  onClick={() => navigate('/services')}
                  className="mr-4 hover:underline"
                >
                  Services
                </button>
              )}
              {user.role === 'client' && (
                <button
                  onClick={() => navigate('/bookings')}
                  className="mr-4 hover:underline"
                >
                  Bookings
                </button>
              )}
              <button
                onClick={() => navigate('/payment')}
                className="mr-4 hover:underline"
              >
                Payment
              </button>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
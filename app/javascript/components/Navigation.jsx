import React from 'react';
import { Navbar, Button } from 'flowbite-react';
import { HiUser, HiLogout } from 'react-icons/hi';

const Navigation = ({ currentUser, onLogout }) => {
  return (
    <Navbar fluid>
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Newapp
        </span>
      </Navbar.Brand>
      
      <div className="flex md:order-2">
        {currentUser ? (
          <>
            <span className="mr-4 self-center text-sm text-gray-700 dark:text-gray-300">
              Welcome, {currentUser.email}
            </span>
            <Button 
              size="sm" 
              color="gray" 
              onClick={onLogout}
              className="mr-2"
            >
              <HiLogout className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button size="sm" color="blue" href="/dashboard">
              <HiUser className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" color="gray" href="/users/sign_in" className="mr-2">
              Login
            </Button>
            <Button size="sm" color="blue" href="/users/sign_up">
              Register
            </Button>
          </>
        )}
        <Navbar.Toggle />
      </div>
      
      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="/tests">
          Tests
        </Navbar.Link>
        {currentUser && (
          <>
            <Navbar.Link href="/dashboard">
              Dashboard
            </Navbar.Link>
            <Navbar.Link href="/users/edit">
              Profile
            </Navbar.Link>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Container>
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
          <h2 className="sectiontitle mb-4">Access Denied</h2>
          <p className="description mb-8 max-w-md mx-auto">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <Button variant="primary">Go Home</Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Unauthorized;

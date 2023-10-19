// ProtectedPage.js
import React, { useState, useEffect, FC, FormEvent } from 'react';
import styles from './index.module.scss'

interface ILockProps {
  component: any
}

const Lock: FC<ILockProps> = ({ component }) => {
  const [code, setCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleCodeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Replace 'yourCorrectCode' with your desired correct code
    if (code === '18029jdkj!pakmsdkl1iopks!asda./') {
      const expirationDate = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; // Set expiration to 7 days from now
      localStorage.setItem('authorized', JSON.stringify({ code, expirationDate }));
      setIsAuthorized(true);
    } else {
      setAttempts((prevAttempts) => prevAttempts + 1);
    }
  };

  useEffect(() => {
    const authorizedData = localStorage.getItem('authorized');
    if (authorizedData) {
      const { code: storedCode, expirationDate } = JSON.parse(authorizedData);
      if (expirationDate > new Date().getTime()) {
        setCode(storedCode);
        setIsAuthorized(true);
      }
    }

    if (attempts >= 5) {
      const expirationDate = new Date().getTime() + 24 * 60 * 60 * 1000; // Set expiration to 1 day from now
      localStorage.setItem('limitExceeded', JSON.stringify({ expirationDate }));
      setIsAuthorized(false);
    }
  }, [attempts]);

  useEffect(() => {
    const limitExceededData = localStorage.getItem('limitExceeded');
    if (limitExceededData) {
      const { expirationDate } = JSON.parse(limitExceededData);
      if (expirationDate > new Date().getTime()) {
        setIsAuthorized(false);
      }
    }
  }, []);

  if (isAuthorized) {
    // Render the protected content here
    return (
       component 
    );
  }

  const limitExceededData = localStorage.getItem('limitExceeded');
  if (limitExceededData) {
    const { expirationDate } = JSON.parse(limitExceededData);
    if (expirationDate > new Date().getTime()) {
      // Render the limit exceeded page here
      return (
        <div className="limit-exceeded-page">
          <h1>Code Input Limit Exceeded</h1>
          <p>You have exceeded the maximum number of code input attempts.</p>
          <p>Please try again after 24 hours.</p>
        </div>
      );
    }
  }

  return (
    <div className={styles.protected_page}>
      <h1>Welcome</h1>
      {attempts < 5 ? (
        <>
          <p>Please enter the correct code to access the content:</p>
          <form onSubmit={handleCodeSubmit}>
            <input type="text" value={code} onChange={handleCodeChange} />
            <button type="submit">Submit</button>
          </form>
        </>
      ) : (
        <p>Code input limit exceeded. Please try again after 24 hours.</p>
      )}
    </div>
  );
};

export default Lock;

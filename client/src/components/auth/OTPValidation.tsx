import React, { useState } from 'react';

const OTPValidation = ({ onSuccess }: { onSuccess: () => void }): JSX.Element => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleValidateOTP = async (): Promise<void> => {
    try {
      const response = await fetch('/api/validateOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage('OTP validated successfully.');
        onSuccess(); // Unlock the app
      } else {
        setMessage(data.error || 'Unable to validate OTP.');
      }
    } catch {
      setMessage('Failed to validate OTP. Please try again later.');
    }
  };

  return (
    <div>
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleValidateOTP}>Validate OTP</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OTPValidation;

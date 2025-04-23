// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
export const validateDisplayName = async (displayName: string): Promise<string[]> => {
  try {
    const response = await fetch('/api/validateDisplayName', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName })
    });

    if (response.status === 200) {
      return []; // No errors
    }

    const data = await response.json();
    return data.errors || ['An unknown error occurred.'];
  } catch (error) {
    return ['Failed to validate display name. Please try again later.'];
  }
};

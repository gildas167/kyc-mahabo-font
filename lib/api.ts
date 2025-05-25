const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Public KYC API
export async function submitKycRequest(formData: FormData) {
  const response = await fetch(`${API_URL}/kyc`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit KYC request');
  }
  
  return response.json();
}

export async function getKycStatus(publicId: string) {
  const response = await fetch(`${API_URL}/kyc/${publicId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch KYC status');
  }
  
  return response.json();
}

export async function requestEditCode(publicId: string) {
  const response = await fetch(`${API_URL}/kyc/${publicId}/send-edit-code`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to request edit code');
  }
  
  return response.json();
}

export async function updateKycRequest(publicId: string, data: any) {
  const response = await fetch(`${API_URL}/kyc/${publicId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update KYC request');
  }
  
  return response.json();
}

// Admin API
export async function requestLoginCode(email: string) {
  const response = await fetch(`${API_URL}/admin/request-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to request login code');
  }
  
  return response.json();
}

export async function adminLogin(email: string, code: string) {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to login');
  }
  
  return response.json();
}

export async function getAllKycRequests(token: string) {
  const response = await fetch(`${API_URL}/admin/kyc`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch KYC requests');
  }
  
  return response.json();
}

export async function getKycRequestById(id: string, token: string) {
  const response = await fetch(`${API_URL}/admin/kyc/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch KYC request');
  }
  
  return response.json();
}

export async function updateKycStatus(id: string, status: string, token: string) {
  const response = await fetch(`${API_URL}/admin/kyc/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update KYC status');
  }
  
  return response.json();
}

export async function deleteKycRequest(id: string, token: string) {
  const response = await fetch(`${API_URL}/admin/kyc/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete KYC request');
  }
  
  return response.json();
}
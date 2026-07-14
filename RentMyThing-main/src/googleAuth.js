/**
 * Google Sign-In Integration using Google Identity Services (GSI Token Client v2)
 * Uses window.google.accounts.oauth2.initTokenClient to open the real Google account chooser
 * without needing a redirect_uri (prevents Error 400: redirect_uri_mismatch).
 */

export function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('RENTMYTHING_GOOGLE_CLIENT_ID') || '';
}

export function saveGoogleClientId(clientId) {
  if (clientId) {
    localStorage.setItem('RENTMYTHING_GOOGLE_CLIENT_ID', clientId.trim());
  } else {
    localStorage.removeItem('RENTMYTHING_GOOGLE_CLIENT_ID');
  }
}

/**
 * Trigger real Google Sign-In popup displaying the user's Chrome accounts
 * Uses OAuth Token Client to avoid redirect_uri_mismatch errors.
 */
export function triggerGoogleSignIn(onSuccess, onError) {
  const clientId = getGoogleClientId();

  if (!clientId) {
    onError(new Error('MISSING_CLIENT_ID'));
    return;
  }

  // 1. Prefer modern Google OAuth2 Token Client (JavaScript popup - NO redirect_uri mismatch possible)
  if (window.google?.accounts?.oauth2) {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              // Fetch real user details from Google userinfo API
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const userInfo = await res.json();
              onSuccess({
                email: userInfo.email,
                name: userInfo.name || userInfo.email.split('@')[0],
                picture: userInfo.picture,
                sub: userInfo.sub || userInfo.email,
              });
            } catch (err) {
              onError(new Error('Failed to fetch Google profile info: ' + err.message));
            }
          } else if (tokenResponse.error) {
            onError(new Error(tokenResponse.error_description || tokenResponse.error));
          }
        },
      });

      // Prompt native account chooser popup showing Chrome accounts
      tokenClient.requestAccessToken({ prompt: 'select_account' });
      return;
    } catch (err) {
      console.warn('Token client init error, falling back:', err);
    }
  }

  // 2. Fallback to Google ID Token initialize if oauth2 tokenClient is unavailable
  if (window.google?.accounts?.id) {
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) {
            const decoded = decodeGoogleJWT(response.credential);
            if (decoded) {
              onSuccess(decoded);
            } else {
              onError(new Error('Failed to decode Google credential token.'));
            }
          }
        },
      });
      window.google.accounts.id.prompt();
    } catch (err) {
      onError(err);
    }
  } else {
    onError(new Error('Google Identity Services script not loaded yet. Please refresh the page.'));
  }
}

/**
 * Decode Google JWT credential token payload
 */
function decodeGoogleJWT(credential) {
  try {
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT decode failed:', e);
    return null;
  }
}

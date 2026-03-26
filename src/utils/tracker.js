import { supabase } from '../lib/supabase';

// Helper to generate a unique session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('portfolio_session_id', sessionId);
  }
  return sessionId;
};

// Main tracking function
export const trackVisit = async () => {
  try {
    // 1. Get basic info
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const referrer = document.referrer;
    const currentPage = window.location.pathname + window.location.hash;
    const sessionId = getSessionId();

    // 2. Get IP and Geo info using a more reliable API (ipapi.co)
    let geoInfo = {};
    try {
      // Use ipapi.co with a fallback to ip-api.com
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        geoInfo = await response.json();
      } else {
        // Fallback API if the first one fails
        const fallback = await fetch('https://ip-api.com/json/');
        geoInfo = await fallback.json();
        // Standardize fields from fallback
        geoInfo.ip = geoInfo.query;
        geoInfo.country_name = geoInfo.country;
      }
    } catch (e) {
      console.warn('Geo tracking blocked or failed', e);
    }

    // 3. Detect Device/OS/Browser (Basic)
    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return "mobile";
      return "desktop";
    };

    const data = {
      session_id: sessionId,
      ip_address: geoInfo.ip || 'Unknown',
      user_agent: userAgent,
      device_type: getDeviceType(),
      browser: geoInfo.version || 'Unknown', // Basic fallback
      os: geoInfo.org || 'Unknown', // Basic fallback
      language,
      screen_resolution: screenResolution,
      timezone,
      country: geoInfo.country_name || 'Unknown',
      city: geoInfo.city || 'Unknown',
      region: geoInfo.region || 'Unknown',
      latitude: geoInfo.latitude?.toString(),
      longitude: geoInfo.longitude?.toString(),
      referrer,
      current_page: currentPage,
      actions: [{ type: 'page_view', timestamp: new Date().toISOString(), page: currentPage }]
    };

    // 4. Save to Supabase
    const { error } = await supabase.from('visits').insert([data]);
    if (error) throw error;

    return sessionId;
  } catch (error) {
    console.error('Tracking failed:', error);
  }
};

// Function to track specific actions (section views, clicks)
export const trackAction = async (actionType, details = {}) => {
  try {
    const sessionId = getSessionId();
    if (!sessionId) return;

    // Get the current record for this session
    const { data: currentVisit, error: fetchError } = await supabase
      .from('visits')
      .select('id, actions')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !currentVisit) return;

    const updatedActions = [
      ...(currentVisit.actions || []),
      { type: actionType, timestamp: new Date().toISOString(), ...details }
    ];

    await supabase
      .from('visits')
      .update({ actions: updatedActions })
      .eq('id', currentVisit.id);

  } catch (error) {
    console.warn('Action tracking failed:', error);
  }
};

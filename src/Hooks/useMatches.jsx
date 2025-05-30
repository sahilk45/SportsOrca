import { useState, useEffect, useCallback } from 'react';

// Custom hook for fetching matches
const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  // Using environment variables instead of hardcoded values
  const CORS_PROXY = 'https://api.allorigins.win/get?url=';
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = `${API_BASE_URL}/competitions/PL/matches`;

  const demoMatches = [
    {
      id: 'demo-1',
      homeTeam: { 
        name: 'Manchester United', 
        shortName: 'Man United',
        crest: 'https://crests.football-data.org/66.png'
      },
      awayTeam: { 
        name: 'Liverpool', 
        shortName: 'Liverpool',
        crest: 'https://crests.football-data.org/64.png'
      },
      utcDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      matchday: 15,
      venue: 'Old Trafford',
      status: 'SCHEDULED'
    },
    {
      id: 'demo-2',
      homeTeam: { 
        name: 'Arsenal', 
        shortName: 'Arsenal',
        crest: 'https://crests.football-data.org/57.png'
      },
      awayTeam: { 
        name: 'Chelsea', 
        shortName: 'Chelsea',
        crest: 'https://crests.football-data.org/61.png'
      },
      utcDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      matchday: 15,
      venue: 'Emirates Stadium',
      status: 'SCHEDULED'
    },
    {
      id: 'demo-3',
      homeTeam: { 
        name: 'Manchester City', 
        shortName: 'Man City',
        crest: 'https://crests.football-data.org/65.png'
      },
      awayTeam: { 
        name: 'Tottenham Hotspur', 
        shortName: 'Spurs',
        crest: 'https://crests.football-data.org/73.png'
      },
      utcDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      matchday: 15,
      venue: 'Etihad Stadium',
      status: 'SCHEDULED'
    },
    {
      id: 'demo-4',
      homeTeam: { 
        name: 'Newcastle United', 
        shortName: 'Newcastle',
        crest: 'https://crests.football-data.org/67.png'
      },
      awayTeam: { 
        name: 'Brighton & Hove Albion', 
        shortName: 'Brighton',
        crest: 'https://crests.football-data.org/397.png'
      },
      utcDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      matchday: 15,
      venue: 'St. James Park',
      status: 'SCHEDULED'
    },
    {
      id: 'demo-5',
      homeTeam: { 
        name: 'West Ham United', 
        shortName: 'West Ham',
        crest: 'https://crests.football-data.org/563.png'
      },
      awayTeam: { 
        name: 'Aston Villa', 
        shortName: 'Aston Villa',
        crest: 'https://crests.football-data.org/58.png'
      },
      utcDate: new Date(Date.now() + 86400000 * 6).toISOString(),
      matchday: 15,
      venue: 'London Stadium',
      status: 'SCHEDULED'
    }
  ];

  const fetchMatches = useCallback(async () => {
    // Check if environment variables are loaded
    if (!API_BASE_URL || !API_KEY) {
      console.error('❌ Environment variables not loaded. Please check your .env file.');
      setError('Environment variables not configured');
      setMatches(demoMatches);
      setIsUsingDemoData(true);
      setApiStatus('env-error');
      setLoading(false);
      return;
    }

    console.log('🔍 MENTOR NOTE: Attempting to fetch live Premier League fixtures...');
    console.log('📅 Current Date:', new Date().toLocaleDateString());
    console.log('⚽ Season Status: 2024/25 ended May 25, 2025');
    console.log('📊 Next fixtures release: June 18, 2025');
    console.log('🔧 Using API URL from env:', API_BASE_URL);

    try {
      setLoading(true);
      setError(null);
      setApiStatus('connecting');

      // Try direct API call first
      const directUrl = `${API_URL}?status=SCHEDULED&limit=10`;
      console.log('🌐 Attempting direct API call to:', directUrl);
      
      let response;
      let data;

      try {
        // Direct API call
        response = await fetch(directUrl, {
          headers: {
            'X-Auth-Token': API_KEY,
          },
        });

        if (response.ok) {
          data = await response.json();
          console.log('✅ Direct API call successful');
        } else {
          throw new Error(`Direct API failed: ${response.status}`);
        }
      } catch (directError) {
        console.log('⚠️ Direct API failed, trying CORS proxy...');
        
        // Try with CORS proxy
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(directUrl)}`;
        response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`Proxy request failed: ${response.status}`);
        }

        const proxyData = await response.json();
        data = JSON.parse(proxyData.contents);
        console.log('✅ CORS proxy successful');
      }

      console.log('📊 API Response:', data);
      console.log('🔢 Total matches in response:', data.matches?.length || 0);

      if (data.matches && data.matches.length > 0) {
        // Filter for upcoming matches
        const upcomingMatches = data.matches
          .filter(match => new Date(match.utcDate) > new Date())
          .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
          .slice(0, 8);

        console.log('⏰ Upcoming matches found:', upcomingMatches.length);

        if (upcomingMatches.length > 0) {
          setMatches(upcomingMatches);
          setIsUsingDemoData(false);
          setApiStatus('success');
          console.log('🎯 Using live data from API');
          return;
        }
      }

      // No upcoming matches found - expected during off-season
      console.log('⚠️ No upcoming fixtures found - this is EXPECTED during off-season');
      console.log('🔄 Switching to demo data to demonstrate UI functionality');
      
      setMatches(demoMatches);
      setIsUsingDemoData(true);
      setApiStatus('no-fixtures');

    } catch (err) {
      console.error('❌ API Error (this demonstrates error handling):', err.message);
      console.log('🔄 Falling back to demo data');
      
      setError(err.message);
      setMatches(demoMatches);
      setIsUsingDemoData(true);
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  }, [API_URL, API_KEY, API_BASE_URL, CORS_PROXY]); // Updated dependencies

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const refetch = useCallback(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, loading, error, refetch, isUsingDemoData, apiStatus };
};

export default useMatches;
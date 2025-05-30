import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatMatchDate, getRelativeTime } from '../Utils/dateUtils';
const MatchCard = ({ match }) => {
  const { homeTeam, awayTeam, utcDate, venue, matchday, competition } = match;

  return (
    <div className="match-card">
      <div className="match-header">
        <div className="match-info">
          <span className="matchday">Matchday {matchday}</span>
          <span className="competition">{competition?.name || 'Premier League'}</span>
        </div>
      </div>

      <div className="teams-container">
        <div className="team home-team">
          <div className="team-crest">
            {homeTeam.crest ? (
              <img 
                src={homeTeam.crest} 
                alt={`${homeTeam.name} crest`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="team-initial" style={{ display: homeTeam.crest ? 'none' : 'flex' }}>
              {homeTeam.shortName?.[0] || homeTeam.name?.[0] || 'H'}
            </div>
          </div>
          <span className="team-name">{homeTeam.shortName || homeTeam.name}</span>
        </div>

        <div className="vs-section">
          <span className="vs-text">VS</span>
        </div>

        <div className="team away-team">
          <div className="team-crest">
            {awayTeam.crest ? (
              <img 
                src={awayTeam.crest} 
                alt={`${awayTeam.name} crest`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="team-initial" style={{ display: awayTeam.crest ? 'none' : 'flex' }}>
              {awayTeam.shortName?.[0] || awayTeam.name?.[0] || 'A'}
            </div>
          </div>
          <span className="team-name">{awayTeam.shortName || awayTeam.name}</span>
        </div>
      </div>

      <div className="match-details">
        <div className="detail-item">
          <Calendar size={16} />
          <span>{formatMatchDate(utcDate)}</span>
        </div>
        <div className="detail-item">
          <Clock size={16} />
          <span>{getRelativeTime(utcDate)}</span>
        </div>
        {venue && (
          <div className="detail-item">
            <MapPin size={16} />
            <span>{venue}</span>
          </div>
        )}
      </div>

      <div className="match-card-overlay"></div>
    </div>
  );
};

export default MatchCard;
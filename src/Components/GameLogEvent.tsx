import React, { useEffect, useState } from 'react';
import { AwayTeam, GameLogsUpdate, HomeTeam } from '../Interfaces/SingleGameEvents';

// Type
// GK_start, Goal, Penalty

interface GameLogEventProps {
    AwayTeam: AwayTeam;
    Event: GameLogsUpdate;
    HomeTeam: HomeTeam;
}

const GameLogEvent = () => {
    return (
        <div>Event.Key?.toString()</div>
    );
};

export default GameLogEvent;
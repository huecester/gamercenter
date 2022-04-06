import { SanitizedPlayers } from './player';

export interface JoinData {
	username: string,
	id: string,
	password?: string,
}

export type JoinResult = JoinSuccess | JoinFailure;


export interface JoinSuccess {
	players: SanitizedPlayers,
}


export interface JoinFailure {
	err: JoinError,
}

export enum JoinError {
	NOUSERNAME,
	NOTFOUND,
	BADPASS,
}

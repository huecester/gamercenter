export type JoinData = JoinSuccess | JoinFailure;

export interface JoinSuccess {
	
}

export interface JoinFailure {
	err: JoinError;
}

export enum JoinError {
	UNKNOWN,
	NOTFOUND,
	ROOMFULL,
}

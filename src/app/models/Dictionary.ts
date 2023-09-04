import { ITupleResult } from './dto/interfaces/ITupleResult';

export class Dictionary {
	Entries: Array<Entry>;
}
export class Entry {
	ArtifactType: string;
	Tuple: ITupleResult;
}
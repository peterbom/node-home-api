
const SELECTION_PATH = "/mnt/photo_staging/ready_to_move";

export class StagingPhotoDataAccess {
	constructor (fileFinder) {
		this._fileFinder = fileFinder;
	}

	async getAllFiles () {
		return await this._fileFinder.find(
			SELECTION_PATH,
			/^(?!.*\.db$)/,
			[/.*\/@.*/, /.*\.db/]);
	}
}
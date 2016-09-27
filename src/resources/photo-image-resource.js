import {Log} from "../shared/log";

export class PhotoImageResource {
    constructor (photoImageServices) {
        this._photoImageServices = photoImageServices;
    }

    async getById (ctx) {
        let id = ctx.params.id;
        let image = await this._photoImageServices.getById(id);
        if (!image) {
            ctx.status = 404;
            return;
        }

        ctx.body = image;
        ctx.status = 200;
    }

    async query (ctx) {
        if (!ctx.query || !ctx.query.json) {
            ctx.status = 400;
            return;
        }

        /*
        json: {
            preset: [string],  // "unreadable", "missingTakenDate"
            summary: {
                counts: [bool],
                yearlyTotals: [bool]
            },
            criteria: {
                path: [string],
                fromDateTime: [Date],
                toDateTime: [Date]
            },
            return: {
                id: [bool],
                takenDateTime: [bool],
                tags: [bool],
                hash: [bool],
                path: [bool]
            }  // if unspecified, return all
        }
        */
        let query = JSON.parse(ctx.query.json);

        if (query.summary) {
            ctx.body = {};
            if (query.summary.counts) {
                Object.assign(ctx.body, await this._photoImageServices.getSummaryCounts());
            }

            if (query.summary.yearlyTotals) {
                Object.assign(ctx.body, {
                    yearlyTotals: await this._photoImageServices.getYearlyTotals()
                });
            }

            return;
        }

        // Add images to a map keyed on 'id' to revent duplicates
        let imageLookup = {};
        let addImages = images => {
            for (let image of images) {
                let returnImage = image;
                if (query.return) {
                    returnImage = {};
                    for (let propertyName in query.return) {
                        returnImage[propertyName] = propertyName.split('.').reduce((a, b) => a[b], image);
                    }
                }

                imageLookup[image.id] = returnImage;
            }
        };

        if (query.preset) {
            switch (query.preset) {
                case "unreadable":
                    addImages(await this._photoImageServices.findUnreadable());
                    break;
                case "missingTakenDate":
                    addImages(await this._photoImageServices.findMissingTakenDate());
                    break;
                default:
                    throw new Error(`Unexpected preset: ${query.preset}`);
            }
        } else if (query.criteria) {
            addImages(await this._photoImageServices.findByCriteria(query.criteria));
        }

        // Construct array to return
        let images = [];
        for (let id in imageLookup) {
            images.push(imageLookup[id]);
        }

        // Sort by taken date, then by id
        images.sort((a, b) => {
            if (a.takenDateTime && b.takenDateTime) {
                return a.takenDateTime - b.takenDateTime;
            }

            if (a.takenDateTime) {
                return 1;
            }

            if (b.takenDateTime) {
                return -1;
            }

            // Two ids will never be the same
            return a.id < b.id ? -1 : 1;
        });

        ctx.body = images;
    }
}
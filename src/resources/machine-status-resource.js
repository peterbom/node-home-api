import ping from "ping";
import promisify from "promisify-node";

let wol = promisify("wake_on_lan");

export class MachineStatusResource {
    constructor(machineLookup) {
        this._machineLookup = machineLookup;
    }

    async query(ctx) {
        let ipAddress = this._machineLookup[ctx.params.id].ipAddress;

        // https://www.npmjs.com/package/ping
        let response = await ping.promise.probe(ipAddress, {
            timeout: 2,
            numeric: false
        });

        if (response.alive) {
            return {
                status: "online"
            };
        }

        return {
            status: "offline"
        };
    }

    async request(ctx) {
        let machineDetails = this._machineLookup[ctx.params.id];
        let requestedStatus = ctx.request.body.status;

        switch (requestedStatus) {
            case "online":
                await requestOnline(machineDetails.macAddress);
                break;
            case "offline":
                await requestOffline(machineDetails.ipAddress);
                break;
        }

        ctx.status = 200;
    }
}

async function requestOnline(macAddress) {
    await wol.wake(macAddress, {
        address: "192.168.1.255"
    });
}

async function requestOffline(ipAddress) {

}
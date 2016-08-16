import promisify from "promisify-node";

let wol = promisify("wake_on_lan");

export class WolResource {
    constructor(macAddressLookup) {
        this._macAddressLookup = macAddressLookup;
    }

    async send(ctx) {
        let macAddress = this._macAddressLookup[ctx.params.id];
        await wol.wake(macAddress, {
            address: "192.168.1.255"
        });

        ctx.status = 200;
    }
}


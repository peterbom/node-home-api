const Log = require("../../src/shared/log").Log;
const timekeeper = require("timekeeper");

/*
# Generating a self-signed certificate ( https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl )

# Windows
openssl req -x509 -nodes -subj "//C=US\ST=Oregon\L=Portland\O=Company Name\OU=Org\CN=www.example.com" -newkey rsa:4096 -keyout test/utils/key.pem -out test/utils/cert.pem -days 3650

# Linux
openssl req -x509 -nodes -subj "/C=US/ST=Oregon/L=Portland/O=Company Name/OU=Org/CN=www.example.com" -newkey rsa:4096 -keyout test/utils/key.pem -out test/utils/cert.pem -days 3650
*/

const KeyId = "FAKE_SIGNING_KEY";
const PublicKey = "MIIFszCCA5ugAwIBAgIJAPIEnqgZedjFMA0GCSqGSIb3DQEBCwUAMHAxCzAJBgNVBAYTAlVTMQ8wDQYDVQQIDAZPcmVnb24xETAPBgNVBAcMCFBvcnRsYW5kMRUwEwYDVQQKDAxDb21wYW55IE5hbWUxDDAKBgNVBAsMA09yZzEYMBYGA1UEAwwPd3d3LmV4YW1wbGUuY29tMB4XDTE3MDkxNzIxMjYwM1oXDTI3MDkxNTIxMjYwM1owcDELMAkGA1UEBhMCVVMxDzANBgNVBAgMBk9yZWdvbjERMA8GA1UEBwwIUG9ydGxhbmQxFTATBgNVBAoMDENvbXBhbnkgTmFtZTEMMAoGA1UECwwDT3JnMRgwFgYDVQQDDA93d3cuZXhhbXBsZS5jb20wggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDMKL4Hxr06+LHIZr4MYMXxRLm9Bh9/LWeLgRIscRsl9W64UZ5V333Guv+wDR3xc1JgktpwsSgBgZLHNeGL8za+T7izsAdz5nSa3ITOjQgHEzZ2WpYWQP85vzRf90U80pMf3czuPqIUt+iY1Ny9hmBNDBAh7VHHtP1+ro8X/NQQ4hZ10Q5dKeorO6EHp+XUQmPjlU9ZbupTESEAR/4oy9HMUKIEIbKh/Ag5ws2PWa4pe+0VMUTT9lHGmuxrkKAyE9EL4bMmy47tGS3rEpvNW22ydo5ucyldQk6iQDeTWdafy7jjoURylWlEMEoRKEq6iH3QMfZ+4DcR29ST7KHvy6bHeDbOeikMGf9SnjkpeoDOngXN2rYJqFX16ivJQXXO2BRK0535R1kKrF1Pm9WiQGZus5hq88NX82t7hAadwg31DaFMtl5a9mvC+LVzt20OHY/oskql3AIY15CTu03H4b/t5yHHCm87JqNz793Y5FYKXiRMILWSqfDcFb9iNqLm+1XEAwZHKBVfr8FWvi7anDT5fQzS/JePXfI+1riVtW+onubJRZ6RKjesgrsB5oJSEcPW/0dTicYkhuSwZ4rJ2WxmJJVocRMetU/JuB1TU24d5A7Y4cUkPduDliiTXt29denZ7Q/nQ5weKC1iKycz6EuX2BSwlQb1n5rW4ieHh3Lk2QIDAQABo1AwTjAdBgNVHQ4EFgQUMk3+lVlniG3B+JqGvYSpJFRk//IwHwYDVR0jBBgwFoAUMk3+lVlniG3B+JqGvYSpJFRk//IwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAgEAdD566vsGIkKu2cqSzVRTixqH86fiS3mmRX/U5SbKG4feTVUCWHkNhtDIQHlrGqKS2QtTeKZpNk4YHBILFym+Mqoc7Tu8Z3JlgQFwzvIij2xWuzAo/ERfx2fJyPLvCit5W+qjun/bQzkyEkty9M1PyGtYbHt5o8ykhUs15djsBjQXXz4WUPpr4a+y43zfMiFmtk5ezYRIfetnFKifoezeVJ0YObUumfKyBXHtQysKNrZ/pW2OtWui7B/kEPQQu//fX4SG4eCw4M9uevU5KNaLmVHAuBjZb1dcrq4TDbAQew/oNL30FttTWZ9skcU383Kd8QQAagpStr1jenBNPD01y0bW1aheI/lrmiBUMCTyYo0hSFoDACfQl7bNju//pl5y9PdKCVItoC8FGcYDlYOBeIeyAYuERWBvfFY2EI15di1U4oGuEES4NqSyVDz6tjwTP1M2/2AAKQSe0ov/q9E3yTD0qlr9q6SM23Nc8LQRTI4+r19Be1dl8WGmafI3R24kktHqFPNzpG7yYKkZi4lOWk/m2S0lvnYyGgYmJSd0W/oDrtuwRxe7A9534B+ANpRY2pXd3esUcTj01b+VudHzeTdckCwiAicv4+WyNTrBnKl8iS6cuT9e80DqnzZ8lQCErRY70RDn60tYoCiV9tyliAKaHPCfIMBYYFxl7NYdWeM=";
const PrivateKey = "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";

exports.configureMockJsonService = (mockJsonService, authJwksUrl) => {
    if (!mockJsonService.jsonResponseLookup) {
        throw new Error("This is intended to be called on a mock JSON service, not a real one.");
    }

    mockJsonService.jsonResponseLookup[authJwksUrl] = {
        keys: [{
            "alg": "RS256",
            "kty": "RSA",
            "use": "sig",
            "x5c": [PublicKey],
            "n": "ANY_VALUE",
            "e": "ANY_VALUE",
            "kid": KeyId,
            "x5t": "NOT_REQUIRED"
        }]
    };
}

exports.createIdToken = (jwtUtils, userId, time, lifetimeInMinutes) => {

    timekeeper.freeze(time || new Date());

    return jwtUtils.signJwt(userId, PrivateKey, KeyId, lifetimeInMinutes || 1);

    timekeeper.reset();
}
import { X509Certificate } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import forge from "node-forge";

type Cert = {
  name: string;
  serialNumber: string;
  fingerprint: string;
  fingerprint256: string;
  validFrom: string;
  validTo: string;
  publicKey: string;
};

(async () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const certsDir = path.join(__dirname, "..", "public", "certs");
  const files = await fs.readdir(certsDir);
  const certs: Cert[] = [];
  for (const f of files) {
    const pem = await fs.readFile(path.join(certsDir, f));
    const cert = new X509Certificate(pem);
    const subject = Object.fromEntries(
      cert.subject.split("\n").map((l) => {
        const idx = l.indexOf("=");
        return [l.slice(0, idx), l.slice(idx + 1).replace(/\\(.)/g, "$1")];
      })
    );
    const asymmetricKeyDetails = cert.publicKey.asymmetricKeyDetails || {};

    let serialNumber = cert.serialNumber.toLowerCase();
    try {
      const forgeCert = forge.pki.certificateFromPem(pem.toString());
      serialNumber = forgeCert.serialNumber;
    } catch {}

    certs.push({
      name: subject.CN || subject.O || "",
      serialNumber,
      fingerprint: cert.fingerprint.replace(/:/g, "").toLowerCase(),
      fingerprint256: cert.fingerprint256.replace(/:/g, "").toLowerCase(),
      validFrom: cert.validFrom,
      validTo: cert.validTo,
      publicKey: `${(cert.publicKey.asymmetricKeyType || "").toUpperCase()} ${
        asymmetricKeyDetails.modulusLength || asymmetricKeyDetails.namedCurve
      }`,
    });
  }
  await fs.writeFile(
    path.join(__dirname, "..", "src", "certs.json"),
    `${JSON.stringify(certs, null, 2)}\n`
  );
})().catch(console.error);

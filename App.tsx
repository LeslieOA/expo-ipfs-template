import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components/native";

import { decodeAddress } from "algosdk";

import { type Version } from "multiformats/cid";
import { CID } from "multiformats/dist/src";
import { digest } from "multiformats/dist/src";
import { sha256 } from "multiformats/hashes/sha2";

const asaInformation = {
  index: 812879542,
  params: {
    creator: "MOSTLYSNUJP7PG6Q3FNJCGGENQXMOH3PXXMIJRFLODLG2DNDBHI7QHJSOE",
    decimals: 0,
    "default-frozen": false,
    manager: "MOSTLYSNUJP7PG6Q3FNJCGGENQXMOH3PXXMIJRFLODLG2DNDBHI7QHJSOE",
    name: "Mostly Frens #2487",
    "name-b64": "TW9zdGx5IEZyZW5zICMyNDg3",
    reserve: "Z3FJXG5DZHE3NJ4I5OQ2NSNXJLD7D2HOZFDG6JIHELYJKNKDCXWBQJUBOE",
    total: 1,
    "unit-name": "MFER2487",
    "unit-name-b64": "TUZFUjI0ODc=",
    url: "template-ipfs://{ipfscid:1:raw:reserve:sha2-256}#arc3",
    "url-b64":
      "dGVtcGxhdGUtaXBmczovL3tpcGZzY2lkOjE6cmF3OnJlc2VydmU6c2hhMi0yNTZ9I2FyYzM=",
  },
};

export default function App() {
  const [cid, setCid] = useState<string>("No CID set");

  useEffect(() => {
    const ipfsTemplate = asaInformation.params.url;
    const reserveAddress = asaInformation.params.reserve;

    // 1. Check if is a IPFS template
    const ipfsTest = ipfsTemplate.split("://");
    if (
      ipfsTemplate[0] !== "template-ipfs" &&
      !ipfsTest[1].startsWith("{ipfscid:")
    ) {
      console.log("Not an IPFS Template");
      return;
    }

    // 2. Check which hash it uses
    const templateTest = ipfsTest[1].match(/{([^}]*)}/)![1];
    const templateChunks = templateTest.split(":");

    let codec: number;

    if (templateTest !== null) {
      const cidComponents = {
        id: templateChunks[0],
        version: templateChunks[1],
        type: templateChunks[2],
        field: templateChunks[3],
        codec: templateChunks[4],
      };

      console.log("\n", templateTest);
      console.log("\n", cidComponents);

      // 3. Set codec
      codec =
        cidComponents.type === "raw"
          ? 0x55
          : cidComponents.type === "dag-pb"
          ? 0x70
          : -1;

      console.log("\n", codec);

      // 4. Decode address
      const address = decodeAddress(reserveAddress);
      const mhDigest = digest.create(sha256.code, address.publicKey);

      console.log("\n", address);
      console.log("\n", mhDigest);

      const cid = CID.create(
        parseInt(cidComponents.version) as Version,
        codec,
        mhDigest
      );

      console.log("\n", cid.toString());
      setCid(cid.toString());
    }
  }, []);

  return (
    <StyledView>
      <StatusBar style="auto" />
      <StyledTitle>Expo IPFS Template</StyledTitle>
      <StyledSubTitle>{cid}</StyledSubTitle>
      <Code>{JSON.stringify(asaInformation, null, 2)}</Code>
    </StyledView>
  );
}

const StyledView = styled.SafeAreaView`
  flex: 1;
  background-color: #fff;
`;

const StyledTitle = styled.Text`
  margin: 8px 16px 0px 16px;
  font-size: 30px;
  font-weight: 600;
`;
const StyledSubTitle = styled.Text`
  margin: 8px 16px 16px 16px;
  font-size: 20px;
  font-weight: 400;
`;

const Code = styled.Text`
  font-size: 12px;
  font-family: "Courier New";
  color: rgba(0, 103, 158, 0.75);
  font-weight: 300;
  margin: 8px 16px 16px 16px;
`;

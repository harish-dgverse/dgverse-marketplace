/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import {
  Client,
  PrivateKey,
  HbarUnit,
  TransferTransaction,
  Transaction,
  AccountId,
  Hbar,
  TransactionId,
  PublicKey,
} from '@hashgraph/sdk';
import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';

/** ***************************
 *
 *  PLEASE NOTE
 *  THIS SHOULD BE SERVER SIDE,
 *  NEVER PUT YOUR DAPP PRIVATE KEYS CLIENT SIDE
 *  GENERATE A FROZEN TRANSACTION ON YOUR SERVER USING YOUR KEYS AND RETURN IT
 */

// Client;
const pk = '302e020100300506032b65700422042093e3a32a53b0878429043643be0c992cec4f3e2aba8ccbde9905192e9326e0d2';
const pubKey = 'ce1311702fa06b70c76fa36e9bfb52d1ce6f250634f35f8c822259a1ef9a4a38';
const acc = '0.0.572001';
const client = Client.forTestnet();
client.setOperator(acc, pk);
// async init() {
//     client = Client.forTestnet();
//     client.setOperator(acc, pk);
// }

const signAndMakeBytes = async (trans: Transaction, signingAcctId: string) => {
  const privKey = PrivateKey.fromString(pk);
  const pubKey = privKey.publicKey;

  const nodeId = [new AccountId(3)];
  const transId = TransactionId.generate(signingAcctId);

  trans.setNodeAccountIds(nodeId);
  trans.setTransactionId(transId);

  trans = await trans.freeze();

  const transBytes = trans.toBytes();

  const sig = await privKey.signTransaction(Transaction.fromBytes(transBytes) as any);

  const out = trans.addSignature(pubKey, sig);

  const outBytes = out.toBytes();

  console.log('Transaction bytes', outBytes);

  return outBytes;
};

const makeBytes = async (trans: Transaction, signingAcctId: string) => {
  const transId = TransactionId.generate(signingAcctId);
  trans.setTransactionId(transId);
  trans.setNodeAccountIds([new AccountId(3)]);

  await trans.freeze();

  const transBytes = trans.toBytes();

  return transBytes;
};

const signData = (data: object): { signature: Uint8Array; serverSigningAccount: string } => {
  const privKey = PrivateKey.fromString(pk);
  console.log('pk');
  console.log(pk);
  console.log(privKey);
  const pubKey = privKey.publicKey;

  const bytes = new Uint8Array(Buffer.from(JSON.stringify(data)));

  const signature = privKey.sign(bytes);

  const verify = pubKey.verify(bytes, signature); // this will be true
  return { signature, serverSigningAccount: acc };
};

const verifyData = (data: object, publicKey: string, signature: Uint8Array): boolean => {
  const pubKey = PublicKey.fromString(publicKey);

  const bytes = new Uint8Array(Buffer.from(JSON.stringify(data)));

  const verify = pubKey.verify(bytes, signature);

  return verify;
};

export default {
  signAndMakeBytes,
  makeBytes,
  signData,
  verifyData,
};

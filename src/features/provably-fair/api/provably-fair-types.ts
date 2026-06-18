export type FairnessSeedResponse = {
  clientSeed: string;
  hashedServerSeed: string;
  nextHashedServerSeed: string;
  nonce: number;
};

export type UpdateFairnessSeedRequest = {
  clientSeed: string;
};

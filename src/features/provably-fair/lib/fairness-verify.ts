const SHA256_BUFFER_SIZE = 32;

async function hmacSHA256(key: string, message: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return new Uint8Array(sig);
}

async function getBuffer(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  round: number,
): Promise<Uint8Array> {
  return hmacSHA256(serverSeed, `${clientSeed}:${nonce}:${round}`);
}

async function getRandom(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  cursor: number,
  limit: number,
): Promise<{ value: number; cursor: number }> {
  let sum = 0;
  const bufferCache = new Map<number, Uint8Array>();

  for (let i = 0; i < 4; i++) {
    const round = Math.floor(cursor / SHA256_BUFFER_SIZE);
    const pos = cursor % SHA256_BUFFER_SIZE;

    if (!bufferCache.has(round)) {
      bufferCache.set(
        round,
        await getBuffer(serverSeed, clientSeed, nonce, round),
      );
    }
    const buf = bufferCache.get(round)!;
    sum += buf[pos] / 256 ** (i + 1);
    cursor++;
  }

  return { value: Math.floor(sum * limit), cursor };
}

export async function verifyDice(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
): Promise<number> {
  const { value } = await getRandom(serverSeed, clientSeed, nonce, 0, 10001);
  return value / 100;
}

export async function verifyKeno(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
): Promise<number[]> {
  const tiles = Array.from({ length: 40 }, (_, i) => i);
  const gems: number[] = [];
  let cursor = 0;

  for (let i = 0; i < 10; i++) {
    const { value, cursor: next } = await getRandom(
      serverSeed,
      clientSeed,
      nonce,
      cursor,
      tiles.length,
    );
    cursor = next;
    gems.push(tiles.splice(value, 1)[0]);
  }

  return gems;
}

export async function verifyPlinko(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  rowsCount: number,
): Promise<number> {
  let cursor = 0;
  let sum = 0;

  for (let i = 0; i < rowsCount; i++) {
    const { value, cursor: next } = await getRandom(
      serverSeed,
      clientSeed,
      nonce,
      cursor,
      2,
    );
    cursor = next;
    sum += value;
  }

  return sum;
}

export async function verifyRoulette(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
): Promise<number> {
  const { value } = await getRandom(serverSeed, clientSeed, nonce, 0, 37);
  return value;
}

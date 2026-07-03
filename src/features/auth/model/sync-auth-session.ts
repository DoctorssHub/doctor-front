import type { MeResponse } from "../api/auth-types";
import {
  readUserBalances,
  readUserProfileImage,
  readUsername,
} from "../lib/read-auth-response";
import { useAuthSessionStore } from "./auth-session-store";

export function syncAuthSessionFromMeResponse(user: MeResponse | undefined) {
  if (!user) {
    return;
  }

  const username = readUsername(user);

  if (!username) {
    return;
  }

  useAuthSessionStore
    .getState()
    .setSession(
      username,
      readUserBalances(user),
      readUserProfileImage(user),
    );
}

export function debitGamePointsBalanceFromAuthSession(amount: string) {
  applyGamePointsBalanceDeltaToAuthSession(amount, -1);
}

export function creditGamePointsBalanceToAuthSession(amount: string) {
  applyGamePointsBalanceDeltaToAuthSession(amount, 1);
}

export function debitGamePointsBalanceFromMeResponse(
  user: MeResponse | undefined,
  amount: string,
) {
  return applyGamePointsBalanceDeltaToMeResponse(user, amount, -1);
}

export function creditGamePointsBalanceToMeResponse(
  user: MeResponse | undefined,
  amount: string,
) {
  return applyGamePointsBalanceDeltaToMeResponse(user, amount, 1);
}

function applyGamePointsBalanceDeltaToAuthSession(
  amount: string,
  direction: -1 | 1,
) {
  const { balances, profileImgUrl, setSession, username } =
    useAuthSessionStore.getState();

  if (!username) {
    return;
  }

  const nextBalances = applyGamePointsBalanceDeltaToBalances(
    balances,
    amount,
    direction,
  );

  if (!nextBalances) {
    return;
  }

  setSession(username, nextBalances, profileImgUrl);
}

function applyGamePointsBalanceDeltaToMeResponse(
  user: MeResponse | undefined,
  amount: string,
  direction: -1 | 1,
) {
  if (!user) {
    return user;
  }

  const nextBalances = applyGamePointsBalanceDeltaToBalances(
    user.userBalances,
    amount,
    direction,
  );

  if (!nextBalances) {
    return user;
  }

  return {
    ...user,
    userBalances: nextBalances,
  };
}

function applyGamePointsBalanceDeltaToBalances<
  TBalance extends { balanceType: string; value: string },
>(balances: TBalance[], amount: string, direction: -1 | 1) {
  const amountValue = Number(amount.replace(/,/g, ""));

  if (!Number.isFinite(amountValue) || amountValue === 0) {
    return null;
  }

  return balances.map((balance) => {
    if (!isGamePointsBalanceType(balance.balanceType)) {
      return balance;
    }

    const currentValue = Number(balance.value.replace(/,/g, ""));

    if (!Number.isFinite(currentValue)) {
      return balance;
    }

    return {
      ...balance,
      value: formatBalanceValue(currentValue + direction * amountValue),
    };
  });
}

function isGamePointsBalanceType(balanceType: string) {
  return balanceType.replace(/[_\s-]+/g, "").toLowerCase().includes("gamepoint");
}

function formatBalanceValue(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  });
}

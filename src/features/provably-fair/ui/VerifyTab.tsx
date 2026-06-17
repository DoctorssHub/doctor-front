"use client";

import { useEffect, useMemo, useState } from "react";
import type { Risk } from "@/entities/game/model/types";
import { mockGameConfig } from "@/widgets/plinko-board/model/mock-config";
import {
  verifyDice,
  verifyKeno,
  verifyPlinko,
  verifyRoulette,
} from "../lib/fairness-verify";
import type { ProvablyFairGame } from "../model/provably-fair-games";
import type { FairnessVerifyResult } from "../model/verify-types";
import { GameSelect } from "./GameSelect";
import { DiceVerifyPreview } from "./verify-panels/DiceVerifyPreview";
import { KenoVerifyPreview } from "./verify-panels/KenoVerifyPreview";
import { PlinkoVerifyPreview } from "./verify-panels/PlinkoVerifyPreview";
import { RouletteVerifyPreview } from "./verify-panels/RouletteVerifyPreview";
import { VerifyResult } from "./verify-panels/VerifyResult";

type VerifyTabProps = {
  initialGame: ProvablyFairGame;
};

export function VerifyTab({ initialGame }: VerifyTabProps) {
  const [game, setGame] = useState<ProvablyFairGame>(initialGame);
  const [clientSeed, setClientSeed] = useState("");
  const [serverSeed, setServerSeed] = useState("");
  const [nonce, setNonce] = useState("0");
  const [rows, setRows] = useState(8);
  const [risk, setRisk] = useState<Risk>("LOW");
  const [result, setResult] = useState<FairnessVerifyResult | null>(null);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const plinkoMultipliers = useMemo(
    () => mockGameConfig.payoutTables[risk][rows] ?? [],
    [risk, rows],
  );

  useEffect(() => {
    let isCurrent = true;

    async function verifyCurrentInput() {
      const parsedNonce = Number(nonce);
      const trimmedServerSeed = serverSeed.trim();
      const trimmedClientSeed = clientSeed.trim();

      if (!trimmedServerSeed || !trimmedClientSeed) {
        setError("");
        setResult(null);
        setIsVerifying(false);
        return;
      }

      if (!Number.isInteger(parsedNonce)) {
        setError("Enter an integer nonce.");
        setResult(null);
        setIsVerifying(false);
        return;
      }

      setError("");
      setIsVerifying(true);

      try {
        let nextResult: FairnessVerifyResult;

        if (game === "roulette") {
          nextResult = {
            game,
            number: await verifyRoulette(
              trimmedServerSeed,
              trimmedClientSeed,
              parsedNonce,
            ),
          };
        } else if (game === "dice") {
          nextResult = {
            game,
            roll: await verifyDice(
              trimmedServerSeed,
              trimmedClientSeed,
              parsedNonce,
            ),
          };
        } else if (game === "keno") {
          nextResult = {
            game,
            tiles: await verifyKeno(
              trimmedServerSeed,
              trimmedClientSeed,
              parsedNonce,
            ),
          };
        } else {
          const bucketIndex = await verifyPlinko(
            trimmedServerSeed,
            trimmedClientSeed,
            parsedNonce,
            rows,
          );

          nextResult = {
            bucketIndex,
            game,
            multiplier: plinkoMultipliers[bucketIndex] ?? 0,
            risk,
            rows,
          };
        }

        if (isCurrent) {
          setResult(nextResult);
        }
      } catch {
        if (isCurrent) {
          setError("Could not verify this seed pair.");
          setResult(null);
        }
      } finally {
        if (isCurrent) {
          setIsVerifying(false);
        }
      }
    }

    verifyCurrentInput();

    return () => {
      isCurrent = false;
    };
  }, [clientSeed, game, nonce, plinkoMultipliers, risk, rows, serverSeed]);

  function handleGameChange(nextGame: ProvablyFairGame) {
    setGame(nextGame);
    setError("");
  }

  const rouletteNumber =
    result?.game === "roulette" && game === "roulette" ? result.number : null;
  const diceRoll = result?.game === "dice" && game === "dice" ? result.roll : null;
  const kenoTiles = result?.game === "keno" && game === "keno" ? result.tiles : [];
  const plinkoBucket =
    result?.game === "plinko" && game === "plinko" ? result.bucketIndex : null;

  return (
    <section className="space-y-4">
      {game === "roulette" ? (
        <RouletteVerifyPreview resultNumber={rouletteNumber} />
      ) : null}
      {game === "dice" ? <DiceVerifyPreview roll={diceRoll} /> : null}
      {game === "keno" ? <KenoVerifyPreview tiles={kenoTiles} /> : null}
      {game === "plinko" ? (
        <PlinkoVerifyPreview
          bucketIndex={plinkoBucket}
          multipliers={plinkoMultipliers}
        />
      ) : null}

      <GameSelect onChange={handleGameChange} value={game} />

      <VerifyInput
        label="Client seed"
        onChange={setClientSeed}
        placeholder="Enter client seed"
        value={clientSeed}
      />
      <VerifyInput
        label="Server seed"
        onChange={setServerSeed}
        placeholder="Enter server seed"
        value={serverSeed}
      />
      <VerifyInput
        label="Nonce"
        onChange={setNonce}
        placeholder="0"
        value={nonce}
      />

      {game === "plinko" ? (
        <>
          <label className="block text-sm font-medium text-[var(--color-text-muted)]">
            Rows
            <span className="mt-2 flex items-center gap-3">
              <span className="w-6 text-base font-bold text-[var(--color-text-primary)]">
                {rows}
              </span>
              <input
                className="h-1.5 flex-1 accent-[var(--color-brand)]"
                max={16}
                min={8}
                onChange={(event) => setRows(Number(event.target.value))}
                type="range"
                value={rows}
              />
            </span>
          </label>

          <RiskSelector risk={risk} onChange={setRisk} />
        </>
      ) : null}

      {error ? <p className="text-sm text-[var(--color-accent-red)]">{error}</p> : null}
      {isVerifying ? (
        <p className="text-sm text-[var(--color-text-muted)]">Verifying...</p>
      ) : null}
      <VerifyResult result={result} />
    </section>
  );
}

type VerifyInputProps = {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function VerifyInput({ label, onChange, placeholder, value }: VerifyInputProps) {
  return (
    <label className="block text-sm font-medium text-[var(--color-text-muted)]">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[15px] font-medium text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-disabled)] focus:border-[var(--color-brand)]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

type RiskSelectorProps = {
  risk: Risk;
  onChange: (risk: Risk) => void;
};

const RISK_OPTIONS: Array<{
  label: string;
  toneClassName: string;
  value: Risk;
}> = [
  { label: "Low", toneClassName: "text-[#22c55e]", value: "LOW" },
  { label: "Medium", toneClassName: "text-[#facc15]", value: "MEDIUM" },
  { label: "High", toneClassName: "text-[#ef4444]", value: "HIGH" },
];

function RiskSelector({ risk, onChange }: RiskSelectorProps) {
  return (
    <div className="grid grid-cols-3 rounded-lg bg-[var(--color-surface)] p-1">
      {RISK_OPTIONS.map((option) => (
        <button
          className={[
            "h-10 rounded-md text-sm font-bold transition hover:bg-[var(--color-surface-hover)]",
            option.toneClassName,
            risk === option.value ? "bg-[var(--color-surface-elevated)]" : "",
          ].join(" ")}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

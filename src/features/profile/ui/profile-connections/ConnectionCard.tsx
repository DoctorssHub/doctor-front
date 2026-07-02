import type { ProfileConnection } from "../../model/profile-connections";
import { ConnectionIcon } from "./ConnectionIcon";
import { ConnectionStatus } from "./ConnectionStatus";

type ConnectionCardProps = {
  connection: ProfileConnection;
  isPending: boolean;
  onConnect: (connection: ProfileConnection) => void;
};

export function ConnectionCard({
  connection,
  isPending,
  onConnect,
}: ConnectionCardProps) {
  const isButtonDisabled = connection.isConnected || isPending;

  return (
    <article className="flex min-h-20 items-center justify-between gap-4 rounded-xl bg-(--color-surface) px-4 py-3.5 max-tablet:gap-3 max-mobile:min-h-[72px]">
      <div className="flex min-w-0 items-center gap-3">
        <ConnectionIcon provider={connection.provider} />

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-(--color-text-primary)">
              {connection.label}
            </h3>
            <ConnectionStatus isConnected={connection.isConnected} />
          </div>
          <p className="mt-1 line-clamp-2 text-xs font-medium leading-4 text-(--color-text-muted)">
            {connection.description}
          </p>
        </div>
      </div>

      <button
        className="h-10 min-w-[100px] shrink-0 rounded-lg bg-(--color-auth-control) px-4 text-sm font-bold text-(--color-text-primary) transition hover:bg-(--color-auth-control-hover) disabled:cursor-not-allowed disabled:opacity-70 max-tablet:min-w-[88px] max-tablet:px-3"
        disabled={isButtonDisabled}
        onClick={() => onConnect(connection)}
        type="button"
      >
        {connection.isConnected ? "Connected" : isPending ? "Opening..." : "Connect"}
      </button>
    </article>
  );
}

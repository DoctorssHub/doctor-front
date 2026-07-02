"use client";

import Image from "next/image";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import pencilIcon from "@/assets/profile/pencil.svg";
import { getApiErrorMessage } from "../lib/profile-error";
import { useUpdateUsername } from "../model/use-update-username";

type ProfileUsernameFieldProps = {
  username: string;
};

export const ProfileUsernameField = memo(function ProfileUsernameField({
  username,
}: ProfileUsernameFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const draftValueRef = useRef(username);
  const updateUsername = useUpdateUsername();

  useEffect(() => {
    if (isEditing) {
      return;
    }

    draftValueRef.current = username;
    setCanSave(false);

    if (inputRef.current) {
      inputRef.current.value = username;
    }
  }, [isEditing, username]);

  const startEditing = useCallback(() => {
    updateUsername.reset();
    draftValueRef.current = inputRef.current?.value ?? username;
    setCanSave(false);
    setIsEditing(true);
  }, [updateUsername, username]);

  const cancelEditing = useCallback(() => {
    updateUsername.reset();
    draftValueRef.current = username;
    setCanSave(false);
    if (inputRef.current) {
      inputRef.current.value = username;
    }
    setIsEditing(false);
  }, [updateUsername, username]);

  const save = useCallback(() => {
    const trimmed = draftValueRef.current.trim();

    if (
      trimmed.length === 0 ||
      trimmed === username ||
      updateUsername.isPending
    ) {
      return;
    }

    updateUsername.mutate(trimmed, {
      onSuccess: () => {
        setCanSave(false);
        setIsEditing(false);
      },
    });
  }, [updateUsername, username]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    const trimmed = nextValue.trim();
    const nextCanSave = trimmed.length > 0 && trimmed !== username;

    draftValueRef.current = nextValue;
    setCanSave((currentCanSave) =>
      currentCanSave === nextCanSave ? currentCanSave : nextCanSave,
    );
  }, [username]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      save();
    }
    if (event.key === "Escape") {
      cancelEditing();
    }
  }, [cancelEditing, save]);

  const isSaveDisabled = !canSave || updateUsername.isPending;

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-[14px] font-light text-(--color-text-muted)"
        htmlFor="profile-username"
      >
        Username
      </label>

      <div className="flex max-w-sm items-center gap-2 max-tablet:max-w-none">
        <div className="relative flex-1">
          <input
            className="h-11 w-full rounded-lg border border-(--color-border-strong) bg-(--color-roulette-win-number-dark)/50 px-3.5 pr-10 text-sm text-(--color-text-primary) disabled:cursor-not-allowed disabled:text-(--color-text-disabled)"
            defaultValue={username}
            disabled={!isEditing || updateUsername.isPending}
            id="profile-username"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            type="text"
          />
          {!isEditing ? (
            <button
              aria-label="Edit username"
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-(--color-text-subtle) transition hover:bg-(--color-surface-hover) hover:text-(--color-text-primary)"
              onClick={startEditing}
              type="button"
            >
              <Image alt="Edit username" className="size-4" src={pencilIcon} />
            </button>
          ) : null}
        </div>

        {isEditing ? (
          <>
            <button
              className="h-11 shrink-0 rounded-lg bg-(--color-brand-strong) px-4 text-sm font-semibold text-(--color-brand-contrast) transition hover:bg-(--color-brand-hover) disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSaveDisabled}
              onClick={save}
              type="button"
            >
              {updateUsername.isPending ? "Saving..." : "Save"}
            </button>
            <button
              className="h-11 shrink-0 rounded-lg border border-(--color-border-strong) px-4 text-sm font-semibold text-(--color-text-muted) transition hover:text-(--color-text-primary) disabled:cursor-not-allowed disabled:opacity-50"
              disabled={updateUsername.isPending}
              onClick={cancelEditing}
              type="button"
            >
              Cancel
            </button>
          </>
        ) : null}
      </div>

      {updateUsername.isError ? (
        <p className="text-xs text-(--color-accent-red)">
          {getApiErrorMessage(
            updateUsername.error,
            "Couldn't update username. Please try again.",
          )}
        </p>
      ) : null}
    </div>
  );
});

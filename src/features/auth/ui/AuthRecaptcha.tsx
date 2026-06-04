"use client";

import { forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export const AuthRecaptcha = forwardRef<ReCAPTCHA>(
  function AuthRecaptcha(_props, ref) {
    return (
      <ReCAPTCHA
        ref={ref}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        theme="dark"
      />
    );
  },
);

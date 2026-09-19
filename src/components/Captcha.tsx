import { forwardRef, useImperativeHandle, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export type CaptchaHandle = { reset: () => void };

type CaptchaProps = {
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
};

const Captcha = forwardRef<CaptchaHandle, CaptchaProps>(function Captcha(
  { onVerify, onExpire, onError },
  ref
) {
  const captcha = useRef<HCaptcha>(null);
  useImperativeHandle(ref, () => ({
    reset: () => captcha.current?.resetCaptcha(),
  }), []);

  return (
    <HCaptcha
      ref={captcha}
      sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
      reCaptchaCompat={false}
      size="compact"
      onVerify={onVerify}
      onExpire={onExpire}
      onError={onError}
    />
  );
});

export default Captcha;

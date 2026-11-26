import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  AUTH_ASSETS,
  CAPTCHA_SAMPLES,
  REGION_OPTIONS,
  type RegionOption,
} from './authAssets';

type LoginStep = 'phone' | 'verify';
type SsoProvider = 'google' | 'apple' | null;
type AuthAlert = { type: 'warning' | 'error'; message: string } | null;

function formatMaskedPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length >= 8) {
    return `${digits.slice(0, 4)} ****`;
  }
  return '6123 ****';
}

/**
 * Figma section: 8055:110042 ('login')
 * Screens implemented:
 * - 8055:110045: 01 | Sign in - Default · WELLCOME (and Filled / Error 8055:110099)
 * - 8055:110084: 03 | Select region · WELLCOME (bottom drawer)
 * - 8055:110100 & 8055:110110: Enter verification code (countdown + active resend)
 * - 8055:110111: 07 | Security check · WELLCOME (captcha verification dialog)
 * - 8055:110136: sso login (in-app Google / Apple account chooser sheet)
 * - 8055:110080: 13 / SSO · UNAVAILABLE (toastError)
 * - 8055:110143: T&Cs required warning (toastWarning)
 */
export const LoginPage: React.FC = () => {
  const navigate = useAppStore((s) => s.navigate);
  const signIn = useAppStore((s) => s.signIn);
  const showToast = useAppStore((s) => s.showToast);

  // Flow step
  const [step, setStep] = useState<LoginStep>('phone');

  // Phone input & region
  const [region, setRegion] = useState<RegionOption>(REGION_OPTIONS[0]);
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [regionDrawerOpen, setRegionDrawerOpen] = useState(false);

  // Consents (Figma 8055:110045 defaults: required checked, marketing unchecked)
  const [agreedRequired, setAgreedRequired] = useState(true);
  const [agreedMarketing, setAgreedMarketing] = useState(false);

  // Inline Figma auth alert toast (toastWarning / toastError)
  const [authAlert, setAuthAlert] = useState<AuthAlert>(null);

  // Verification step state
  const [otpCode, setOtpCode] = useState('');
  const [resendSeconds, setResendSeconds] = useState(5);

  // Security check modal (8055:110111)
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [captchaIdx, setCaptchaIdx] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // SSO sheet (8055:110136)
  const [ssoProvider, setSsoProvider] = useState<SsoProvider>(null);

  const digitsOnly = phoneInput.replace(/\s+/g, '');
  const hasInvalidChars = /[^\d\s]/.test(phoneInput);
  const isPhoneValid =
    !hasInvalidChars && digitsOnly.length === region.digitCount;
  const showPhoneError =
    phoneInput.length > 0 && (hasInvalidChars || (phoneTouched && !isPhoneValid));

  // Auto-dismiss auth alert toast after 3.5s
  useEffect(() => {
    if (!authAlert) return;
    const t = window.setTimeout(() => setAuthAlert(null), 3500);
    return () => window.clearTimeout(t);
  }, [authAlert]);

  // Countdown timer on verification step
  useEffect(() => {
    if (step !== 'verify' || resendSeconds <= 0) return;
    const t = window.setTimeout(() => setResendSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [step, resendSeconds]);

  const showWarningAlert = (message: string) => {
    setAuthAlert({ type: 'warning', message });
  };

  const showErrorAlert = (message: string) => {
    setAuthAlert({ type: 'error', message });
  };

  const handlePhoneNext = () => {
    setPhoneTouched(true);
    if (!isPhoneValid) return;
    if (!agreedRequired) {
      showWarningAlert('Please agree to the T&Cs first.');
      return;
    }
    setAuthAlert(null);
    setOtpCode('');
    setResendSeconds(5);
    setStep('verify');
  };

  const handleSsoClick = (provider: 'google' | 'apple') => {
    if (!agreedRequired) {
      showWarningAlert('Please agree to the T&Cs first.');
      return;
    }
    setAuthAlert(null);
    setSsoProvider(provider);
  };

  const handleSsoAccountSelect = () => {
    const provider = ssoProvider ?? 'google';
    setSsoProvider(null);
    signIn({
      method: provider,
      name: 'Amos Wang',
      email: provider === 'google' ? 'bendammmm@gmail.com' : 'amos.wang@icloud.com',
      marketingOptIn: agreedMarketing,
    });
    showToast(`Signed in with ${provider === 'google' ? 'Google' : 'Apple'} as Amos Wang`);
    navigate('home');
  };

  const handleSsoUnavailable = () => {
    setSsoProvider(null);
    showErrorAlert('Login failed. Please try again or use a different login method.');
  };

  const handleOpenSecurityCheck = () => {
    if (resendSeconds > 0) return;
    setCaptchaInput('');
    setCaptchaError('');
    setSecurityModalOpen(true);
  };

  const handleSecurityConfirm = () => {
    const expected = CAPTCHA_SAMPLES[captchaIdx];
    if (captchaInput.trim().toLowerCase() !== expected.toLowerCase()) {
      setCaptchaError('Incorrect code. Please try again.');
      return;
    }
    setSecurityModalOpen(false);
    setCaptchaInput('');
    setCaptchaError('');
    setResendSeconds(59);
    showToast('New verification code sent');
  };

  const handleVerifyConfirm = () => {
    if (otpCode.trim().length < 4) return;
    signIn({
      method: 'phone',
      name: 'Wellcome Member',
      phone: `${region.code} ${phoneInput.trim()}`,
      marketingOptIn: agreedMarketing,
    });
    showToast('Signed in successfully');
    navigate('home');
  };

  const currentCaptcha = CAPTCHA_SAMPLES[captchaIdx];

  return (
    <div className="min-h-dvh bg-[#F7F7F7] relative flex flex-col">
      {/* Floating Auth Alert Toast (Figma 8055:110143 toastWarning / 8055:110080 toastError) */}
      {authAlert && (
        <div className="app-fixed-bar top-[12px] z-50 px-[16px] animate-fade-in">
          <div
            role="alert"
            onClick={() => setAuthAlert(null)}
            className={`w-full rounded-[8px] border-2 p-[16px] flex items-start gap-[8px] shadow-[0_4px_10px_rgba(0,0,0,0.12)] cursor-pointer ${
              authAlert.type === 'warning'
                ? 'bg-[#FFFCF4] border-[#FFEC99]'
                : 'bg-[#FFFBFB] border-[#FBE4E2]'
            }`}
          >
            <span className="p-[2px] flex items-center justify-center shrink-0">
              <img
                src={
                  authAlert.type === 'warning'
                    ? AUTH_ASSETS.alertTriangle
                    : AUTH_ASSETS.alertCircle
                }
                alt=""
                className="block size-[20px] object-contain"
              />
            </span>
            <p className="flex-1 text-[14px] font-bold leading-[20px] text-[#444444]">
              {authAlert.message}
            </p>
          </div>
        </div>
      )}

      {/* Top NavigationBar (Figma 8055:110046 / 8055:110101) */}
      <header className="sticky top-0 z-30 bg-[#F7F7F7] pt-[env(safe-area-inset-top)]">
        <div className="h-[48px] px-[12px] flex items-center gap-[8px]">
          {step === 'phone' ? (
            <button
              type="button"
              aria-label="Close sign in"
              onClick={() => navigate('home')}
              className="size-[36px] flex items-center justify-center shrink-0 active:opacity-70"
            >
              <img
                src={AUTH_ASSETS.navClose}
                alt=""
                className="block size-[20px] object-contain"
              />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Back to phone sign in"
              onClick={() => setStep('phone')}
              className="size-[36px] flex items-center justify-center shrink-0 active:opacity-70"
            >
              <img
                src={AUTH_ASSETS.chevronLeft}
                alt=""
                className="block size-[28px] object-contain"
              />
            </button>
          )}
          <div className="flex-1" />
          <div className="size-[36px] shrink-0" />
        </div>
      </header>

      {/* STEP 1: Phone + SSO Sign in (Figma 8055:110045) */}
      {step === 'phone' && (
        <div className="px-[16px] pb-[32px] flex flex-col gap-[16px]">
          {/* Brand Mark */}
          <div className="py-[8px] flex items-center justify-center w-full">
            <div className="bg-[#E40032] rounded-[8px] size-[48px] relative flex items-center justify-center shrink-0">
              <img
                src={AUTH_ASSETS.wellcomeMark}
                alt="Wellcome"
                className="h-[24px] w-auto object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-[8px]">
            <h1 className="text-[24px] font-bold leading-[32px] text-[#1A1A1A] m-0">
              Login / Sign up
            </h1>
            <p className="text-[14px] font-normal leading-[20px] text-[#666666] m-0">
              Use your phone number, Google or Apple.
            </p>
          </div>

          {/* Phone Number Form Card */}
          <div className="bg-white rounded-[12px] p-[16px] flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[8px]">
              <label
                htmlFor="login-phone-input"
                className="text-[14px] font-semibold leading-[20px] text-[#1A1A1A]"
              >
                Phone number
              </label>

              <div
                className={`bg-white border rounded-[8px] h-[48px] px-[12px] flex items-center gap-[8px] transition-colors ${
                  showPhoneError
                    ? 'border-[#911F15]'
                    : 'border-[#E0E0E0] focus-within:border-[#1A1A1A]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setRegionDrawerOpen(true)}
                  aria-label="Select region code"
                  className="flex items-center gap-[4px] pr-[8px] shrink-0 active:opacity-70"
                >
                  <span className="text-[16px] font-bold leading-[24px] text-[#1A1A1A] whitespace-nowrap">
                    {region.code}
                  </span>
                  <img
                    src={AUTH_ASSETS.chevronDown}
                    alt=""
                    className="block size-[16px] object-contain"
                  />
                </button>

                <div className="w-px h-[22px] bg-[#E0E0E0] shrink-0" />

                <input
                  id="login-phone-input"
                  type="tel"
                  inputMode="tel"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    if (phoneTouched) setPhoneTouched(false);
                  }}
                  onBlur={() => {
                    if (phoneInput.length > 0) setPhoneTouched(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePhoneNext();
                  }}
                  placeholder="Enter phone number"
                  className="flex-1 min-w-0 bg-transparent text-[16px] font-normal leading-[24px] text-[#1A1A1A] placeholder:text-[#969696] outline-none"
                />

                {phoneInput.length > 0 && (
                  <button
                    type="button"
                    aria-label="Clear phone number"
                    onClick={() => {
                      setPhoneInput('');
                      setPhoneTouched(false);
                    }}
                    className="relative size-[24px] shrink-0 flex items-center justify-center active:opacity-70"
                  >
                    <span className="relative size-[20px] block">
                      <img
                        src={AUTH_ASSETS.clearCircleBg}
                        alt=""
                        className="absolute inset-0 block size-full"
                      />
                      <img
                        src={AUTH_ASSETS.clearCircleX}
                        alt=""
                        className="absolute inset-1/4 block size-1/2"
                      />
                    </span>
                  </button>
                )}
              </div>

              {showPhoneError && (
                <p className="text-[12px] leading-[16px] text-[#911F15] m-0">
                  Please enter a valid phone number.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handlePhoneNext}
              disabled={!isPhoneValid}
              className={`h-[48px] w-full rounded-[8px] px-[20px] flex items-center justify-center text-[16px] font-bold leading-[24px] transition-colors ${
                isPhoneValid
                  ? 'bg-[#E40032] text-white active:bg-[#C8002C]'
                  : 'bg-[#EEEEEE] text-[#A8A8A8] cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>

          {/* Alternative Divider + Google & Apple SSO */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[16px] w-full">
              <div className="flex-1 h-px bg-[#E0E0E0]" />
              <span className="text-[12px] font-normal leading-[16px] text-[#666666]">
                or
              </span>
              <div className="flex-1 h-px bg-[#E0E0E0]" />
            </div>

            <div className="flex flex-col gap-[12px]">
              <button
                type="button"
                onClick={() => handleSsoClick('google')}
                className="h-[48px] w-full bg-white border border-[#E0E0E0] rounded-[8px] flex items-center justify-center gap-[10px] text-[16px] font-bold leading-[24px] text-[#1A1A1A] active:bg-[#F5F5F5] transition-colors"
              >
                <img
                  src={AUTH_ASSETS.googleG}
                  alt=""
                  className="w-[19.5px] h-[20px] object-contain shrink-0"
                />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSsoClick('apple')}
                className="h-[48px] w-full bg-white border border-[#E0E0E0] rounded-[8px] flex items-center justify-center gap-[10px] text-[16px] font-bold leading-[24px] text-[#1A1A1A] active:bg-[#F5F5F5] transition-colors"
              >
                <img
                  src={AUTH_ASSETS.appleLogo}
                  alt=""
                  className="size-[20px] object-contain shrink-0"
                />
                <span>Continue with Apple</span>
              </button>
            </div>
          </div>

          {/* Consent Choices (Figma 8055:110069) */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-start gap-[8px]">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreedRequired}
                aria-label="Agree to Terms and Conditions"
                onClick={() => setAgreedRequired((v) => !v)}
                className="size-[24px] shrink-0 active:scale-95 transition-transform"
              >
                <img
                  src={
                    agreedRequired
                      ? AUTH_ASSETS.checkboxChecked
                      : AUTH_ASSETS.checkboxBlank
                  }
                  alt=""
                  className="block size-[24px]"
                />
              </button>
              <p className="flex-1 text-[12px] font-normal leading-[16px] text-[#1A1A1A] m-0">
                I have read and agree to the{' '}
                <button
                  type="button"
                  onClick={() => showToast('Opening Terms & Conditions')}
                  className="text-[#E40032] inline p-0 bg-transparent border-0 text-[12px] leading-[16px] font-normal underline-offset-2 hover:underline"
                >
                  Terms &amp; Conditions
                </button>
                ,{' '}
                <button
                  type="button"
                  onClick={() =>
                    showToast('Opening Personal Information Collection Statement')
                  }
                  className="text-[#E40032] inline p-0 bg-transparent border-0 text-[12px] leading-[16px] font-normal underline-offset-2 hover:underline"
                >
                  Personal Information Collection Statement (PICS)
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => showToast('Opening Privacy Policy')}
                  className="text-[#E40032] inline p-0 bg-transparent border-0 text-[12px] leading-[16px] font-normal underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </button>
                . If I am a yuu member registered with the same phone number, I agree that my yuu account will be linked with my Wellcome and Market Place account.
              </p>
            </div>

            <div className="flex items-start gap-[8px]">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreedMarketing}
                aria-label="Agree to Direct Marketing"
                onClick={() => setAgreedMarketing((v) => !v)}
                className="size-[24px] shrink-0 active:scale-95 transition-transform"
              >
                <img
                  src={
                    agreedMarketing
                      ? AUTH_ASSETS.checkboxChecked
                      : AUTH_ASSETS.checkboxBlank
                  }
                  alt=""
                  className="block size-[24px]"
                />
              </button>
              <div className="flex-1 flex flex-col gap-[2px] text-[12px] font-normal leading-[16px]">
                <p className="text-[#1A1A1A] m-0">
                  I agree that DFI (which owns and operates this App) may use my personal data for Direct Marketing purposes as stated in the above Privacy Policy.
                </p>
                <p className="text-[#666666] m-0">
                  Optional. You can continue without selecting this.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Enter Verification Code (Figma 8055:110100 / 8055:110110) */}
      {step === 'verify' && (
        <div className="px-[16px] pt-[16px] pb-[32px] flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <h1 className="text-[24px] font-bold leading-[32px] text-[#1A1A1A] m-0">
              Enter verification code
            </h1>
            <p className="text-[14px] font-normal leading-[20px] text-[#666666] m-0">
              Enter the verification code sent to {region.code}{' '}
              {formatMaskedPhone(phoneInput)} to continue.
            </p>
          </div>

          <div className="bg-white rounded-[12px] p-[16px] flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[8px]">
              <label
                htmlFor="login-otp-input"
                className="text-[14px] font-semibold leading-[20px] text-[#1A1A1A]"
              >
                Verification code
              </label>

              <div className="bg-white border border-[#E0E0E0] focus-within:border-[#1A1A1A] rounded-[8px] h-[48px] pl-[12px] pr-[8px] flex items-center gap-[8px]">
                <input
                  id="login-otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleVerifyConfirm();
                  }}
                  placeholder="Enter text"
                  className="flex-1 min-w-0 bg-transparent text-[16px] font-normal leading-[24px] text-[#1A1A1A] placeholder:text-[#858585] outline-none"
                />

                <button
                  type="button"
                  onClick={handleOpenSecurityCheck}
                  disabled={resendSeconds > 0}
                  className={`h-[32px] w-[96px] rounded-[4px] px-[12px] flex items-center justify-center text-[12px] font-semibold leading-[16px] whitespace-nowrap shrink-0 transition-colors ${
                    resendSeconds > 0
                      ? 'bg-[#EEEEEE] text-[#A8A8A8] cursor-not-allowed'
                      : 'bg-[#E40032] text-white active:bg-[#C8002C]'
                  }`}
                >
                  {resendSeconds > 0 ? `Resend (${resendSeconds})` : 'Resend'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerifyConfirm}
              disabled={otpCode.trim().length < 4}
              className={`h-[48px] w-full rounded-[8px] px-[20px] flex items-center justify-center text-[16px] font-bold leading-[24px] transition-colors ${
                otpCode.trim().length >= 4
                  ? 'bg-[#E40032] text-white active:bg-[#C8002C]'
                  : 'bg-[#EEEEEE] text-[#A8A8A8] cursor-not-allowed'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* SELECT REGION BOTTOM DRAWER (Figma 8055:110084) */}
      {regionDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-end">
          <div
            onClick={() => setRegionDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 animate-fade-in"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Select region"
            className="relative z-10 w-full max-w-[393px] max-[480px]:max-w-full bg-white rounded-t-[12px] flex flex-col overflow-hidden animate-drawer-up shadow-2xl"
          >
            <div className="h-[48px] px-[12px] flex items-center gap-[8px] shrink-0">
              <button
                type="button"
                aria-label="Close select region"
                onClick={() => setRegionDrawerOpen(false)}
                className="size-[36px] flex items-center justify-center shrink-0 active:opacity-70"
              >
                <img
                  src={AUTH_ASSETS.drawerClose}
                  alt=""
                  className="block size-[28px] object-contain"
                />
              </button>
              <h2 className="flex-1 text-center text-[16px] font-bold leading-[24px] text-[#1A1A1A] m-0">
                Select region
              </h2>
              <div className="size-[36px] shrink-0" />
            </div>

            <div className="px-[12px] pt-[8px] pb-[max(32px,env(safe-area-inset-bottom))] flex flex-col gap-[8px]">
              {REGION_OPTIONS.map((opt) => {
                const selected = opt.code === region.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setRegion(opt);
                      setRegionDrawerOpen(false);
                    }}
                    className="h-[48px] w-full px-[8px] flex items-center gap-[8px] text-left rounded-[8px] active:bg-[#F7F7F7]"
                  >
                    <img
                      src={
                        selected
                          ? AUTH_ASSETS.radioSelected
                          : AUTH_ASSETS.radioUnselected
                      }
                      alt=""
                      className="block size-[24px] shrink-0"
                    />
                    <span
                      className={`flex-1 text-[16px] font-normal leading-[24px] whitespace-pre-wrap ${
                        selected ? 'text-[#E40032]' : 'text-[#1A1A1A]'
                      }`}
                    >
                      {`${opt.code}  ${opt.label}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECURITY CHECK DIALOG (Figma 8055:110111) */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-[36px]">
          <div
            onClick={() => setSecurityModalOpen(false)}
            className="fixed inset-0 bg-black/40 animate-fade-in"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Security check"
            className="relative z-10 w-full max-w-[321px] bg-white rounded-[12px] p-[16px] flex flex-col items-center gap-[12px] shadow-2xl animate-fade-in"
          >
            <h2 className="text-[18px] font-bold leading-[28px] text-[#1A1A1A] text-center w-full m-0">
              Security check
            </h2>
            <p className="text-[12px] font-normal leading-[16px] text-[#666666] text-center w-full m-0">
              Enter the characters shown below to continue.
            </p>

            <div className="w-full flex items-center gap-[8px]">
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  if (captchaError) setCaptchaError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSecurityConfirm();
                }}
                placeholder="Enter code"
                aria-label="Security code"
                className="flex-1 min-w-0 h-[48px] px-[12px] rounded-[8px] border border-[#E0E0E0] focus:border-[#1A1A1A] text-[14px] leading-[20px] text-[#1A1A1A] placeholder:text-[#858585] outline-none bg-white"
              />
              <div className="w-[64px] h-[48px] rounded-[4px] bg-[#F7F7F7] flex items-center justify-center shrink-0 select-none">
                <span className="text-[16px] font-bold leading-[24px] text-[#1A1A1A] tracking-[0.5px]">
                  {currentCaptcha}
                </span>
              </div>
              <button
                type="button"
                aria-label="Refresh security code"
                onClick={() => {
                  setCaptchaIdx((i) => (i + 1) % CAPTCHA_SAMPLES.length);
                  setCaptchaInput('');
                  setCaptchaError('');
                }}
                className="size-[48px] rounded-[8px] bg-white border border-[#D9D9D9] flex items-center justify-center shrink-0 active:bg-[#F5F5F5]"
              >
                <img
                  src={AUTH_ASSETS.refreshIcon}
                  alt=""
                  className="block size-[22px] object-contain"
                />
              </button>
            </div>

            {captchaError && (
              <p className="text-[12px] leading-[16px] text-[#911F15] text-center w-full m-0">
                {captchaError}
              </p>
            )}

            <p className="text-[12px] font-normal leading-[16px] text-[#666666] text-center w-full m-0">
              Can&apos;t read it? Refresh or use audio verification
            </p>

            <div className="w-full flex items-center gap-[12px]">
              <button
                type="button"
                onClick={() => setSecurityModalOpen(false)}
                className="flex-1 h-[40px] rounded-[8px] border border-[#C7C7C7] bg-white text-[14px] font-semibold leading-[20px] text-[#1A1A1A] active:bg-[#F5F5F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSecurityConfirm}
                className="flex-1 h-[40px] rounded-[8px] bg-[#E40032] text-[14px] font-semibold leading-[20px] text-white active:bg-[#C8002C]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SSO IN-APP BROWSER SHEET (Figma 8055:110136) */}
      {ssoProvider && (
        <div className="fixed inset-0 z-50 flex justify-center items-end">
          <div
            onClick={() => setSsoProvider(null)}
            className="fixed inset-0 bg-black/50 animate-fade-in"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              ssoProvider === 'google' ? 'Sign in with Google' : 'Sign in with Apple'
            }
            className="relative z-10 w-full max-w-[393px] max-[480px]:max-w-full h-[92dvh] bg-white rounded-t-[16px] flex flex-col overflow-hidden animate-drawer-up shadow-2xl"
          >
            {/* iOS SFSafariViewController-style header */}
            <div className="h-[56px] px-[16px] flex items-center justify-between border-b border-[#EFEFEF] shrink-0">
              <button
                type="button"
                aria-label="Close SSO login"
                onClick={() => setSsoProvider(null)}
                className="size-[36px] rounded-full bg-[#F5F5F5] flex items-center justify-center active:bg-[#EAEAEA]"
              >
                <img
                  src={AUTH_ASSETS.navClose}
                  alt=""
                  className="block size-[18px] object-contain"
                />
              </button>
              <span className="text-[15px] font-bold text-[#1A1A1A]">
                {ssoProvider === 'google'
                  ? 'accounts.google.com'
                  : 'appleid.apple.com'}
              </span>
              <div className="size-[36px]" />
            </div>

            {/* Provider sub-header */}
            <div className="px-[20px] py-[12px] border-b border-[#EFEFEF] flex items-center gap-[10px] shrink-0">
              <img
                src={
                  ssoProvider === 'google'
                    ? AUTH_ASSETS.googleG
                    : AUTH_ASSETS.appleLogo
                }
                alt=""
                className="size-[18px] object-contain"
              />
              <span className="text-[14px] font-medium text-[#444444]">
                {ssoProvider === 'google'
                  ? 'Sign in with Google'
                  : 'Sign in with Apple'}
              </span>
            </div>

            {/* SSO Account Picker Content */}
            <div className="flex-1 overflow-y-auto px-[24px] pt-[28px] pb-[32px] flex flex-col">
              <div className="bg-[#E40032] size-[45px] relative flex items-center justify-center shrink-0">
                <img
                  src={AUTH_ASSETS.wellcomeMark}
                  alt="Wellcome"
                  className="h-[22px] w-auto object-contain"
                />
              </div>

              <h2 className="text-[24px] font-normal leading-[32px] text-[#1A1A1A] mt-[20px] mb-0">
                Choose an account
              </h2>
              <p className="text-[14px] leading-[20px] text-[#444444] mt-[8px] mb-0">
                to continue to{' '}
                <span className="text-[#1A73E8] font-medium">Wellcome</span>
              </p>

              <div className="mt-[28px] divide-y divide-[#E0E0E0] border-b border-[#E0E0E0]">
                <button
                  type="button"
                  onClick={handleSsoAccountSelect}
                  className="w-full py-[14px] flex items-center gap-[12px] text-left active:bg-[#F5F5F5]"
                >
                  <div className="size-[34px] rounded-full bg-[#7B61B8] text-white text-[15px] font-semibold flex items-center justify-center shrink-0">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-[#1A1A1A] m-0 leading-[20px]">
                      Amos Wang
                    </p>
                    <p className="text-[12px] text-[#666666] m-0 leading-[16px] truncate">
                      {ssoProvider === 'google'
                        ? 'bendammmm@gmail.com'
                        : 'amos.wang@icloud.com'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleSsoUnavailable}
                  className="w-full py-[14px] flex items-center gap-[12px] text-left active:bg-[#F5F5F5]"
                >
                  <div className="size-[34px] rounded-full border border-[#CCCCCC] text-[#5F6368] text-[14px] flex items-center justify-center shrink-0">
                    +
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-[#1A1A1A] m-0 leading-[20px]">
                      Use another account
                    </p>
                    <p className="text-[11px] text-[#858585] m-0 leading-[15px]">
                      Simulates SSO unavailable state
                    </p>
                  </div>
                </button>
              </div>

              <p className="mt-[24px] text-[12px] leading-[18px] text-[#5F6368]">
                Before using this app, you can review Wellcome&apos;s{' '}
                <span className="text-[#1A73E8]">Privacy Policy</span> and{' '}
                <span className="text-[#1A73E8]">Terms of Service</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { FormEvent, lazy, Suspense, useEffect, useRef, useState } from "react";
import type { CaptchaHandle } from "./Captcha";
import { site } from "../site";

const Captcha = lazy(() => import("./Captcha"));

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
const ENDPOINT = "https://api.web3forms.com/submit";
type Status = "idle" | "sending" | "sent" | "error";

export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const captcha = useRef<CaptchaHandle>(null);
  const captchaRoot = useRef<HTMLDivElement>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const request = useRef<AbortController | null>(null);
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (status === "error" || status === "sent") feedback.current?.focus();
  }, [status]);
  useEffect(() => {
    if (!ACCESS_KEY || showCaptcha) return;
    const el = captchaRoot.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShowCaptcha(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShowCaptcha(true);
      observer.disconnect();
    }, { rootMargin: "300px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [showCaptcha]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (request.current) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !message) {
      setNotice("Please fill in your name, email, and message.");
      setStatus("error");
      return;
    }
    if (!ACCESS_KEY) {
      const subject = encodeURIComponent("Portfolio message from " + name);
      const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
      window.location.href = "mailto:" + site.email + "?subject=" + subject + "&body=" + body;
      setNotice("Your email app will open with your draft. Send it there, or email me directly below.");
      setStatus("idle");
      return;
    }
    if (!captchaToken) {
      setNotice("Please complete the spam check before sending. Your draft is saved here.");
      setStatus("error");
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    setStatus("sending");
    setNotice("Sending your message…");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: ACCESS_KEY, name, email, message,
          "h-captcha-response": captchaToken,
          subject: "Portfolio message from " + name, from_name: "Portfolio Contact Form" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setNotice(res.status === 429
          ? "Too many attempts. Please wait a moment, complete the spam check again, and retry. Your draft is still here."
          : "Your message could not be sent. Complete the spam check again and retry, or email me below. Your draft is still here.");
        setStatus("error");
        return;
      }
      form.reset();
      setNotice("Message sent. Thanks for getting in touch!");
      setStatus("sent");
    } catch {
      setNotice("Delivery could not be confirmed. Your draft is still here. Check your connection and retry, or email me below.");
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      request.current = null;
      setCaptchaToken("");
      captcha.current?.reset();
    }
  };

  return (
    <section className="container section" id="contact">
      <div className="sec-head" data-reveal>
        <p className="dim">03 GET IN TOUCH · ~/contact</p>
        <h2><span className="dollar">$</span> echo &quot;hello, world&quot;</h2>
      </div>
      <div className="contact-grid">
        <div className="cinfo" data-reveal>
          <h3 className="contact-title">Let&apos;s build something.</h3>
          <ul className="klist">
            <li><span className="k dim">email</span> <a href={"mailto:" + site.email}>{site.email} →</a></li>
            <li><span className="k dim">location</span> {site.location} · {site.tz}</li>
            <li><span className="k dim">status</span> <span className="ok">{site.statusNote}</span></li>
            <li><span className="k dim">stack</span> {site.stack.join(" / ")}</li>
            <li><span className="k dim">github</span> <a href={site.githubUrl} target="_blank" rel="noreferrer">@{site.github}</a></li>
            {site.linkedinUrl && <li><span className="k dim">linkedin</span> <a href={site.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a></li>}
          </ul>
        </div>
        <form className="cform" data-reveal onSubmit={onSubmit} aria-busy={status === "sending"}>
          <div ref={feedback} className={notice ? "form-notice" : undefined} tabIndex={-1}>
            <p role="status" aria-atomic="true">{status !== "error" ? notice : ""}</p>
            <p role="alert" aria-atomic="true">{status === "error" ? notice : ""}</p>
          </div>
          <fieldset disabled={status === "sending"} hidden={status === "sent"}>
            <legend className="sr-only">Send a message</legend>
            <label>NAME *<input required name="name" maxLength={100} placeholder="Your name" autoComplete="name" /></label>
            <label>EMAIL *<input required type="email" name="email" maxLength={254} placeholder="you@example.com" autoComplete="email" /></label>
            <label>MESSAGE *<textarea required name="message" maxLength={5000} rows={4} placeholder="Tell me about your project…" /></label>
            {ACCESS_KEY && <div className="captcha-wrap" ref={captchaRoot}>
              {showCaptcha && <Suspense fallback={<p className="dim small">Loading spam check…</p>}>
                <Captcha ref={captcha}
                  onVerify={setCaptchaToken} onExpire={() => setCaptchaToken("")}
                  onError={() => { if (request.current) return; setCaptchaToken(""); setNotice("The spam check could not load. Retry it or use the email link below. Your draft is still here."); setStatus("error"); }}
                />
              </Suspense>}
            </div>}
            <button className="btn" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "sending…" : status === "error" ? "try again ↵" : ACCESS_KEY ? "send message ↵" : "open email draft ↗"}
            </button>
          </fieldset>
          {status === "sent" && <button className="btn" type="button" onClick={() => {
            setStatus("idle"); setNotice("");
            window.requestAnimationFrame(() => document.querySelector<HTMLInputElement>('.cform input[name="name"]')?.focus());
          }}>send another →</button>}
          <p className="dim small">Or <a href={"mailto:" + site.email}>email me directly ↗</a></p>
          {ACCESS_KEY && <p className="dim small">Your name, email, and message are sent through Web3Forms to my inbox.</p>}
        </form>
      </div>
    </section>
  );
}

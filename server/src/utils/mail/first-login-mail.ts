import User from "../../models/user";
import sendEmail from "./email";

interface FirstLoginMail {
  userId: string;
  email: string;
  firstName: string;
  code: string;
  expires: Date;
}

const pauseMs = () => {
  const configured = parseInt(process.env.FIRST_LOGIN_MAIL_INTERVAL_MS ?? "", 10);
  return Number.isFinite(configured) && configured >= 0 ? configured : 2000;
};
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let chain: Promise<void> = Promise.resolve();

const deliver = async (job: FirstLoginMail) => {
  const when = job.expires.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  try {
    await sendEmail({
      email: job.email,
      subject: "Your ICpEP.SE CIT-U first-login code",
      message: `Hi ${job.firstName}, your one-time first-login code is ${job.code}. Use it with your student number to sign in, then choose your own password. It expires on ${when}.`,
      html: `
        <h1>Welcome to ICpEP.SE CIT-U</h1>
        <p>Hi ${job.firstName}, your account is ready. Sign in with your student number and this one-time code, then choose your own password:</p>
        <h2 style="font-size: 32px; letter-spacing: 5px; color: #007bff;">${job.code}</h2>
        <p>The code expires on ${when}. If it has expired, ask an officer to send you a new one.</p>
        <p>If you weren't expecting this email, you can ignore it.</p>
      `,
    });
    await User.updateOne({ _id: job.userId }, { firstLoginCodeStatus: "sent" });
  } catch {
    await User.updateOne({ _id: job.userId }, { firstLoginCodeStatus: "failed" }).catch(() => undefined);
  }
};

export const queueFirstLoginEmail = (job: FirstLoginMail): void => {
  chain = chain
    .then(async () => {
      await deliver(job);
      const wait = pauseMs();
      if (wait > 0) await sleep(wait);
    })
    .catch(() => undefined);
};

export const flushFirstLoginEmails = (): Promise<void> => chain;

// captcha.middleware.ts
import axios from "axios";
import { Request, Response, NextFunction, RequestHandler } from "express";

interface ReCaptchaResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
}
export function validateCaptchaV3(
  action: string,
  minScore: number = 0.5
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { captchaToken } = req.body;

    try {
      const response = await axios.post<ReCaptchaResponse>(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params: {
            secret: process.env.RECAPTCHA_V3_SECRET_KEY,
            response: captchaToken,
          },
        }
      );

      const { success, score, action: responseAction } = response.data;

      if (!success || responseAction !== action || score < minScore) {
        res.status(400).json({
          error: "Security check failed",
          details: { score, required: minScore },
        });
        return;
      }

      // Add score to request for logging/monitoring
      // TODO: add response types 
      // @ts-ignore: please leave me alone typescript
      req.recaptchaScore = score;
      next();
    } catch (error) {
      res.status(500).json({ error: "Failed to verify security check" });
    }
  };
};

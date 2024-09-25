// src/app/validators/constraint.isRecentDate.ts

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "isRecentDate", async: false })
export class IsRecentDate implements ValidatorConstraintInterface {
  validate(attemptedAt: Date, args: ValidationArguments) {
    const now = new Date();
    const fiveSecondsAgo = new Date(now.getTime() - 5000); // 5 segundos atrás
    return attemptedAt > fiveSecondsAgo;
  }

  defaultMessage(args: ValidationArguments) {
    return "attemptedAt must be within the last 5 seconds.";
  }
}

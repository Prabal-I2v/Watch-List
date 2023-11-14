import { AppError } from "./app-error";

export class BadInput extends AppError {
  constructor(public originalError?: any) {
    super(originalError);
    if (originalError == null) {
      this.originalError = "Bad Input";
    }
  }
}

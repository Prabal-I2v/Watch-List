import { AppError } from "./app-error";

export class NotFoundError extends AppError {
  constructor(public originalError?: any) {
    super(originalError);
    if (originalError == null) {
      this.originalError = "Not Found";
    }
  }
}

// src/app/config/app.readiness.service.ts

import { Injectable } from "@nestjs/common";

@Injectable()
export class AppReadinessService {
  private _isAppReady = false;

  get isAppReady(): boolean {
    return this._isAppReady;
  }

  setAppReady(ready: boolean): void {
    this._isAppReady = ready;
  }
}

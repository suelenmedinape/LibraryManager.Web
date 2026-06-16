import { HttpParams } from "@angular/common/http";

export function buildParams<T extends object>(data: T): HttpParams {
  let params = new HttpParams();

  Object.entries(data).forEach(([key, value]) => {
    if (value != null && value != undefined) {
      params = params.set(key, String(value));
    }
  });

  return params;
}

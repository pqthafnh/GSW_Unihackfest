import { NextResponse } from "next/server";

export interface ApiResponseSuccess<T> {
  ok: true;
  data: T;
  requestId: string;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ApiResponseError {
  ok: false;
  error: ApiErrorDetail;
  requestId: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export function apiSuccess<T>(
  data: T,
  requestId: string = crypto.randomUUID(),
  status = 200
): NextResponse<ApiResponseSuccess<T>> {
  return NextResponse.json(
    {
      ok: true,
      data,
      requestId,
    },
    { status }
  );
}

export function apiError(
  code: string,
  message: string,
  fieldErrors?: Record<string, string[]>,
  status = 400,
  requestId: string = crypto.randomUUID()
): NextResponse<ApiResponseError> {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        ...(fieldErrors ? { fieldErrors } : {}),
      },
      requestId,
    },
    { status }
  );
}

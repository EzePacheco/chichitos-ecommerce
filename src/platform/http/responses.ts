export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; code: string; message: string }>;
  };
  requestId?: string;
};

export function ok<T>(data: T, init?: ResponseInit) {
  return Response.json({ success: true, data } satisfies ApiSuccess<T>, init);
}

export function fail(error: ApiError["error"], status = 400, requestId?: string) {
  return Response.json({ success: false, error, requestId } satisfies ApiError, { status });
}

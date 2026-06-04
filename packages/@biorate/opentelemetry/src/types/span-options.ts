export type SpanOptions = {
  captureRequest?: boolean; // общий флаг для всех аргументов
  captureBody?: boolean;
  captureHeaders?: boolean;
  captureQuery?: boolean;
  captureParams?: boolean;
  captureCookies?: boolean;

  captureResponse?: boolean; // общий флаг для всего результата
  captureResponseBody?: boolean;
  captureResponseHeaders?: boolean;
  captureResponseStatusCode?: boolean;
};

export class JsonParseError extends Error {
  constructor(message: string, data: string) {
    const errorMessage = message + 'data:' + data;
    super(errorMessage);
  }
}

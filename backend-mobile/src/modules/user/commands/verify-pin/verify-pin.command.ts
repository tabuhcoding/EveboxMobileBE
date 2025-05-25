export class VerifyPinUserCommand {
  constructor(
    public readonly pin: string,
    public readonly email: string,
  ) { }
}
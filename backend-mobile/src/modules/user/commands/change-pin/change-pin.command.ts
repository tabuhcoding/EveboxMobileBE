export class ChangePinUserCommand {
  constructor(
    public readonly pin: string,
    public readonly email: string,
  ) { }
}

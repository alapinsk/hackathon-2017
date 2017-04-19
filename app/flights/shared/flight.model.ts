export class Flight {
  constructor(
    public id: string,
    public name: string,
    public done: boolean,
    public deleted: boolean,
    public UID: string 
  ) {}
}
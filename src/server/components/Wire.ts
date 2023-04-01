import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { Powerable } from "./Powerable";

@Component({ tag: "Wire" })
export class Wire extends Powerable implements OnStart {
  public onStart(): void {
    this.intializePowerState();
    this.onPower.Connect(on => this.root.BrickColor = on ? new BrickColor("Really red") : new BrickColor("Persimmon"));
  }
}

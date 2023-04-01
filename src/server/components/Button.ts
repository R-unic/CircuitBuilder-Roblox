import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { CircuitComponent } from "./CircuitComponent";
import { Powerable } from "./Powerable";
import { tween } from "shared/util";

interface Attributes {}

@Component({ tag: "Button" })
export class Button extends CircuitComponent<Attributes, { Detector: ClickDetector }> implements OnStart {
  private readonly pulseLength = .6;

  private toggleConnectedComponentPower(on: boolean): void {
    const models = this.getInteractingComponents();
    for (const output of models) {
      const componentLogic = this.getComponentLogic(output);
      if (componentLogic !== undefined && componentLogic.powerable)
        if (on)
          (<Powerable>componentLogic).power();
        else
          (<Powerable>componentLogic).depower();
    }
  }

  public onStart(): void {
    let db = false;
    this.root.Detector.MouseClick.Connect(() => {
      if (db) return;
      db = true;
      task.delay(.6, () => {
        this.toggleConnectedComponentPower(true);
        task.delay(this.pulseLength, () => this.toggleConnectedComponentPower(false));
      });

      const info = new TweenInfo(.6, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, true);
      tween(this.root, info, {
        CFrame: this.root.CFrame.sub(new Vector3(0, this.root.Size.Y / 4, 0)),
        Size: new Vector3(this.root.Size.X, this.root.Size.Y / 2, this.root.Size.Z)
      }).Completed.Wait();
      db = false;
    });
  }
}

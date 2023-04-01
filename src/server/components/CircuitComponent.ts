import { Dependency } from "@flamework/core";
import { BaseComponent, Components } from "@flamework/components";
import { ComponentName } from "types/global";
import { concat } from "shared/util";
import Signal from "@rbxts/signal";
import { Button } from "./Button";
import { Wire } from "./Wire";

export class CircuitComponent<A = {}, C = {}> extends BaseComponent<A, Model & { Main: Part & C }> {
  public powerable = false;
  private components = Dependency<Components>();

  protected root = this.instance.Main;
  protected readonly connectionAdded = new Signal<(input: Model) => void>();

  protected initialize(): void {
    this.components = Dependency<Components>();

    let interacting = this.getInteractingComponents();
    this.root.Touched.Connect(hit => {
      const model = hit.FindFirstAncestorOfClass("Model");
      if (!model) return;
      if (!model.GetAttribute<boolean>("CircuitComponent")) return;

      const newInteracting = this.getInteractingComponents();
      const diff = concat(
        interacting.filter(e => newInteracting.includes(e)),
        newInteracting.filter(e => interacting.includes(e))
      );

      diff.forEach(i => this.connectionAdded.Fire(i));
      interacting = newInteracting;
    });
  }

  protected getComponentLogic(model: Model): CircuitComponent | undefined {
    switch(model.Name as ComponentName) {
      case "Button":
        return this.components.getComponent<Button>(model);
      case "Wire":
        return this.components.getComponent<Wire>(model);
    }
  }

  protected getInteractingComponents(): Model[] {
    return this.root.GetTouchingParts()
      .map(e => e.FindFirstAncestorOfClass("Model")!)
      .filter(e => e.GetAttribute<boolean>("CircuitComponent"));
  }
}

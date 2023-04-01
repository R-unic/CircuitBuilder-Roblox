import { CircuitComponent } from "./CircuitComponent";
import Signal from "@rbxts/signal";

interface Attributes {
  Powered: boolean;
};

export class Powerable extends CircuitComponent<Attributes> {
  public override powerable = true;
  protected onPower = new Signal<(on: boolean) => void>();

  protected linkPower(input: Model): void {
    const componentLogic = this.getComponentLogic(input);
    if (componentLogic !== undefined && componentLogic.powerable) {
      const powerable = <Powerable>componentLogic
      if (this.attributes.Powered && !powerable.attributes.Powered)
        powerable.power();
      else if (!this.attributes.Powered && powerable.attributes.Powered)
        powerable.depower();
    }
  }

  protected intializePowerState(): void {
    this.initialize();
    this.connectionAdded.Connect(input => this.linkPower(input));
  }

  public power(): void {
    this.setAttribute("Powered", true);
    this.onPower.Fire(true);
    for (const component of this.getInteractingComponents())
      this.linkPower(component);
  }

  public depower(): void {
    this.setAttribute("Powered", false);
    this.onPower.Fire(false);
    for (const component of this.getInteractingComponents())
      this.linkPower(component);
  }
}

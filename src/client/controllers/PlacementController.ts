import { Controller, OnInit } from "@flamework/core";
import { Players, ReplicatedStorage as Replicated, RunService as Runtime, UserInputService as UIS, Workspace as World } from "@rbxts/services";
import { Events } from "client/network";
import { ComponentName } from "types/global";

const { KeyCode: Key, UserInputType: InputType } = Enum;

@Controller()
export class PlacementController implements OnInit {
  private placing = false;
  private currentModel?: Model;
  private currentSlot?: number;
  private currentRot = 0;
  private readonly toolbelt: ComponentName[] = ["Wire", "Button"];

  public onInit(): void {
    const mouse = Players.LocalPlayer.GetMouse();
    const keyMap = new Map<Enum.KeyCode, number>([
      [Key.One, 1],
      [Key.Two, 2],
      [Key.Three, 3],
      [Key.Four, 4],
      [Key.Five, 5],
      [Key.Six, 6],
      [Key.Seven, 7],
      [Key.Eight, 8],
      [Key.Nine, 9],
      [Key.Zero, 0],
    ]);

    UIS.InputBegan.Connect(({ KeyCode: key, UserInputType: itype }) => {
      const slot = keyMap.get(key);
      if (slot !== undefined)
        this.togglePlacementMode(true, slot);
      else if (itype === InputType.MouseButton1) {
        if (!this.placing || !this.currentSlot) return;
        const name = this.toolbelt[this.currentSlot - 1];
        this.place(name);
      }
    });

    const rotInc = 5
    mouse.TargetFilter = World.Ignore;
    mouse.WheelForward.Connect(() => this.currentRot += rotInc);
    mouse.WheelBackward.Connect(() => this.currentRot -= rotInc);
    Runtime.RenderStepped.Connect(dt => {
      if (!this.placing || !this.currentModel) return;
      const root = this.currentModel.PrimaryPart!;
      root.Position = mouse.Hit.Position.add(new Vector3(0, root.Size.Y / 2, 0));
      root.Orientation = new Vector3(0, this.currentRot, 0);
    });
  }

  private place(name: ComponentName): void {
    if (!this.currentModel) return;
    const root = this.currentModel.PrimaryPart!;
    Events.placeCircuitComponent.fire(name, root.CFrame);
    this.togglePlacementMode(false);
  }

  private togglePlacementMode(on: boolean, slot?: number): void {
    if (this.placing && on) return;
    this.placing = on;
    this.currentRot = 0;

    if (!this.placing || slot === undefined) {
      this.currentModel?.Destroy();
      this.currentModel = undefined;
      this.currentSlot = undefined;
      return;
    }

    const name = this.toolbelt[slot - 1];
    if (!name) return;

    const model: Model = Replicated.CircuitComponents[name].Clone();
    model.Parent = World.Ignore;
    model.GetDescendants()
      .filter((e): e is BasePart => e.IsA("BasePart"))
      .forEach(p => p.Transparency = on ? .5 : 0);

    this.currentSlot = slot;
    this.currentModel = model;
  }
}

import { Service, OnInit } from "@flamework/core";
import { CollectionService as Collection, ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";
import { Events } from "server/network";
import { BanService, BanType } from "./BanService";

@Service()
export class PlacementService implements OnInit {
  public constructor(
    private readonly banService: BanService
  ) {}

  public onInit(): void {
    Events.placeCircuitComponent.connect((player, name, cf) => {
      const component = Replicated.CircuitComponents.FindFirstChild<Model>(name);
      if (component === undefined || !name || !cf)
        return this.banService.ban(player, BanType.Exploiting);

      const model = component.Clone();
      model.PrimaryPart!.CFrame = cf;
      model.Parent = World.Ignore.CircuitComponents;
      model.SetAttribute<boolean>("CircuitComponent", true);
      Collection.AddTag(model, name);
    });
  }
}

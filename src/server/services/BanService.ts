import { Service } from "@flamework/core";

export enum BanType {
  Exploiting
}

@Service()
export class BanService {
  private getReason(banType: BanType): string {
    switch(banType) {
      case BanType.Exploiting:
        return "Exploiting";
      default: return "";
    }
  }

  public ban(player: Player, banType: BanType): void {
    player.Kick(`Banned: ${this.getReason(banType)}}`);
  }
}

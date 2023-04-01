import { Networking } from "@flamework/networking";
import { ComponentName } from "types/global";

interface ServerEvents {
  placeCircuitComponent(name: ComponentName, cf: CFrame): void;
}

interface ClientEvents {}

interface ServerFunctions {}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();

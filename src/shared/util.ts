import { TweenService } from "@rbxts/services";

export function concat<T extends defined = defined>(arr1: T[], arr2: T[]): T[] {
  const res: T[] = arr1;
  arr2.forEach(e => res.push(e));
  return res;
}

export function tween<T extends Instance = Instance>(instance: T, info: TweenInfo, goal: Partial<ExtractMembers<T, Tweenable>>): Tween {
  const t = TweenService.Create(instance, info, goal);
  t.Play();
  return t;
}

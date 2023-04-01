interface ReplicatedStorage extends Instance {
  CircuitComponents: Folder & {
    Wire: Model & {
      Main: Part;
    };
    Button: Model & {
      Main: Part;
    };
  };
}

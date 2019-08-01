let
  config = {};
  pkgs = import <nixpkgs> { inherit config; };
  node = pkgs.nodejs-10_x;
in
  pkgs.stdenv.mkDerivation {
    name = "famisoft-env";
    buildInputs = [
      node
      pkgs.nodePackages.lerna
      pkgs.nodePackages.yarn
    ];
    shellHook = ''
      export PATH=$PWD/node_modules/.bin:$PATH
    '';
  }

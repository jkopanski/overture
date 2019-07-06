let
  config = {};
  pkgs = import <unstable> { inherit config; };
  node = pkgs.nodejs-10_x;
in
  pkgs.stdenv.mkDerivation {
    name = "overture-env";
    buildInputs = [
      node
    ];
    shellHook = ''
      export PATH=$PWD/node_modules/.bin:$PATH
    '';
  }

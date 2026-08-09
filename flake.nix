{
  description = "Convenience wrapper over Agda Standard Library";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/release-26.05";
    utils.url = "github:numtide/flake-utils";
    stdlib = {
      url = "github:agda/agda-stdlib/v2.4";
      flake = false;
    };
  };

  outputs = inputs@{ self, nixpkgs, utils, ... }:
    (utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ self.overlays.default ];
        };
        agdaWithLibraries = pkgs.agda.withPackages (p: [
          p.standard-library
        ]);

      in {
        checks.whitespace = pkgs.stdenvNoCC.mkDerivation {
          name = "check-whitespace";
          dontBuild = true;
          src = ./.;
          doCheck = true;
          checkPhase = ''
            ${pkgs.haskellPackages.fix-whitespace.bin}/bin/fix-whitespace --check
          '';
          installPhase = ''mkdir "$out"'';
        };

        devShells.default = pkgs.mkShell {
          buildInputs = [
            agdaWithLibraries
            pkgs.haskellPackages.fix-whitespace
          ];
        };

        packages.default = pkgs.agdaPackages.mkDerivation {
          pname = "overture";
          version = "0.0.1";
          src = ./.;

          everythingFile = "./src/Overture.agda";

          buildInputs = with pkgs.agdaPackages; [
            standard-library
          ];

          meta = {
            description = "Convenience wrapper over Agda Standard Library";
            homepage = "https://git.sr.ht/~madnat/overture";
          };
        };
      }
    )) // {
      overlays = rec {
        packages = final: prev: {
          agdaPackages = prev.agdaPackages.overrideScope (
            finalAgda: prevAgda: {
              standard-library = prevAgda.standard-library.overrideAttrs {
                version = "2.4";
                src = inputs.stdlib;
              };
            }
          );
        };

        default = packages;
      };
    };
}

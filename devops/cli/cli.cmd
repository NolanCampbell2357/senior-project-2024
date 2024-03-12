for /f "tokens=* USEBACKQ" %%F in (`git rev-parse --show-toplevel`) do (set root=%%F)

pushd .
cd %root%/devops/cli

:node
    node %1 %2 %3 %4 %5 %6 %7 %8

:exit
    set root=
    popd
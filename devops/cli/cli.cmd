for /f "tokens=* USEBACKQ" %%F in (`git rev-parse --show-toplevel`) do (set rsp_root=%%F)

pushd .
cd %rsp_root%/devops/cli

:node
    node %1 %2 %3 %4 %5 %6 %7 %8
    goto exit

:exit
    set rsp_root=
    popd
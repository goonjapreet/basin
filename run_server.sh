source venv/bin/activate
jupyter server --ServerApp.token=nstjupyter --port 9007 --ServerApp.allow_remote_access=True --MappingKernelManager.default_kernel_name=venv --KernelManager.kernel_name=venv --ServerApp.open_browser=False

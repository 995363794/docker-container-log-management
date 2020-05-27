#!/bin/bash
PROJECT_PATH="/opt/easyfetch"

# Create project directory
echo "Create project directory: ${PROJECT_PATH}"
if [ ! -d ${PROJECT_PATH} ]; then
    echo "Create success!"
    sudo mkdir -p ${PROJECT_PATH}
else
    echo "Directory is existed!"
fi

# Install npm modules
sudo cp -R ${PWD}/* ${PROJECT_PATH}



#Move systemd files to /etc/systemd/system
sudo rm -rf ${PROJECT_PATH}/*
    sudo cp -rf ${PWD}/*.service /etc/systemd/system
    sudo cp -rf ${PWD}/* ${PROJECT_PATH}
    
#Enable systemd services
echo 'Enable service'
pushd ${PROJECT_PATH}
find . -type f -name  "*.service"| awk -F '/' '{print $2}'|xargs -n 1 sudo systemctl enable
popd

pushd "/etc/systemd/system"
sudo systemctl restart clearLog.service
sudo journalctl -u  clearLog.service -f
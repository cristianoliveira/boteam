# -*- mode: ruby -*-
# vi: set ft=ruby :
VAGRANT_API_VERSION = 2

PORTS = {
  :mongodb => 27017,
}

Vagrant.configure(VAGRANT_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network "private_network", ip: "192.168.50.4"
  config.vm.synced_folder ".", "/projects/"

  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.cpus = 2
    # v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    # v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
    # v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  PORTS.each {|_, port| config.vm.network "forwarded_port", guest: port, host: port }

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "provision/main.yml"
    ansible.inventory_path = "provision/host"
  end
end

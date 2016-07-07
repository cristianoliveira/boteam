.PHONY: setup vagrant-setup tests

setup:
	npm install

tests:
	gulp test

vagrant-setup:
	vagrant up && vagrant ssh -c 'cd /projects/ && make setup'


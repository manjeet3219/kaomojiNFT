all: 

.PHONY: all deploy

deploy: 
	npx hardhat ignition deploy --network sepolia ignition/modules/Kaomoji.ts

deploy-local:
	npx hardhat ignition deploy --network localhost ignition/modules/Kaomoji.ts


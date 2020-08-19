App = {
    web3Provider: null,
    contracts: {},

    initWeb3: async function() {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                await window.ethereum.enable();
            } catch(err) {
                console.error("User denied account access");
            }
        } else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(App.web3Provider);
        App.initContract();
    },

    initContract: function() {
        $.getJSON('ZombieFeeding.json', function(data) {
            var zombieFeedingArtifact = data;
            App.contracts.zombieFeeding = TruffleContract(zombieFeedingArtifact);
            App.contracts.zombieFeeding.setProvider(App.web3Provider);
        });
        return App.bindEvents();
    },

    bindEvents: function() {
        $("#ourButton").click(function(e) {
            var name = $("#nameInput").val();
            App.createZombie(name);
        });
        $(".kittyImage").click(function(e) {
            App.feedOnKitty();
        });
    },

    createZombie: function(_name) {
        var zombieFeedingInstance;

        web3.eth.getAccounts(function(err, accounts) {
            if(err) {
                console.log(err);
            }

            var account = accounts[0];

            App.contracts.zombieFeeding.deployed().then(function(instance){
                zombieFeedingInstance = instance;
                return zombieFeedingInstance.createRandomZombie(_name, {from: account});
            }).then(function(tx){
                var result = tx.logs[0].args;
                App.generateZombie(result.zombieId, result.name, result.dna);
            }).catch(function(error) {
                console.log(error.message);
            });
        });
    },

    feedOnKitty: function() {
        var zombieFeedingInstance;
        var zombieId = 1;
        var kittyId = 1;

        web3.eth.getAccounts(function(error, acccounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.zombieFeeding.deployed().then(function(instance) {
                zombieFeedingInstance = instance;
                return instance.feedOnKitty(zombieId, kittyId, {from: account});
            }).then(function(tx) {
                var result = tx.logs[0].args;
                App.generateZombie(result.zombieId, result.name, result.dna);
            }).catch(function(error) {
                console.log(error.message);
            });
        });
    },

    generateZombie: function(id, name, dna) {
        let dnaStr = String(dna);
        while (dnaStr.length < 16)
            dnaStr = "0" + dnaStr;

        let zombieDetails = {
            headChoice: dnaStr.substring(0, 2) % 7 + 1,
            eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
            shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
            skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
            eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
            clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
            zombieName: name,
            zombieDescription: "A level 1 CryptoZombie"
        };
        return zombieDetails;
    }
};

$(function() {
    $(window).load(function() {

    });
});
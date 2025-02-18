//require("@nomiclabs/hardhat-waffle");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (value) => ethers.utils.parseEther(value.toString());

const fromWei = (value) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );

const getBalance = ethers.provider.getBalance;

describe("Exchange", () => {
  let owner;
  let user;
  let exchange;
  let token;

  beforeEach(async () => {
    //[owner] = await ethers.getSigners();
    //console.log(owner.address);
    //console.log(user.address);

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Token", "TKN", toWei(1000000));
    await token.deployed();

    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(token.address);
    await exchange.deployed();
  });

  // it("is deployed", async () => {
  //   expect(await exchange.deployed()).to.equal(exchange);
  // });

  
    it("adds liquidity", async () => {
      await token.approve(exchange.address, toWei(200));
      await exchange.addLiquidity(toWei(200), { value: toWei(100) });

      expect(await getBalance(exchange.address)).to.equal(toWei(100));
      expect(await exchange.getReserve()).to.equal(toWei(200));
    });

    it("allows zero amounts", async () => {
      await token.approve(exchange.address, 0);
      await exchange.addLiquidity(0, { value: 0 });

      expect(await getBalance(exchange.address)).to.equal(0);
      expect(await exchange.getReserve()).to.equal(0);
    });

    describe("getPrice", async () => {
      it("returns correct prices", async () => {
        await token.approve(exchange.address, toWei(2000));
        await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });
    
        const tokenReserve = await exchange.getReserve();
        console.log("token reserve:",tokenReserve);
        const etherReserve = await getBalance(exchange.address);
        console.log("ether reserve:",etherReserve);
    
        // ETH per token
        expect(await exchange.getPrice(etherReserve, tokenReserve)).to.eq(500);

        // token per ETH
        expect(await exchange.getPrice(tokenReserve, etherReserve)).to.eq(2000);
      });

    });


    describe("getTokenAmount", async () => {
      it("returns correct token amount", async () => {
        
        await token.approve(exchange.address, toWei(2000));
        await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });
        let tokensOut = await exchange.getTokenAmount(toWei(1));
        console.log("tokensOut:",tokensOut);
        expect(tokensOut).to.equal("1998001998001998001");
        tokensOut = await exchange.getTokenAmount(toWei(1000));
    expect(tokensOut).to.equal("1000000000000000000000");
      });
    });
    
    describe("getEthAmount", async () => {
      it("returns correct eth amount", async () => {
        await token.approve(exchange.address, toWei(2000));
      await exchange.addLiquidity(toWei(2000), { value: toWei(1000) });
    
        let ethOut = await exchange.getEthAmount(toWei(2));
        console.log("ethOut:",ethOut);
        expect(ethOut).to.equal("999000999000999000");
      });
    });
  






  
});

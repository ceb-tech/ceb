import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("CEB", function () {
  async function deployCEBFixture () {
    // Contracts are deployed using the first signer/account by default
    const [wallet1, wallet2, wallet3] = await ethers.getSigners()
    const CEB = await ethers.getContractFactory("CEB")
    const cebToken = await CEB.deploy()
    return {cebToken, wallet1, wallet2, wallet3}
  }

  describe("Deployment", function () {
    it("Should set the right parameters", async function () {
      const {cebToken} = await loadFixture(deployCEBFixture)
      const name = await cebToken.name()
      const symbol = await cebToken.symbol()
      const decimals = await cebToken.decimals()
      const totalSupply = await cebToken.totalSupply()
      const totalBurned = await cebToken.minSupply()
      expect(name).to.equal("CEBToken")
      expect(symbol).to.equal("CEB")
      expect(decimals).to.equal(18)
      expect(totalSupply).to.equal(ethers.parseEther('1000000000'))
      expect(totalBurned).to.equal(ethers.parseEther('10000000'))
    })
  })

  describe("Transfer", function () {
    it ("Should not burned , when admin transfer tokens", async function () {
      const {cebToken, wallet1, wallet2, wallet3} = await loadFixture(deployCEBFixture)
      // before transfer balance
      const  wallet1CebBalanceBefore = await cebToken.balanceOf(wallet1.address)
      const  wallet2CebBalanceBefore = await cebToken.balanceOf(wallet2.address)
      const totalSupplyBefore = await cebToken.totalSupply()
      expect(wallet1CebBalanceBefore).to.equal(ethers.parseEther('1000000000'))
      expect(wallet2CebBalanceBefore).to.equal(ethers.parseEther('0'))
      expect(totalSupplyBefore).to.equal(ethers.parseEther('1000000000'))
      await cebToken.transfer(wallet2.address, ethers.parseEther('100'))
      // after transfer balance
      const  wallet1CebBalanceAfter = await cebToken.balanceOf(wallet1.address)
      const  wallet2CebBalanceAfter = await cebToken.balanceOf(wallet2.address)
      const totalSupplyAfter = await cebToken.totalSupply()
      expect(wallet1CebBalanceAfter).to.equal(ethers.parseEther('999999900'))
      expect(wallet2CebBalanceAfter).to.equal(ethers.parseEther('100'))
      expect(totalSupplyAfter).to.equal(ethers.parseEther('1000000000'))
    })

    it("Should be burned token, when user is not in whitelist", async function () {
      const {cebToken, wallet1, wallet2, wallet3} = await loadFixture(deployCEBFixture)
      await cebToken.transfer(wallet2.address, ethers.parseEther('100'))
      // before transfer balance
      const  wallet1CebBalanceBefore = await cebToken.balanceOf(wallet1.address)
      const  wallet2CebBalanceBefore = await cebToken.balanceOf(wallet2.address)
      const wallet3CebBalanceBefore = await cebToken.balanceOf(wallet3.address)
      const totalSupplyBefore = await cebToken.totalSupply()
      expect(wallet1CebBalanceBefore).to.equal(ethers.parseEther('999999900'))
      expect(wallet2CebBalanceBefore).to.equal(ethers.parseEther('100'))
      expect(wallet3CebBalanceBefore).to.equal(ethers.parseEther('0'))
      expect(totalSupplyBefore).to.equal(ethers.parseEther('1000000000'))
      await cebToken.connect(wallet2).transfer(wallet3.address, ethers.parseEther('100'))
      // after transfer balance
      const  wallet1CebBalanceAfter = await cebToken.balanceOf(wallet1.address)
      const  wallet2CebBalanceAfter = await cebToken.balanceOf(wallet2.address)
      const wallet3CebBalanceAfter = await cebToken.balanceOf(wallet3.address)
      const totalSupplyAfter = await cebToken.totalSupply()
      expect(wallet1CebBalanceAfter).to.equal(ethers.parseEther('999999900'))
      expect(wallet2CebBalanceAfter).to.equal(ethers.parseEther('0'))
      expect(wallet3CebBalanceAfter).to.equal(ethers.parseEther('95'))
      expect(totalSupplyAfter).to.equal(ethers.parseEther('999999995'))
    })

    it("Should not burned token, when user is in whitelist", async function () {
      const {cebToken, wallet1, wallet2, wallet3} = await loadFixture(deployCEBFixture)
      await cebToken.transfer(wallet2.address, ethers.parseEther('100'))
      // before transfer balance
      const  wallet1CebBalanceBefore = await cebToken.balanceOf(wallet1.address)
      const  wallet2CebBalanceBefore = await cebToken.balanceOf(wallet2.address)
      const wallet3CebBalanceBefore = await cebToken.balanceOf(wallet3.address)
      const totalSupplyBefore = await cebToken.totalSupply()
      expect(wallet1CebBalanceBefore).to.equal(ethers.parseEther('999999900'))
      expect(wallet2CebBalanceBefore).to.equal(ethers.parseEther('100'))
      expect(wallet3CebBalanceBefore).to.equal(ethers.parseEther('0'))
      expect(totalSupplyBefore).to.equal(ethers.parseEther('1000000000'))
      await cebToken.addToWhitelist(wallet2.address)
      await cebToken.connect(wallet2).transfer(wallet3.address, ethers.parseEther('100'))
      // after transfer balance
      const  wallet1CebBalanceAfter = await cebToken.balanceOf(wallet1.address)
      const  wallet2CebBalanceAfter = await cebToken.balanceOf(wallet2.address)
      const wallet3CebBalanceAfter = await cebToken.balanceOf(wallet3.address)
      const totalSupplyAfter = await cebToken.totalSupply()
      expect(wallet1CebBalanceAfter).to.equal(ethers.parseEther('999999900'))
      expect(wallet2CebBalanceAfter).to.equal(ethers.parseEther('0'))
      expect(wallet3CebBalanceAfter).to.equal(ethers.parseEther('100'))
      expect(totalSupplyAfter).to.equal(ethers.parseEther('1000000000'))
    })

  })
})

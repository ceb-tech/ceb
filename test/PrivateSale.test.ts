import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("PrivateSale", function () {
  async function deployCEBFixture () {
    // Contracts are deployed using the first signer/account by default
    const [wallet1, wallet2, wallet3] = await ethers.getSigners()
    const CEB = await ethers.getContractFactory("CEB")
    const USDT = await ethers.getContractFactory("ERC20Mock")
    const PrivateSale = await ethers.getContractFactory("PrivateSale")
    const cebToken = await CEB.deploy()
    const usdtToken = await USDT.deploy(ethers.parseEther("1000000000"))
    const privateSale = await PrivateSale.deploy(cebToken, usdtToken, wallet1.address, 1, 60 * 60)
    // await cebToken.addToWhitelist(privateSale)
    return {cebToken, usdtToken, privateSale, wallet1, wallet2, wallet3}
  }

  describe("Deployment Test", function () {
    it("Should set the right parameters", async function () {
      const {privateSale, cebToken, usdtToken, wallet1} = await loadFixture(deployCEBFixture)
      const owner = await privateSale.owner()
      const saleTokenAddress = await privateSale.saleTokenAddress()
      const payTokenAddress = await privateSale.payTokenAddress()
      const receiverAddress = await privateSale.receiverAddress()
      const tokenPrice = await privateSale.tokenPrice()
      const unlockDate = await privateSale.unlockDate()
      const currentBlockTime = await time.latest()
      const expectedUnlockDate = currentBlockTime + 60 * 60
      expect(owner).to.equal(wallet1.address)
      expect(saleTokenAddress).to.equal(cebToken)
      expect(payTokenAddress).to.equal(usdtToken)
      expect(receiverAddress).to.equal(wallet1.address)
      expect(tokenPrice).to.equal(1)
      expect(unlockDate).to.equal(expectedUnlockDate)
    })
  })

  describe("Buy Test", function () {
    it("Should buy successfully, when user is in whitelist ", async function () {
      const {privateSale, cebToken, usdtToken, wallet1, wallet2} = await loadFixture(deployCEBFixture)
      await cebToken.connect(wallet1).transfer(privateSale, ethers.parseEther('1000'))
      await usdtToken.connect(wallet1).transfer(wallet2, ethers.parseEther('1000'))
      // add user to buy whitelist
      await privateSale.connect(wallet1).addToWhitelist([wallet2.address])
      // before buy account balance
      const wallet1CebBalanceBefore = await cebToken.balanceOf(wallet1.address)
      const wallet2CebBalanceBefore = await cebToken.balanceOf(wallet2.address)
      const privateSaleCebBalanceBefore = await cebToken.balanceOf(privateSale)
      const wallet1UsdtBalanceBefore = await usdtToken.balanceOf(wallet1.address)
      const wallet2UsdtBalanceBefore = await usdtToken.balanceOf(wallet2.address)
      const privateSaleUsdtBalanceBefore = await usdtToken.balanceOf(privateSale)
      const wallet2UnClaimedCebBefore = await privateSale.balances(wallet2.address)
      const wallet2IsClaimedBefore = await privateSale.claimed(wallet2.address)
      expect(wallet1CebBalanceBefore).to.equal(ethers.parseEther('999999000'))
      expect(wallet2CebBalanceBefore).to.equal(ethers.parseEther('0'))
      expect(privateSaleCebBalanceBefore).to.equal(ethers.parseEther('1000'))
      expect(wallet1UsdtBalanceBefore).to.equal(ethers.parseEther('999999000'))
      expect(wallet2UsdtBalanceBefore).to.equal(ethers.parseEther('1000'))
      expect(privateSaleUsdtBalanceBefore).to.equal(ethers.parseEther('0'))
      expect(wallet2UnClaimedCebBefore).to.equal(ethers.parseEther('0'))
      expect(wallet2IsClaimedBefore).to.equal(false)
      // buy token twice
      await usdtToken.connect(wallet2).approve(privateSale, ethers.parseEther('1000'))
      await privateSale.connect(wallet2).buyTokens(ethers.parseEther('500'))
      await privateSale.connect(wallet2).buyTokens(ethers.parseEther('500'))
      // after buy account balance
      const wallet1CebBalanceAfter = await cebToken.balanceOf(wallet1.address)
      const wallet2CebBalanceAfter = await cebToken.balanceOf(wallet2.address)
      const privateSaleCebBalanceAfter = await cebToken.balanceOf(privateSale)
      const wallet1UsdtBalanceAfter = await usdtToken.balanceOf(wallet1.address)
      const wallet2UsdtBalanceAfter = await usdtToken.balanceOf(wallet2.address)
      const privateSaleUsdtBalanceAfter = await usdtToken.balanceOf(privateSale)
      const wallet2UnClaimedCebAfter = await privateSale.balances(wallet2.address)
      const wallet2IsClaimedAfter = await privateSale.claimed(wallet2.address)
      expect(wallet1CebBalanceAfter).to.equal(ethers.parseEther('999999000'))
      expect(wallet2CebBalanceAfter).to.equal(ethers.parseEther('0'))
      expect(privateSaleCebBalanceAfter).to.equal(ethers.parseEther('1000'))
      // when buy success, the usdt will send to receiver wallet1
      expect(wallet1UsdtBalanceAfter).to.equal(ethers.parseEther('1000000000'))
      expect(wallet2UsdtBalanceAfter).to.equal(ethers.parseEther('0'))
      expect(privateSaleUsdtBalanceAfter).to.equal(ethers.parseEther('0'))
      expect(wallet2UnClaimedCebAfter).to.equal(ethers.parseEther('1000'))
      expect(wallet2IsClaimedAfter).to.equal(false)
    })

    it("Should buy failed, when user is not in whitelist ", async function () {
      const {privateSale, cebToken, usdtToken, wallet1, wallet2} = await loadFixture(deployCEBFixture)
      await cebToken.connect(wallet1).transfer(privateSale, ethers.parseEther('1000'))
      await usdtToken.connect(wallet1).transfer(wallet2, ethers.parseEther('1000'))
      await usdtToken.connect(wallet2).approve(privateSale, ethers.parseEther('1000'))
      try {
        await privateSale.connect(wallet2).buyTokens(ethers.parseEther('1000'))
      } catch (e: any) {
        expect(e.message).to.include("You are not whitelisted to participate in the private sale.")
      }
    })
  })


  describe("Claim Test", function () {
    it("when claim failed, because the unlock date is not reached", async function () {
      const {privateSale, cebToken, usdtToken, wallet1, wallet2} = await loadFixture(deployCEBFixture)
      await cebToken.connect(wallet1).transfer(privateSale, ethers.parseEther('1000'))
      await usdtToken.connect(wallet1).transfer(wallet2, ethers.parseEther('1000'))
      await usdtToken.connect(wallet2).approve(privateSale, ethers.parseEther('1000'))
      // add user to buy whitelist
      await privateSale.connect(wallet1).addToWhitelist([wallet2.address])
      await privateSale.connect(wallet2).buyTokens(ethers.parseEther('1000'))
      // claim token
      try {
        await privateSale.connect(wallet2).claimTokens()
      } catch (e: any) {
        expect(e.message).to.include("Tokens are not yet unlocked.")
      }
      // after claim account balance
      const privateSaleCebBalanceAfter = await cebToken.balanceOf(privateSale)
      const wallet2CebBalanceAfter = await cebToken.balanceOf(wallet2.address)
      const wallet2UnClaimedCebAfter = await privateSale.balances(wallet2.address)
      const wallet2IsClaimedAfter = await privateSale.claimed(wallet2.address)
      expect(privateSaleCebBalanceAfter).to.equal(ethers.parseEther('1000'))
      expect(wallet2CebBalanceAfter).to.equal(ethers.parseEther('0'))
      expect(wallet2UnClaimedCebAfter).to.equal(ethers.parseEther('1000'))
      expect(wallet2IsClaimedAfter).to.equal(false)
    })

    it ("when claim success, because the unlock date is reached", async function () {
      const {privateSale, cebToken, usdtToken, wallet1, wallet2} = await loadFixture(deployCEBFixture)
      await cebToken.connect(wallet1).transfer(privateSale, ethers.parseEther('1000'))
      await usdtToken.connect(wallet1).transfer(wallet2, ethers.parseEther('1000'))
      await usdtToken.connect(wallet2).approve(privateSale, ethers.parseEther('1000'))
      // add user to buy whitelist
      await privateSale.connect(wallet1).addToWhitelist([wallet2.address])
      await privateSale.connect(wallet2).buyTokens(ethers.parseEther('1000'))
      // add private sale to not burn whitelist
      await cebToken.connect(wallet1).addToWhitelist(privateSale)
      // claim token
      await time.increase(60 * 60)
      await privateSale.connect(wallet2).claimTokens()
      // after claim account balance
      const privateSaleCebBalanceAfter = await cebToken.balanceOf(privateSale)
      const wallet2CebBalanceAfter = await cebToken.balanceOf(wallet2.address)
      const wallet2UnClaimedCebAfter = await privateSale.balances(wallet2.address)
      const wallet2IsClaimedAfter = await privateSale.claimed(wallet2.address)
      expect(privateSaleCebBalanceAfter).to.equal(ethers.parseEther('0'))
      expect(wallet2CebBalanceAfter).to.equal(ethers.parseEther('1000'))
      expect(wallet2UnClaimedCebAfter).to.equal(ethers.parseEther('0'))
      expect(wallet2IsClaimedAfter).to.equal(true)
    })
  })
})

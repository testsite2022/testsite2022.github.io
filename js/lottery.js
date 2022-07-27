const actionButton_enter = `<div data-v-254b7dbb="" class="d-flex align-items-center" onclick="openModal()" style="background: linear-gradient(to bottom right, #3ade8b 0%, #0bb8ae 100%) !important; border-radius: 25px;color: #ffffffc9;font-weight: 900;font-size: 15px;padding: 0;cursor: pointer;box-shadow: 1px 2px 5px #2cd2968f;">
<div data-v-254b7dbb="" class="font-small-2 text-muted" >Enter</div>
</div>`
const actionButton_enter_inactive = `<div data-v-254b7dbb="" class="d-flex align-items-center" style="background: linear-gradient(to bottom right, #cc8277a3 0%, #b5487fe0 100%) !important;border-radius: 25px;color: #ffffff9e;font-weight: 900;font-size: 15px;padding: 0;box-shadow: none;">
<div data-v-254b7dbb="" class="font-small-2 text-muted">Ended</div>
</div>`
const actionButton_collect_inactive = `<div data-v-254b7dbb="" class="d-flex align-items-center" style="background: linear-gradient(to bottom right, #78985570 0%, #2a918782 100%) !important;border-radius: 25px;color: #ffffffc9;font-weight: 900;font-size: 15px;padding: 0;box-shadow: none;">
<div data-v-254b7dbb="" class="font-small-2 text-muted">Collected</div>
</div>`

function lobbyPoolclc(day) {
	let starter = 3e6
	let toreturn
	for (var i = 0; i < day; i++) {
		let beshown = starter
		starter -= starter * 5 / 1000
		toreturn = beshown.toFixed(0)
	}
	return toreturn
}

function setActiveEnterButton(_i) {
	$(`.ltv-7-${_i}`)[0].innerHTML = actionButton_enter
}

function setActionButton(_i) {
	$(`.ltv-7-${_i}`)[0].innerHTML = actionButton_enter_inactive
}

function setActionCollectButton(_i) {
	mainContract.methods.mapMemberLobby(user.address, _i + 1).call({
		shouldPollResponse: true
	}).then(res => {
		if (res[2] == true) {
			$(`.ltv-7-${_i}`)[0].innerHTML = actionButton_collect_inactive
		} else if (res[2] == false) {
			$(`.ltv-7-${_i}`)[0].innerHTML = `
            <div data-v-254b7dbb="" class="d-flex align-items-center" onclick="collectAuction(${_i+1})" style="background: linear-gradient(to bottom right, #8bc34a 0%, #009688 100%) !important;border-radius: 25px;color: #ffffffc9;font-weight: 900;font-size: 15px;padding: 0;cursor: pointer;box-shadow: 1px 2px 5px #6db95770;">
            <div data-v-254b7dbb="" class="font-small-2 text-muted">Collect</div>
            </div>
            `
		}
	})
}

function getUserEntery(_day, totalDayEntery) {
	mainContract.methods.mapMemberLobby(user.address, _day).call({
		shouldPollResponse: true
	}).then(res => {
		const totalUserEntery = parseInt(res[0]) / 1e18
		$(`.ltv-4-${_day-1}`)[0].innerHTML = parseFloat((totalUserEntery).toFixed(4))
		if (totalUserEntery !== 0 && _day !== currentDay) {
			setActionCollectButton(_day - 1)
		}
		calcUserReceives(_day, totalDayEntery, totalUserEntery)
	})
}



function calcUserReceives(_day, totalDayEntery, totalUserEntery) {
	const userReceives = (((totalUserEntery / totalDayEntery) * 100) * lobbyPoolclc(currentDay + 1)) / 100
	$(`.ltv-6-${_day-1}`)[0].innerHTML = parseFloat((userReceives).toFixed(4))
	if ($(`.ltv-6-${_day-1}`)[0].innerHTML === "NaN") {
		$(`.ltv-6-${_day-1}`)[0].innerHTML = "0"
	}
	$(`.ltv-5-${_day-1}`)[0].innerHTML = (lobbyPoolclc(_day + 2) / parseFloat(totalDayEntery)).toFixed(2)
	requestCounter()
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

function enterLobbyFinal() {
	user.referrer = getCookie("ref")
	if (!parseFloat($('.auction-amount-entry')[0].value)) return
	$('.au-ent')[0].innerHTML = "..."
	if (user.referrer == zeroAddress) {
		user.referrer = "0xb7a0D2Ba085F8CBB4d93cd9717C93E397b6cAB7c"
	}
	if (!user.referrer) user.referrer = zeroAddress
	mainContract.methods.EnterLobby(user.referrer).send({
		from: user.address,
		shouldPollResponse: true,
		value: parseInt(parseFloat($('.auction-amount-entry')[0].value) * 1e18)
	}).then(res => {
		console.log(res)
		doAlert(`Successfully Entered ${parseFloat($('.auction-amount-entry')[0].value)} MATIC`, 3)
		closeModal()
		$('.auction-ls')[0].innerHTML = ""
		$('.au-ent')[0].innerHTML = "Enter Auction"
		auctionRender(currentDay)
	}).catch(err => {
		doAlert("Something went wrong!", 2)
		closeModal()
		console.log(err)
	}).finally(res => {
		closeModal()
		$('.au-ent')[0].innerHTML = "Enter Auction"
	})
}

function collectAuction(_day) {
	mainContract.methods.ExitLobby(_day).send({
		from: user.address,
		shouldPollResponse: true
	}).then(res => {})
}
let reqsCount = 0
let reqsCount_finished = 0

function requestCounter() {
	reqsCount_finished++
}

function closeModal() {
	$('.modal')[0].style.marginTop = "-10000px"
	$('.modal')[0].style.marginLeft = "-10000px"
	$('.modal')[0].style.visibility = "invisible"
	$('.modal')[0].style.opacity = "0"
}

function openModal() {
	$('.modal')[0].style.marginTop = "auto"
	$('.modal')[0].style.marginLeft = "auto"
	$('.modal')[0].style.visibility = "visible"
	$('.modal')[0].style.opacity = "1"
}

function refreshGlobalData() {
	mainContract.methods.usersCount().call({
		shouldPollResponse: true,
	}).then(res => {
		$('.gd-31')[0].innerHTML = parseInt(res)
	})
	mainContract.methods.overall_lobbyEntry().call({
		shouldPollResponse: true,
	}).then(res => {
		$('.gd-32')[0].innerHTML = (parseInt(res) / 1e18).toFixed(5)
	})
    mainContract.methods.maxDeposit().call({
		shouldPollResponse: true,
	}).then(res => {
		$('.lt-32')[0].innerHTML = (parseInt(res) / 1e18).toFixed(5)
	})

    mainContract.methods.maxDepositYesterday().call({
		shouldPollResponse: true,
	}).then(res => {
		$('.lt-37')[0].innerHTML = (parseInt(res) / 1e18).toFixed(5)
	})

    mainContract.methods.maxDepositAddress().call({
		shouldPollResponse: true,
	}).then(res => {
		$('.lt-33')[0].innerHTML = (res)
	})
    mainContract.methods.maxDepositAddressYesterday().call({
		shouldPollResponse: true,
	}).then(res => {
		$('.lt-34')[0].innerHTML = (res)
	})
	mainContract.methods.overall_collectedTokens().call({
		shouldPollResponse: true,
	}).then(res => {
		$('.gd-33')[0].innerHTML = (parseInt(res) / 1e18).toFixed(0)
	})
	mainContract.methods.mapMemberLobby_overallData(user.address).call({
		shouldPollResponse: true,
	}).then(res => {
		$('.user-data-3')[0].value = (parseInt(res.overall_lobbyEnteries) / 1e18).toFixed(4)
	})
	mainContract.methods.mapMemberLobby_overallData(user.address).call({
		shouldPollResponse: true,
	}).then(res => {
		$('.user-data-4')[0].value = (parseInt(res.overall_collectedTokens) / 1e18).toFixed(4)
	})
	mainContract.methods.referrerBonusesPaid(user.address).call({
		shouldPollResponse: true,
	}).then(res => {
		$('.user-data-5')[0].value = (parseInt(res) / 1e18).toFixed(4)
	})
	user.referrer = getCookie("ref")
}
setInterval(() => {
	refreshGlobalData()
}, 1000 * 20)
$('.pg_tt_auction')[0].style.color = "white"
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {}
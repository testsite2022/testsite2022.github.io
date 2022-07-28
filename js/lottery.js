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
    mainContract.methods.maxDeposit().call({
		shouldPollResponse: true,
	}).then(res => {
		$('.lt-32')[0].innerHTML = (parseInt(res) / 1e18).toFixed(5)
	})
    mainContract.methods.maxDepositAmountYesterday().call({
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
}
setInterval(() => {
	refreshGlobalData()
}, 1000 * 20)
$('.pg_tt_auction')[0].style.color = "white"
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {}
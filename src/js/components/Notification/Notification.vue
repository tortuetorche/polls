<!--
  - @copyright Copyright (c) 2018 René Gieling <github@dartcafe.de>
  -
  - @author René Gieling <github@dartcafe.de>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -
  -->

<template lang="html">
	<div class="notification">
		<input id="subscribe" v-model="subscribe" type="checkbox"
			class="checkbox">
		<label for="subscribe">{{ t('polls', 'Receive notification email on activity') }}</label>
	</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'Notification',

	computed: {
		...mapState({
			notification: state => state.notification,
			event: state => state.event
		}),

		subscribe: {
			get() {
				return this.notification.subscribed
			},
			set(value) {
				this.$store.commit('setNotification', value)
				this.$store.dispatch('writeSubscriptionPromise', { pollId: this.event.id })
			}
		}
	},

	mounted() {
		this.$store.dispatch('getSubscription', { pollId: this.$route.params.id })
	}

}
</script>

<style lang="css" scoped>
	.notification {
		padding: 24px;
	}
</style>

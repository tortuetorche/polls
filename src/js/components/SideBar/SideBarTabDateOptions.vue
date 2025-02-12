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

<template>
	<div>
		<div class="configBox">
			<label class="title icon-calendar">
				{{ t('polls', 'Add a date option') }}
			</label>
			<DatePicker v-bind="optionDatePicker" style="width:100%" confirm
				@change="addOption($event)" />
		</div>

		<div class="configBox">
			<label class="title icon-history">
				{{ t('polls', 'Shift all date options') }}
			</label>
			<div>
				<div class="selectUnit">
					<input v-model="move.step">
					<Multiselect v-model="move.unit" :options="move.units" />
				</div>
			</div>
			<div>
				<button class="button btn primary" @click="shiftDates(move)">
					<span>{{ t('polls', 'Shift') }}</span>
				</button>
			</div>
		</div>

		<ul class="configBox poll-table">
			<label class="title icon-calendar">
				{{ t('polls', 'Available Options') }}
			</label>
			<DatePollItem v-for="(option) in sortedOptions"
				:key="option.id"
				:option="option"
				@remove="removeOption(option)" />
		</ul>
	</div>
</template>

<script>
import { Multiselect } from '@nextcloud/vue'
import moment from 'moment'
import { mapGetters, mapState } from 'vuex'
import DatePollItem from '../Create/CreateDateItem'

export default {
	name: 'SideBarTabDateOptions',

	components: {
		Multiselect,
		DatePollItem

	},

	data() {
		return {
			move: {
				step: 1,
				unit: 'week',
				units: ['minute', 'hour', 'day', 'week', 'month', 'year']
			}
		}
	},

	computed: {
		...mapState({
			options: state => state.options
		}),

		...mapGetters([ 'languageCodeShort', 'sortedOptions' ]),

		optionDatePicker() {
			return {
				editable: false,
				minuteStep: 1,
				type: 'datetime',
				format: this.dateTimeFormat,
				lang: this.languageCodeShort,
				placeholder: t('polls', 'Click to add a date'),
				timePickerOptions: {
					start: '00:00',
					step: '00:30',
					end: '23:30'
				}
			}
		}
	},

	methods: {

		addOption(pollOptionText) {
			this.$store.dispatch('addOptionAsync', { pollOptionText: pollOptionText })
		},

		shiftDates(payload) {
			let store = this.$store
			this.options.list.forEach(function(existingOption) {
				let option = Object.assign({}, existingOption)
				option.pollOptionText = moment(option.pollOptionText).add(payload.step, payload.unit).format('YYYY-MM-DD HH:mm:ss')
				option.timestamp = moment.utc(option.pollOptionText).unix()
				store.dispatch('updateOptionAsync', { option: option })
			})
		},

		removeOption(option) {
			this.$store.dispatch('removeOptionAsync', { option: option })
		}

	}

}
</script>

<style lang="scss">
	.configBox {
		display: flex;
		flex-direction: column;
		padding: 8px;
		& > * {
			padding-left: 21px;
		}

		& > input {
			margin-left: 24px;
			width: auto;

		}

		& > textarea {
			margin-left: 24px;
			width: auto;
			padding: 7px 6px;
		}

		& > .title {
			display: flex;
			background-position: 0 2px;
			padding-left: 24px;
			opacity: 0.7;
			font-weight: bold;
			margin-bottom: 4px;
			& > span {
				padding-left: 4px;
			}
		}
		&.poll-table > li {
			border-bottom-color: rgb(72, 72, 72);
			margin-left: 18px;
		}
	}
</style>
